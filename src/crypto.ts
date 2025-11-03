import { Mutex } from "./mutex";

import type {
  poseidon_hash,
  TernaryMerkleProof,
  Wallet,
} from "../crypto-bindings/crypto";

class CryptoCacheSlot {
  private readonly _mutex = new Mutex();
  private _symbol: unknown | null = null;

  public constructor(public readonly name: string) {}

  public async load<Type>(): Promise<Type> {
    if (!this._symbol) {
      this._symbol = this._mutex.locked(async () => {
        const crypto: { [name: string]: unknown } = await import(
          "../crypto-bindings/crypto"
        );
        return crypto[this.name];
      });
    }
    return this._symbol as Type;
  }
}

class CryptoLoader {
  public static readonly INSTANCE = new CryptoLoader();

  private readonly _cache: { [symbol: string]: CryptoCacheSlot } =
    Object.create(null);

  public async load<Type>(name: string): Promise<Type> {
    if (!(name in this._cache)) {
      this._cache[name] = new CryptoCacheSlot(name);
    }
    return await this._cache[name].load();
  }

  public static load<Type>(name: string): Promise<Type> {
    return CryptoLoader.INSTANCE.load<Type>(name);
  }
}

export async function poseidonHash(inputs: string[]): Promise<string> {
  const fn = await CryptoLoader.load<typeof poseidon_hash>("poseidon_hash");
  return fn(inputs);
}

export async function createTernaryMerkleProof(
  key: string,
  value: string,
  rootHash: string,
  hashes: string[],
): Promise<TernaryMerkleProof> {
  const cls =
    await CryptoLoader.load<typeof TernaryMerkleProof>("TernaryMerkleProof");
  return cls.from_compressed(key, value, rootHash, hashes);
}

export async function createWallet(passwords: string[]): Promise<Wallet> {
  const cls = await CryptoLoader.load<typeof Wallet>("Wallet");
  return cls.create(passwords);
}

export async function loadWallet(
  seed: string,
  commitment: string,
  y: string[],
): Promise<Wallet> {
  const cls = await CryptoLoader.load<typeof Wallet>("Wallet");
  return cls.load(seed, commitment, y);
}
