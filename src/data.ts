// NOTE: this module is imported by both the main process and the renderer process, so all
// definitions here must be runnable in both and therefore must not use Node.js stuff.

export interface TabDescriptor {
  id: number;
  title: string;
  url: string;
  icons: string[];
}

export class BlockDescriptor {
  public constructor(
    public readonly blockHash: string,
    public readonly chainId: number,
    public readonly blockNumber: number,
    public readonly previousBlockHash: string,
    public readonly timestamp: Date,
    public readonly networkTopologyRootHash: string,
    public readonly transactionsRootHash: string,
    public readonly accountsRootHash: string,
    public readonly programStorageRootHash: string,
  ) {}
}

export class AccountInfo {
  public constructor(
    public readonly address: string,
    public readonly blockDescriptor: BlockDescriptor,
    public readonly hash: string,
    public readonly publicKey: string | null,
    public readonly lastNonce: number,
    public readonly balance: bigint,
    public readonly stakingBalance: bigint,
  ) {}

  public withPublicKey(publicKey: string): AccountInfo {
    return new AccountInfo(
      this.address,
      this.blockDescriptor,
      this.hash,
      publicKey,
      this.lastNonce,
      this.balance,
      this.stakingBalance,
    );
  }
}

export type TransactionType = "blockReward" | "sendCoins" | "createProgram";

export const TRANSACTION_TYPES = new Set<TransactionType>([
  "blockReward",
  "sendCoins",
  "createProgram",
]);

export interface BlockRewardTransactionPayload {
  recipient: string;
  amount: bigint;
}

export interface CoinTransferTransactionPayload {
  recipient: string;
  amount: bigint;
}

export interface ProgramCreationTransactionPayload {
  bytecode: ArrayBuffer;
}

export type TransactionPayload =
  | BlockRewardTransactionPayload
  | CoinTransferTransactionPayload
  | ProgramCreationTransactionPayload;

export class TransactionInfo {
  public constructor(
    public readonly hash: string,
    public readonly blockDescriptor: BlockDescriptor | null,
    public readonly signerAddress: string,
    public readonly chainId: number,
    public readonly nonce: number,
    public readonly type: TransactionType,
    public readonly payload: TransactionPayload,
  ) {
    if (blockDescriptor && chainId !== blockDescriptor.chainId) {
      throw new Error(
        `invalid network ID (got ${chainId}, want ${blockDescriptor.chainId})`,
      );
    }
  }
}

export type SortOrder = "ascending" | "descending";

export interface TransactionQueryParams {
  from?: string;
  to?: string;
  startBlockHash?: string;
  endBlockHash?: string;
  sortOrder?: SortOrder;
  maxCount?: number;
}
