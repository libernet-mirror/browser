// NOTE: this module is imported by both the main process and the renderer process, so all
// definitions here must be runnable in both and therefore must not use Node.js stuff.

export class BlockDescriptor {
  public constructor(
    public readonly blockHash: string,
    public readonly chainId: number,
    public readonly blockNumber: number,
    public readonly previousBlockHash: string,
    public readonly timestamp: Date,
    public readonly networkTopologyRootHash: string,
    public readonly lastTransactionHash: string,
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
