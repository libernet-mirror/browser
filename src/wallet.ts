import type {
  Wallet as NativeWallet,
  Account,
} from "../crypto-bindings/crypto";

const getNativeWallet = (() => {
  let cls: typeof NativeWallet | null = null;
  return async () => {
    if (!cls) {
      const { Wallet: NativeWallet } = await import(
        "../crypto-bindings/crypto"
      );
      cls = NativeWallet;
    }
    return cls;
  };
})();

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
  string,
  string,
  string,
  string,
  string,
];

export type WalletData = {
  version: "1.0";
  num_kdf_rounds: number;
  salt: string;
  seed: string;
  c: string;
  y: WalletDataProofs;
};

export class Wallet {
  public static readonly NUM_KDF_ROUNDS = 500_000;

  private static _instance: Wallet | null = null;

  private readonly _accountsByNumber = new Map<number, Account>();
  private readonly _accountsByAddress = new Map<string, Account>();

  private constructor(
    private readonly _inner: NativeWallet,
    private readonly _password: string,
  ) {}

  public static isLoaded(): boolean {
    return !!Wallet._instance;
  }

  public static async create(passwords: string[]): Promise<Wallet> {
    return (Wallet._instance = new Wallet(
      (await getNativeWallet()).create(passwords, Wallet.NUM_KDF_ROUNDS),
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
      (await getNativeWallet()).load(
        data.num_kdf_rounds,
        data.salt,
        data.seed,
        data.c,
        data.y,
      ),
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

  public get salt(): string {
    return this._inner.salt();
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
