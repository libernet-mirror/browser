import path from "node:path";

import { app } from "electron";

import {
  credentials as grpcCredentials,
  loadPackageDefinition,
  type GrpcObject,
  type ServiceClientConstructor,
} from "@grpc/grpc-js";

import { type Account } from "../crypto-bindings/crypto";

import type { AccountInfo as AccountInfoProto } from "./proto/libernet/AccountInfo";
import type { BlockDescriptor as BlockDescriptorProto } from "./proto/libernet/BlockDescriptor";
import type { GetAccountResponse } from "./proto/libernet/GetAccountResponse";
import type { MerkleProof as MerkleProofProto } from "./proto/libernet/MerkleProof";

import { AccountInfo, BlockDescriptor } from "./data";
import { Proxy } from "./proxy";
import {
  decodeBigInt,
  decodeScalar,
  decodeTimestamp,
  encodeScalar,
  libernetPackageDefinition,
  unpackAny,
} from "./utilities";

const BOOTSTRAP_NODE_ADDRESS = "localhost:4443";

const packageDefinition = loadPackageDefinition(libernetPackageDefinition)
  .libernet as GrpcObject;

export class Libernet {
  private readonly _client;

  private static _getUnixSocketAddress(target: string): string {
    return path.join(
      app.getPath("temp"),
      `libernet-${process.pid}-${target}.sock`,
    );
  }

  private constructor(
    public readonly account: Account,
    private readonly _proxy: Proxy,
  ) {
    this._client = new (packageDefinition[
      "NodeServiceV1"
    ] as ServiceClientConstructor)(
      `unix://${Libernet._getUnixSocketAddress(BOOTSTRAP_NODE_ADDRESS)}`,
      grpcCredentials.createInsecure(),
    );
  }

  public static async create(account: Account): Promise<Libernet> {
    const proxy = await Proxy.create(
      account,
      Libernet._getUnixSocketAddress(BOOTSTRAP_NODE_ADDRESS),
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

  private static _decodeAccountInfo(
    address: string,
    blockProto: BlockDescriptorProto,
    accountProto: AccountInfoProto,
  ): AccountInfo {
    const blockDescriptor = Libernet._decodeBlockDescriptor(blockProto);
    const lastNonce = parseInt("" + accountProto.last_nonce, 10);
    const balance = decodeBigInt(accountProto.balance.value);
    const stakingBalance = decodeBigInt(accountProto.staking_balance.value);
    return new AccountInfo(
      address,
      blockDescriptor,
      lastNonce,
      balance,
      stakingBalance,
    );
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
            return;
          }
          let info;
          try {
            const proof = unpackAny<MerkleProofProto>(response.payload);
            const proto = unpackAny<AccountInfoProto>(proof.value);
            info = Libernet._decodeAccountInfo(
              address,
              proof.block_descriptor,
              proto,
            );
          } catch (error) {
            reject(error);
            return;
          }
          resolve(info);
        },
      );
    });
  }

  public async destroy(): Promise<void> {
    await this._proxy.destroy();
  }
}
