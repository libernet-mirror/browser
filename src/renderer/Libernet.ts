export interface LibernetAPI {
  getView(): Promise<"control" | "web" | "system">;
  getUrl(): Promise<string>;
  setUrl(url: string): Promise<void>;
  onUrl(listener: (url: string) => void): () => void;
  startRefresh(): void;
  getWalletStatus(): Promise<"none" | "stored" | "loaded">;
  createWallet(passwords: string[]): Promise<boolean>;
  loadWallet(password: string): Promise<boolean>;
  getAccountByNumber(index: number): Promise<string>;
  getAccountBalance(address: string): Promise<string>;
}

export function libernet(): LibernetAPI {
  return (window as unknown as { libernet: LibernetAPI }).libernet;
}
