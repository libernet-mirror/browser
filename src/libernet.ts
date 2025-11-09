import path from "node:path";

import { app } from "electron";

import {
  credentials as grpcCredentials,
  loadPackageDefinition,
  type GrpcObject,
  type ServiceClientConstructor,
} from "@grpc/grpc-js";

import type { Account, TernaryMerkleProof } from "../crypto-bindings/crypto";

import type { AccountInfo as AccountInfoProto } from "./proto/libernet/AccountInfo";
import type { BlockDescriptor as BlockDescriptorProto } from "./proto/libernet/BlockDescriptor";
import type { GetAccountResponse } from "./proto/libernet/GetAccountResponse";
import type { MerkleProof as MerkleProofProto } from "./proto/libernet/MerkleProof";

import { createTernaryMerkleProof, poseidonHash } from "./crypto";
import { AccountInfo, BlockDescriptor } from "./data";
import { Mutex } from "./mutex";
import { Proxy } from "./proxy";
import {
  decodeBigInt,
  decodeScalar,
  decodeTimestamp,
  encodeScalar,
  libernetPackageDefinition,
  unpackAny,
} from "./utilities";
import { Wallet } from "./wallet";

const BOOTSTRAP_NODE_ADDRESS = "localhost:4443";

const packageDefinition = loadPackageDefinition(libernetPackageDefinition)
  .libernet as GrpcObject;

export class Libernet {
  private static _socketCounter = 0;

  private readonly _client;

  private static _getUnixSocketPath(target: string): string {
    return path.join(
      app.getPath("temp"),
      `libernet-${process.pid}-${Libernet._socketCounter++}-${target}.sock`,
    );
  }

  private constructor(
    public readonly account: Account,
    private readonly _proxy: Proxy,
  ) {
    this._client = new (packageDefinition[
      "NodeServiceV1"
    ] as ServiceClientConstructor)(
      `unix://${_proxy.path}`,
      grpcCredentials.createInsecure(),
    );
  }

  public static async create(account: Account): Promise<Libernet> {
    const proxy = await Proxy.create(
      account,
      Libernet._getUnixSocketPath(BOOTSTRAP_NODE_ADDRESS),
      BOOTSTRAP_NODE_ADDRESS,
    );
    return new Libernet(account, proxy);
  }

  private static _decodeBlockDescriptor(
    proto: BlockDescriptorProto,
  ): BlockDescriptor {
    const blockHash = decodeScalar(proto.block_hash.value);
    const chainId = parseInt("" + proto.chain_id, 10);
    const blockNumber = parseInt("" + proto.block_number, 10);
    const previousBlockHash = decodeScalar(proto.previous_block_hash.value);
    const timestamp = decodeTimestamp(proto.timestamp);
    const networkTopologyRootHash = decodeScalar(
      proto.network_topology_root_hash.value,
    );
    const lastTransactionHash = decodeScalar(proto.last_transaction_hash.value);
    const accountsRootHash = decodeScalar(proto.accounts_root_hash.value);
    const programStorageRootHash = decodeScalar(
      proto.program_storage_root_hash.value,
    );
    return new BlockDescriptor(
      blockHash,
      chainId,
      blockNumber,
      previousBlockHash,
      timestamp,
      networkTopologyRootHash,
      lastTransactionHash,
      accountsRootHash,
      programStorageRootHash,
    );
  }

  private static async _decodeMerkleProof(
    proto: MerkleProofProto,
    valueAsScalar: string,
    rootHash: string,
  ): Promise<TernaryMerkleProof> {
    return await createTernaryMerkleProof(
      decodeScalar(proto.key.value),
      valueAsScalar,
      rootHash,
      proto.path
        .map((node) =>
          node.child_hashes.map((hash) => decodeScalar(hash.value)),
        )
        .flat(),
    );
  }

  private static async _decodeAccountInfo(
    address: string,
    blockProto: BlockDescriptorProto,
    accountProto: AccountInfoProto,
  ): Promise<AccountInfo> {
    const blockDescriptor = Libernet._decodeBlockDescriptor(blockProto);
    const lastNonce = parseInt("" + accountProto.last_nonce, 10);
    const balance = decodeBigInt(accountProto.balance.value);
    const stakingBalance = decodeBigInt(accountProto.staking_balance.value);
    const hash = await poseidonHash([
      "0x" + lastNonce.toString(16),
      decodeScalar(accountProto.balance.value),
      decodeScalar(accountProto.staking_balance.value),
    ]);
    return new AccountInfo(
      address,
      blockDescriptor,
      hash,
      null,
      lastNonce,
      balance,
      stakingBalance,
    );
  }

  private static async _processAccountResponse(
    address: string,
    response: GetAccountResponse,
  ): Promise<AccountInfo> {
    const proofProto = unpackAny<MerkleProofProto>(response.payload);
    const blockDescriptor = proofProto.block_descriptor;
    const proto = unpackAny<AccountInfoProto>(proofProto.value);
    const info = await Libernet._decodeAccountInfo(
      address,
      blockDescriptor,
      proto,
    );
    const proof = await Libernet._decodeMerkleProof(
      proofProto,
      info.hash,
      decodeScalar(blockDescriptor.accounts_root_hash.value),
    );
    try {
      proof.verify();
    } finally {
      proof.free();
    }
    return info;
  }

  public async getAccountInfo(address: string): Promise<AccountInfo> {
    return new Promise((resolve, reject) => {
      this._client.getAccount(
        {
          block_hash: null,
          account_address: { value: encodeScalar(address) },
        },
        (error: unknown, response: GetAccountResponse) => {
          if (error) {
            reject(error);
          } else {
            Libernet._processAccountResponse(address, response)
              .then(resolve)
              .catch(reject);
          }
        },
      );
    });
  }

  public async getOwnAccountInfo(): Promise<AccountInfo> {
    return (await this.getAccountInfo(this.account.address())).withPublicKey(
      this.account.public_key(),
    );
  }

  public async destroy(): Promise<void> {
    await this._proxy.destroy();
  }
}

class LibernetManager {
  public static readonly INSTANCE = new LibernetManager();

  private readonly _mutex = new Mutex();
  private _accountIndex = 0;
  private _account: Account | null = null; // not owned -- don't free
  private _libernet: Libernet | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public async setAccount(accountIndex: number): Promise<void> {
    if (accountIndex !== this._accountIndex) {
      await this.destroy();
      this._accountIndex = accountIndex;
    }
    if (!this._account) {
      this._account = Wallet.get().getAccountByNumber(accountIndex);
    }
  }

  public async libernet(accountIndex?: number): Promise<Libernet> {
    accountIndex ??= this._accountIndex;
    await this.setAccount(accountIndex);
    if (!this._libernet) {
      await this._mutex.locked(async () => {
        if (!this._libernet && accountIndex === this._accountIndex) {
          this._libernet = await Libernet.create(this._account);
        }
      });
    }
    return this._libernet;
  }

  public async destroy(): Promise<void> {
    if (this._libernet) {
      await this._libernet.destroy();
      this._libernet = null;
    }
    if (this._account) {
      this._account = null;
    }
  }
}

export async function setLibernetAccount(accountIndex: number): Promise<void> {
  await LibernetManager.INSTANCE.setAccount(accountIndex);
}

export function libernet(...args: number[]): Promise<Libernet> {
  return LibernetManager.INSTANCE.libernet(...args);
}
