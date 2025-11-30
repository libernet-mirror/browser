import path from "node:path";

import { app } from "electron";

import {
  credentials as grpcCredentials,
  loadPackageDefinition,
  type ClientReadableStream,
  type GrpcObject,
  type ServiceClientConstructor,
} from "@grpc/grpc-js";

import type {
  Account,
  BinaryMerkleProof32,
  TernaryMerkleProof,
} from "../crypto-bindings/crypto";

import type { AccountInfo as AccountInfoProto } from "./proto/libernet/AccountInfo";
import type { AccountSubscriptionResponse } from "./proto/libernet/AccountSubscriptionResponse";
import type { BlockDescriptor as BlockDescriptorProto } from "./proto/libernet/BlockDescriptor";
import type { GetAccountResponse } from "./proto/libernet/GetAccountResponse";
import type { GetTransactionResponse } from "./proto/libernet/GetTransactionResponse";
import type { MerkleProof as MerkleProofProto } from "./proto/libernet/MerkleProof";
import type { QueryTransactionsResponse } from "./proto/libernet/QueryTransactionsResponse";
import type {
  Transaction as TransactionProto,
  _libernet_Transaction_Payload as TransactionPayloadProto,
} from "./proto/libernet/Transaction";

import {
  createBinaryMerkleProof32,
  createTernaryMerkleProof,
  poseidonHash,
} from "./crypto";
import {
  AccountInfo,
  BlockDescriptor,
  TransactionInfo,
  TransactionPayload,
  TransactionQueryParams,
} from "./data";
import { Mutex } from "./mutex";
import { Proxy } from "./proxy";
import {
  decodeBigInt,
  decodeScalar,
  decodeTimestamp,
  encodeScalar,
  libernetPackageDefinition,
  toScalar,
  unpackAny,
} from "./utilities";
import { Wallet } from "./wallet";

export const DEFAULT_BOOTSTRAP_NODE_ADDRESSES: string[] = ["localhost:4443"];

const packageDefinition = loadPackageDefinition(libernetPackageDefinition)
  .libernet as GrpcObject;

export type AccountListener = (account: AccountInfo) => void;

class AccountWatcher {
  private _watchCount = 1;

  public constructor(
    private readonly _call: ClientReadableStream<AccountSubscriptionResponse>,
    accountCallback: (accountProof: MerkleProofProto) => void,
    finishCallback: (error?: Error) => void,
  ) {
    this._call
      .on("data", (response: AccountSubscriptionResponse) => {
        const proofs = response.account_proof;
        accountCallback(proofs[proofs.length - 1]);
      })
      .on("end", finishCallback)
      .on("error", finishCallback);
  }

  public ref(): void {
    this._watchCount++;
  }

  public unref(): boolean {
    return --this._watchCount < 1;
  }
}

export class Libernet {
  private static _bootstrapNodes = DEFAULT_BOOTSTRAP_NODE_ADDRESSES;

  private static _socketCounter = 0;

  private readonly _client;
  private readonly _accountWatchers = new Map<string, AccountWatcher>();

  private readonly _accountListeners = new Set<AccountListener>();

  public static getBootstrapNodes(): string[] {
    return Libernet._bootstrapNodes;
  }

  public static setBootstrapNodes(addresses: string[]): void {
    Libernet._bootstrapNodes = addresses;
  }

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
    const target =
      Libernet._bootstrapNodes[
        Math.floor(Math.random() * Libernet._bootstrapNodes.length)
      ];
    const proxy = await Proxy.create(
      account,
      Libernet._getUnixSocketPath(target),
      target,
    );
    return new Libernet(account, proxy);
  }

  private static async _decodeBlockDescriptor(
    proto: BlockDescriptorProto,
  ): Promise<BlockDescriptor> {
    const blockHash = decodeScalar(proto.block_hash.value);
    const chainId = parseInt("" + proto.chain_id, 10);
    const blockNumber = parseInt("" + proto.block_number, 10);
    const previousBlockHash = decodeScalar(proto.previous_block_hash.value);
    const timestamp = decodeTimestamp(proto.timestamp);
    const networkTopologyRootHash = decodeScalar(
      proto.network_topology_root_hash.value,
    );
    const transactionsRootHash = decodeScalar(
      proto.transactions_root_hash.value,
    );
    const accountsRootHash = decodeScalar(proto.accounts_root_hash.value);
    const programStorageRootHash = decodeScalar(
      proto.program_storage_root_hash.value,
    );
    const computedHash = await poseidonHash([
      toScalar(chainId),
      toScalar(blockNumber),
      previousBlockHash,
      toScalar(~~(timestamp.valueOf() / 1000)),
      networkTopologyRootHash,
      transactionsRootHash,
      accountsRootHash,
      programStorageRootHash,
    ]);
    if (computedHash !== blockHash) {
      throw new Error(
        `invalid block hash (got ${blockHash}, want ${computedHash})`,
      );
    }
    return new BlockDescriptor(
      blockHash,
      chainId,
      blockNumber,
      previousBlockHash,
      timestamp,
      networkTopologyRootHash,
      transactionsRootHash,
      accountsRootHash,
      programStorageRootHash,
    );
  }

  private static async _decodeBinaryMerkleProof32(
    proto: MerkleProofProto,
    valueAsScalar: string,
    rootHash: string,
  ): Promise<BinaryMerkleProof32> {
    return await createBinaryMerkleProof32(
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

  private static async _decodeTernaryMerkleProof(
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
    blockDescriptor: BlockDescriptor,
    accountProto: AccountInfoProto,
  ): Promise<AccountInfo> {
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

  private static async _processAccountProof(
    address: string,
    proofProto: MerkleProofProto,
  ): Promise<AccountInfo> {
    const blockDescriptor = await Libernet._decodeBlockDescriptor(
      proofProto.block_descriptor,
    );
    const proto = unpackAny<AccountInfoProto>(proofProto.value);
    const info = await Libernet._decodeAccountInfo(
      address,
      blockDescriptor,
      proto,
    );
    const proof = await Libernet._decodeTernaryMerkleProof(
      proofProto,
      info.hash,
      blockDescriptor.accountsRootHash,
    );
    try {
      proof.verify();
    } finally {
      proof.free();
    }
    return info;
  }

  private static async _decodeTransaction(
    blockDescriptor: BlockDescriptor,
    transactionProto: TransactionProto,
  ): Promise<TransactionInfo> {
    const signerAddress = decodeScalar(transactionProto.signature.signer.value);
    const content = unpackAny<TransactionPayloadProto>(
      transactionProto.payload,
    );
    const chainId = parseInt("" + content.chain_id, 10);
    const nonce = parseInt("" + content.nonce, 10);
    let payload: TransactionPayload;
    let transactionHash: string;
    switch (content.transaction) {
      case "block_reward":
        {
          if (!content.block_reward) {
            throw new Error("transaction payload missing");
          }
          const recipient = decodeScalar(content.block_reward.recipient.value);
          const amount = decodeScalar(content.block_reward.amount.value);
          transactionHash = await poseidonHash([
            signerAddress,
            toScalar(chainId),
            toScalar(nonce),
            recipient,
            amount,
          ]);
          payload = { recipient, amount };
        }
        break;
      case "send_coins":
        {
          if (!content.send_coins) {
            throw new Error("transaction payload missing");
          }
          const recipient = decodeScalar(content.send_coins.recipient.value);
          const amount = decodeScalar(content.send_coins.amount.value);
          transactionHash = await poseidonHash([
            signerAddress,
            toScalar(chainId),
            toScalar(nonce),
            recipient,
            amount,
          ]);
          payload = { recipient, amount };
        }
        break;
      case "create_program": {
        if (!content.create_program) {
          throw new Error("transaction payload missing");
        }
        // TODO: implement this.
        throw new Error("not implemented yet");
      }
      default:
        throw new Error(
          `invalid transaction type: ${JSON.stringify(content.transaction)}`,
        );
    }
    return new TransactionInfo(
      transactionHash,
      blockDescriptor,
      signerAddress,
      chainId,
      nonce,
      content.transaction,
      payload,
    );
  }

  private static async _processTransactionInclusionProof(
    proofProto: MerkleProofProto,
    transactionHash?: string,
  ): Promise<TransactionInfo> {
    const blockDescriptor = await Libernet._decodeBlockDescriptor(
      proofProto.block_descriptor,
    );
    const proto = unpackAny<TransactionProto>(proofProto.value);
    const info = await Libernet._decodeTransaction(blockDescriptor, proto);
    if (transactionHash && info.hash !== transactionHash) {
      throw new Error(
        `bad transaction hash (got ${info.hash}, want ${transactionHash})`,
      );
    }
    const proof = await Libernet._decodeBinaryMerkleProof32(
      proofProto,
      info.hash,
      blockDescriptor.transactionsRootHash,
    );
    try {
      proof.verify();
    } finally {
      proof.free();
    }
    return info;
  }

  private static _processTransactionInclusionProofs(
    proofProtos: MerkleProofProto[],
  ): Promise<TransactionInfo[]> {
    return Promise.all(
      proofProtos.map((proof) =>
        Libernet._processTransactionInclusionProof(proof),
      ),
    );
  }

  public getAccountInfo(address: string): Promise<AccountInfo> {
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
            Libernet._processAccountProof(address, response.account_proof)
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

  public watchAccount(address: string): void {
    const key = address.toLowerCase();
    let watcher = this._accountWatchers.get(key);
    if (watcher) {
      watcher.ref();
      return;
    }
    const call = this._client.subscribeToAccount({
      account_address: { value: encodeScalar(address) },
      every_block: true,
    });
    watcher = new AccountWatcher(
      call,
      async (accountProof) => {
        let proof;
        try {
          proof = await Libernet._processAccountProof(address, accountProof);
        } catch (error) {
          console.error("invalid account proof");
          console.error(error);
          return;
        }
        for (const listener of this._accountListeners) {
          try {
            listener(proof);
          } catch (error) {
            console.error(error);
          }
        }
      },
      () => {
        this._accountWatchers.delete(key);
      },
    );
    this._accountWatchers.set(key, watcher);
  }

  public unwatchAccount(address: string): void {
    const key = address.toLowerCase();
    const watcher = this._accountWatchers.get(key);
    if (watcher?.unref()) {
      this._accountWatchers.delete(key);
    }
  }

  public onAccountProof(listener: AccountListener): Libernet {
    this._accountListeners.add(listener);
    return this;
  }

  public offAccountProof(listener: AccountListener): Libernet {
    this._accountListeners.delete(listener);
    return this;
  }

  public getTransaction(transactionHash: string): Promise<TransactionInfo> {
    return new Promise((resolve, reject) => {
      this._client.getTransaction(
        {
          transaction_hash: encodeScalar(transactionHash),
        },
        (error: unknown, response: GetTransactionResponse) => {
          if (error) {
            reject(error);
          } else {
            Libernet._processTransactionInclusionProof(
              response.transaction_proof,
              transactionHash,
            )
              .then(resolve)
              .catch(reject);
          }
        },
      );
    });
  }

  public queryTransactions(
    params: TransactionQueryParams,
  ): Promise<TransactionInfo[]> {
    return new Promise((resolve, reject) => {
      this._client.queryTransactions(
        {
          from_filter: params.from ? encodeScalar(params.from) : null,
          to_filter: params.to ? encodeScalar(params.to) : null,
          sort_order: (() => {
            switch (params.sortOrder) {
              case "ascending":
                return "TRANSACTION_SORT_ORDER_ASCENDING";
              case "descending":
                return "TRANSACTION_SORT_ORDER_DESCENDING";
              default:
                return null;
            }
          })(),
          max_count: params.maxCount ?? null,
          start_block_filter: params.startBlockHash ? "start_block_hash" : null,
          start_block_hash: params.startBlockHash
            ? encodeScalar(params.startBlockHash)
            : null,
          end_block_filter: params.endBlockHash ? "end_block_hash" : null,
          end_block_hash: params.endBlockHash
            ? encodeScalar(params.endBlockHash)
            : null,
        },
        (error: unknown, response: QueryTransactionsResponse) => {
          if (error) {
            reject(error);
            return;
          }
          if (response.transaction_proofs !== "individual_proofs") {
            throw new Error("unsupported proof type");
          }
          Libernet._processTransactionInclusionProofs(
            response.individual_proofs?.individual_proof || [],
          )
            .then(resolve)
            .catch(reject);
        },
      );
    });
  }

  public async destroy(): Promise<void> {
    await this._proxy.destroy();
  }
}

class LibernetManager {
  public static readonly INSTANCE = new LibernetManager();

  private readonly _accountListeners = new Set<AccountListener>();

  private readonly _mutex = new Mutex();
  private _accountIndex = 0;
  private _account: Account | null = null; // not owned -- don't free
  private _libernet: Libernet | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public async setBootstrapNodes(addresses: string[]): Promise<void> {
    Libernet.setBootstrapNodes(addresses.sort());
    const accountIndex = this._accountIndex;
    await this.destroy();
    await this.setAccount(accountIndex);
  }

  public onAccountProof(listener: AccountListener): LibernetManager {
    this._accountListeners.add(listener);
    return this;
  }

  public offAccountProof(listener: AccountListener): LibernetManager {
    this._accountListeners.delete(listener);
    return this;
  }

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
          this._libernet.onAccountProof((proof) => {
            for (const listener of this._accountListeners) {
              try {
                listener(proof);
              } catch (error) {
                console.error(error);
              }
            }
          });
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

export function getBootstrapNodes(): string[] {
  return Libernet.getBootstrapNodes();
}

export async function setBootstrapNodes(addresses: string[]): Promise<void> {
  await LibernetManager.INSTANCE.setBootstrapNodes(addresses);
}

export async function setLibernetAccount(accountIndex: number): Promise<void> {
  await LibernetManager.INSTANCE.setAccount(accountIndex);
}

export function onAccountProof(listener: AccountListener): void {
  LibernetManager.INSTANCE.onAccountProof(listener);
}

export function offAccountProof(listener: AccountListener): void {
  LibernetManager.INSTANCE.offAccountProof(listener);
}

export function libernet(...args: number[]): Promise<Libernet> {
  return LibernetManager.INSTANCE.libernet(...args);
}
