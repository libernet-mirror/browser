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

import type { Any as AnyProto } from "./proto/google/protobuf/Any";
import type { AccountInfo as AccountInfoProto } from "./proto/libernet/AccountInfo";
import type { AccountSubscriptionResponse } from "./proto/libernet/AccountSubscriptionResponse";
import type { BlockDescriptor as BlockDescriptorProto } from "./proto/libernet/BlockDescriptor";
import type { GetAccountResponse } from "./proto/libernet/GetAccountResponse";
import type { GetTransactionResponse } from "./proto/libernet/GetTransactionResponse";
import type { MerkleProof as MerkleProofProto } from "./proto/libernet/MerkleProof";
import type {
  _libernet_NodeIdentity_Payload as NodeIdentityPayload,
  NodeIdentity as NodeIdentityProto,
} from "./proto/libernet/NodeIdentity";
import type { QueryTransactionsResponse } from "./proto/libernet/QueryTransactionsResponse";
import type { Signature as SignatureProto } from "./proto/libernet/Signature";
import type {
  Transaction as TransactionProto,
  _libernet_Transaction_Payload as TransactionPayloadProto,
} from "./proto/libernet/Transaction";

import { getNetworkId, getNodeList, saveNodeList } from "./config";
import { PROTOCOL_VERSION } from "./constants";
import {
  createBinaryMerkleProof32,
  createRemoteAccount,
  createTernaryMerkleProof,
  poseidonHashT3,
  poseidonHashT4,
} from "./crypto";
import {
  AccountInfo,
  BlockDescriptor,
  CoinTransferTransactionPayload,
  GeographicalLocation,
  NodeIdentity,
  ProtocolVersion,
  TransactionInfo,
  TransactionPayload,
  TransactionQueryParams,
  TransactionType,
} from "./data";
import { Mutex } from "./mutex";
import { Proxy } from "./proxy";
import {
  decodeBigInt,
  decodeLong,
  decodePointG1,
  decodePointG2,
  decodeScalar,
  decodeTimestamp,
  encodeAnyCanonical,
  encodeBigInt,
  encodeMessageCanonical,
  encodePointG1,
  encodePointG2,
  encodeScalar,
  libernetPackageDefinition,
  toScalar,
  unpackAny,
} from "./utilities";
import { Wallet } from "./wallet";

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
        const proofs = response.accountProof;
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
  private static _socketCounter = 0;

  private readonly _client;
  private readonly _accountWatchers = new Map<string, AccountWatcher>();

  private readonly _accountListeners = new Set<AccountListener>();

  public static async getBootstrapNodes(): Promise<string[]> {
    return (await getNodeList()).map(
      ({ address, port }) => `${address}:${port}`,
    );
  }

  public static async setBootstrapNodes(addresses: string[]): Promise<void> {
    await saveNodeList(
      addresses
        .map((address) => {
          const match = address.match(/^([^:]*)(?::([0-9]+))?$/);
          if (!match) {
            console.error(`invalid node address: ${address}`);
            return null;
          }
          return {
            address: match[1],
            port: parseInt(match[2] ?? "50051", 10),
          };
        })
        .filter((address) => !!address),
    );
  }

  private static _getUnixSocketPath(target: string): string {
    return path.join(
      app.getPath("temp"),
      `libernet-${process.pid}-${Libernet._socketCounter++}-${target}.sock`,
    );
  }

  private constructor(
    public readonly networkId: number,
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

  private async _verifySignedMessage<T>(
    payload: AnyProto | null,
    signature: SignatureProto | null,
    expectedSigner: string | null,
  ): Promise<T> {
    if (!payload) {
      throw new Error("received an invalid signed message");
    }
    if (!signature) {
      throw new Error("received an invalid signature");
    }
    const remoteAccount = await createRemoteAccount(
      decodePointG1(signature.publicKey),
    );
    if (remoteAccount.address() !== decodeScalar(signature.signer)) {
      throw new Error("received an invalid signature");
    }
    if (expectedSigner && remoteAccount.address() !== expectedSigner) {
      throw new Error("received an invalid signature");
    }
    this._proxy.remoteAccount.bls_verify(
      encodeAnyCanonical(payload),
      decodePointG2(signature.signature),
    );
    return unpackAny<T>(payload);
  }

  private async _decodeNodeIdentity(
    identity: NodeIdentityProto,
  ): Promise<NodeIdentity> {
    const payload = await this._verifySignedMessage<NodeIdentityPayload>(
      identity.payload,
      identity.signature,
      this._proxy.remoteAccount.address(),
    );
    if (!payload.accountAddress) {
      throw new Error("invalid node identity: missing account address");
    }
    return new NodeIdentity(
      new ProtocolVersion(
        payload.protocolVersion.major ?? 0,
        payload.protocolVersion.minor ?? 0,
        payload.protocolVersion.build ?? 0,
      ),
      decodeLong(payload.chainId),
      decodeScalar(payload.accountAddress),
      new GeographicalLocation(
        payload.location.latitude ?? 0,
        payload.location.longitude ?? 0,
      ),
      payload.networkAddress ?? "",
      payload.grpcPort,
      decodeTimestamp(payload.timestamp),
    );
  }

  private async _getPeerIdentity(): Promise<NodeIdentity> {
    return new Promise((resolve, reject) => {
      this._client.getIdentity(
        {},
        (error: unknown, response: NodeIdentityProto) => {
          if (error) {
            reject(error);
          } else {
            resolve(this._decodeNodeIdentity(response));
          }
        },
      );
    });
  }

  public static async create(account: Account): Promise<Libernet> {
    const nodes = await Libernet.getBootstrapNodes();
    const target = nodes[Math.floor(Math.random() * nodes.length)];
    const [networkId, proxy] = await Promise.all([
      getNetworkId(),
      Proxy.create(account, Libernet._getUnixSocketPath(target), target),
    ]);
    const libernet = new Libernet(networkId, account, proxy);
    try {
      const peerIdentity = await libernet._getPeerIdentity();
      if (peerIdentity.chainId !== networkId) {
        throw new Error(
          `the node at ${target} runs on a different network (id=${peerIdentity.chainId})`,
        );
      }
      if (!peerIdentity.protocolVersion.isInteroperableWith(PROTOCOL_VERSION)) {
        throw new Error(
          `the node at ${target} uses an incompatible protocol version (they have ${peerIdentity.protocolVersion}, we have ${PROTOCOL_VERSION})`,
        );
      }
    } catch (e) {
      await libernet.destroy();
      throw e;
    }
    return libernet;
  }

  private static async _decodeBlockDescriptor(
    proto: BlockDescriptorProto,
  ): Promise<BlockDescriptor> {
    const blockHash = decodeScalar(proto.blockHash);
    const chainId = parseInt("" + proto.chainId, 10);
    const blockNumber = parseInt("" + proto.blockNumber, 10);
    const previousBlockHash = decodeScalar(proto.previousBlockHash);
    const timestamp = decodeTimestamp(proto.timestamp);
    const networkTopologyRootHash = decodeScalar(proto.networkTopologyRootHash);
    const transactionsRootHash = decodeScalar(proto.transactionsRootHash);
    const accountsRootHash = decodeScalar(proto.accountsRootHash);
    const programStorageRootHash = decodeScalar(proto.programStorageRootHash);
    const computedHash = await poseidonHashT4([
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
      decodeScalar(proto.key),
      valueAsScalar,
      rootHash,
      proto.path
        .map((node) => node.childHashes.map((hash) => decodeScalar(hash)))
        .flat(),
    );
  }

  private static async _decodeTernaryMerkleProof(
    proto: MerkleProofProto,
    valueAsScalar: string,
    rootHash: string,
  ): Promise<TernaryMerkleProof> {
    return await createTernaryMerkleProof(
      decodeScalar(proto.key),
      valueAsScalar,
      rootHash,
      proto.path
        .map((node) => node.childHashes.map((hash) => decodeScalar(hash)))
        .flat(),
    );
  }

  private static async _decodeAccountInfo(
    address: string,
    blockDescriptor: BlockDescriptor,
    accountProto: AccountInfoProto,
  ): Promise<AccountInfo> {
    const lastNonce = decodeLong(accountProto.lastNonce);
    const balance = decodeBigInt(accountProto.balance);
    const stakingBalance = decodeBigInt(accountProto.stakingBalance);
    const hash = await poseidonHashT4([
      "0x" + lastNonce.toString(16),
      decodeScalar(accountProto.balance),
      decodeScalar(accountProto.stakingBalance),
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
      proofProto.blockDescriptor,
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

  private async _decodeTransaction(
    blockDescriptor: BlockDescriptor | null,
    transactionProto: TransactionProto,
    validate: boolean,
  ): Promise<TransactionInfo> {
    const { signature } = transactionProto;
    if (!signature) {
      throw new Error("invalid transaction signature");
    }
    const signerAddress = decodeScalar(signature.signer);
    if (validate) {
      const signer = await createRemoteAccount(
        decodePointG1(signature.publicKey),
      );
      if (signer.address() !== signerAddress) {
        throw new Error("invalid transaction signature");
      }
    }
    const content = unpackAny<TransactionPayloadProto>(
      transactionProto.payload,
    );
    const chainId = parseInt("" + content.chainId, 10);
    if (validate && chainId !== this.networkId) {
      throw new Error("invalid chain ID in transaction");
    }
    const nonce = parseInt("" + content.nonce, 10);
    let payload: TransactionPayload;
    let transactionHash: string;
    switch (content.transaction) {
      case "blockReward":
        {
          if (!content.blockReward) {
            throw new Error("transaction payload missing");
          }
          const recipient = decodeScalar(content.blockReward.recipient);
          const amount = decodeScalar(content.blockReward.amount);
          transactionHash = await poseidonHashT3([
            signerAddress,
            toScalar(chainId),
            toScalar(nonce),
            recipient,
            amount,
          ]);
          payload = {
            recipient,
            amount: decodeBigInt(encodeScalar(amount)),
          };
        }
        break;
      case "sendCoins":
        {
          if (!content.sendCoins) {
            throw new Error("transaction payload missing");
          }
          const recipient = decodeScalar(content.sendCoins.recipient);
          const amount = decodeScalar(content.sendCoins.amount);
          transactionHash = await poseidonHashT3([
            signerAddress,
            toScalar(chainId),
            toScalar(nonce),
            recipient,
            amount,
          ]);
          payload = {
            recipient,
            amount: decodeBigInt(encodeScalar(amount)),
          };
        }
        break;
      case "createProgram": {
        if (!content.createProgram) {
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

  private async _processTransactionInclusionProof(
    proofProto: MerkleProofProto,
    transactionHash?: string,
    validateTransaction = false,
  ): Promise<TransactionInfo> {
    const blockDescriptor = await Libernet._decodeBlockDescriptor(
      proofProto.blockDescriptor,
    );
    const proto = unpackAny<TransactionProto>(proofProto.value);
    const info = await this._decodeTransaction(
      blockDescriptor,
      proto,
      validateTransaction,
    );
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

  private _processTransactionInclusionProofs(
    proofProtos: MerkleProofProto[],
  ): Promise<TransactionInfo[]> {
    return Promise.all(
      proofProtos.map((proof) => this._processTransactionInclusionProof(proof)),
    );
  }

  public getAccountInfo(address: string): Promise<AccountInfo> {
    return new Promise((resolve, reject) => {
      this._client.getAccount(
        {
          blockHash: null,
          accountAddress: encodeScalar(address),
        },
        (error: unknown, response: GetAccountResponse) => {
          if (error) {
            reject(error);
          } else {
            Libernet._processAccountProof(address, response.accountProof)
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
      accountAddress: encodeScalar(address),
      everyBlock: true,
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
          transactionHash: encodeScalar(transactionHash),
        },
        (error: unknown, response: GetTransactionResponse) => {
          if (error) {
            reject(error);
          } else {
            this._processTransactionInclusionProof(
              response.transactionProof,
              transactionHash,
              /*validateTransaction=*/ true,
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
          fromFilter: params.from ? encodeScalar(params.from) : null,
          toFilter: params.to ? encodeScalar(params.to) : null,
          sortOrder: (() => {
            switch (params.sortOrder) {
              case "ascending":
                return "TRANSACTION_SORT_ORDER_ASCENDING";
              case "descending":
                return "TRANSACTION_SORT_ORDER_DESCENDING";
              default:
                return null;
            }
          })(),
          maxCount: params.maxCount ?? null,
          startBlockFilter: params.startBlockHash ? "startBlockHash" : null,
          startBlockHash: params.startBlockHash
            ? encodeScalar(params.startBlockHash)
            : null,
          endBlockFilter: params.endBlockHash ? "endBlockHash" : null,
          endBlockHash: params.endBlockHash
            ? encodeScalar(params.endBlockHash)
            : null,
        },
        (error: unknown, response: QueryTransactionsResponse) => {
          if (error) {
            reject(error);
            return;
          }
          if (!response.individualProofs) {
            throw new Error("unsupported proof type");
          }
          this._processTransactionInclusionProofs(
            response.individualProofs.individualProof || [],
          )
            .then(resolve)
            .catch(reject);
        },
      );
    });
  }

  private _submitTransactionImpl(
    payload: TransactionPayloadProto,
  ): Promise<TransactionInfo> {
    return new Promise((resolve, reject) => {
      const { any, bytes } = encodeMessageCanonical(
        payload,
        "libernet.Transaction.Payload",
      );
      const signature = this.account.bls_sign(bytes);
      const proto: TransactionProto = {
        payload: any,
        signature: {
          signer: encodeScalar(this.account.address()),
          publicKey: encodePointG1(this.account.public_key()),
          signature: encodePointG2(signature),
        },
      };
      this._client.broadcastTransaction(
        {
          transaction: proto,
          ttl: 2,
        },
        (error: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(this._decodeTransaction(null, proto, false));
          }
        },
      );
    });
  }

  public async submitTransaction(
    type: TransactionType,
    payload: TransactionPayload,
    nonceOverride?: number,
  ): Promise<TransactionInfo> {
    if (type !== "sendCoins") {
      throw new Error("unsupported transaction type");
    }
    const typedPayload = payload as CoinTransferTransactionPayload;
    let nonce: number;
    if (nonceOverride) {
      nonce = nonceOverride;
    } else {
      const { lastNonce } = await this.getOwnAccountInfo();
      nonce = lastNonce + 1;
    }
    return this._submitTransactionImpl({
      chainId: this.networkId,
      nonce,
      transaction: "sendCoins",
      sendCoins: {
        recipient: encodeScalar(typedPayload.recipient),
        amount: encodeBigInt(typedPayload.amount),
      },
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

  public async resetConnection(): Promise<void> {
    if (this._libernet) {
      const libernet = this._libernet;
      this._libernet = null;
      await libernet.destroy();
    }
  }

  public async destroy(): Promise<void> {
    if (this._libernet) {
      const libernet = this._libernet;
      this._libernet = null;
      await libernet.destroy();
    }
    if (this._account) {
      this._account = null;
    }
  }
}

export async function getBootstrapNodes(): Promise<string[]> {
  return await Libernet.getBootstrapNodes();
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
