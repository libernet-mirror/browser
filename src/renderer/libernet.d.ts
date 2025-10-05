interface LibernetAPI {
  getWalletStatus(): Promise<"none" | "stored" | "loaded">;
  createWallet(passwords: string[]): Promise<boolean>;
  loadWallet(password: string): Promise<boolean>;
  getAccountByNumber(index: number): Promise<string>;
}

interface Window {
  libernet: LibernetAPI;
}
