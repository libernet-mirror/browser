import type {
  Wallet as NativeWallet,
  Account,
} from "../crypto-bindings/crypto";

import {
  createWallet as createNativeWallet,
  loadWallet as loadNativeWallet,
} from "./crypto";

export type WalletDataProofs = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type WalletData = {
  version: "1.0";
  seed: string;
  c: string;
  y: WalletDataProofs;
};

export class Wallet {
  private static _instance: Wallet | null = null;

  private readonly _accountsByNumber = new Map<number, Account>();
  private readonly _accountsByAddress = new Map<string, Account>();

  private constructor(
    private readonly _inner: NativeWallet,
    private readonly _password: string,
  ) {
    // Load the first account to make sure the password is valid.
    this.getAccountByNumber(0);
  }

  public static isLoaded(): boolean {
    return !!Wallet._instance;
  }

  public static async create(passwords: string[]): Promise<Wallet> {
    return (Wallet._instance = new Wallet(
      await createNativeWallet(passwords),
      passwords[0],
    ));
  }

  public static async load_v1_0(
    data: WalletData,
    password: string,
  ): Promise<Wallet> {
    if (data.version !== "1.0") {
      throw new Error("unrecognized wallet format");
    }
    return (Wallet._instance = new Wallet(
      await loadNativeWallet(data.seed, data.c, data.y),
      password,
    ));
  }

  public static get(): Wallet {
    if (Wallet._instance) {
      return Wallet._instance;
    } else {
      throw new Error("wallet not loaded");
    }
  }

  public getAccountByNumber(index: number): Account {
    let account = this._accountsByNumber.get(index);
    if (!account) {
      account = this._inner.derive_account(this._password, index);
      this._accountsByNumber.set(index, account);
      this._accountsByAddress.set(account.address(), account);
    }
    return account;
  }

  public getAccountByAddress(address: string): Account {
    const account = this._accountsByAddress.get(address);
    if (account) {
      return account;
    } else {
      throw new Error(`account ${address} not found`);
    }
  }

  public get seed(): string {
    return this._inner.seed();
  }

  public get commitment(): string {
    return this._inner.commitment();
  }

  public get proofs(): WalletDataProofs {
    return this._inner.y() as WalletDataProofs;
  }
}
