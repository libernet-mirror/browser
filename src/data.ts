// NOTE: this module is imported by both the main process and the renderer process, so all
// definitions here must be runnable in both and therefore must not use Node.js stuff.

export interface TabDescriptor {
  id: number;
  title: string;
  url: string;
  icons: string[];
}

export class ProtocolVersion {
  public constructor(
    public readonly major: number,
    public readonly minor: number,
    public readonly build: number,
  ) {}

  public toString(): string {
    return `${this.major}.${this.minor}.${this.build}`;
  }

  public isIncompatibleWith(other: ProtocolVersion): boolean {
    if (this.major > 0) {
      return other.major !== this.major;
    } else {
      return other.major > 0 || other.minor !== this.minor;
    }
  }

  public isCompatibleWith(other: ProtocolVersion): boolean {
    return !this.isIncompatibleWith(other);
  }

  public isInteroperableWith(other: ProtocolVersion): boolean {
    if (this.major > 1) {
      return other.major > this.major - 2 && other.major < this.major + 2;
    } else if (this.major > 0) {
      return other.major > 0 && other.major < 3;
    } else {
      return other.major < 1 && other.minor === this.minor;
    }
  }
}

export class GeographicalLocation {
  public constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

export class NodeIdentity {
  public constructor(
    public readonly protocolVersion: ProtocolVersion,
    public readonly chainId: number,
    public readonly accountAddress: string,
    public readonly location: GeographicalLocation,
    public readonly networkAddress: string,
    public readonly grpcPort: number,
    public readonly timestamp: Date,
  ) {}
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
