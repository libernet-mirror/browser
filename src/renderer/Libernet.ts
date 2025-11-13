import { AccountInfo } from "../data";

export interface LibernetAPI {
  getView(): Promise<"control" | "web" | "system">;
  getUrl(): Promise<string>;
  setUrl(url: string): Promise<void>;
  onUrl(listener: (url: string) => void): () => void;
  navigateBack(): Promise<string>;
  navigateForward(): Promise<string>;
  startRefresh(): void;
  getWalletStatus(): Promise<"none" | "stored" | "loaded">;
  createWallet(passwords: string[]): Promise<boolean>;
  loadWallet(password: string, accountIndex: number): Promise<boolean>;
  switchAccount(accountIndex: number): Promise<void>;
  getAccountAddress(index: number): Promise<string>;
  getAccountByNumber(index: number): Promise<AccountInfo>;
  getAccountByAddress(address: string): Promise<AccountInfo>;
}

export function libernet(): LibernetAPI {
  return (window as unknown as { libernet: LibernetAPI }).libernet;
}
