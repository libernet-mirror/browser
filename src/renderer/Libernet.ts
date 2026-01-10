import {
  type AccountInfo,
  type TransactionInfo,
  type TransactionPayload,
  type TransactionQueryParams,
  type TransactionType,
} from "../data";

export type ContentView = "control" | "web" | "settings" | "wallet";

export interface LibernetAPI {
  getView(): Promise<ContentView>;
  getUrl(): Promise<string>;
  setUrl(url: string): Promise<void>;
  onUrl(listener: (url: string) => void): () => void;
  onViewChange(listener: (view: ContentView) => void): () => void;
  onStartNavigation(listener: () => void): () => void;
  onFinishNavigation(listener: () => void): () => void;
  navigateBack(): Promise<string>;
  navigateForward(): Promise<string>;
  startRefresh(): void;
  cancelNavigation(): void;
  getNodeList(): Promise<string[]>;
  setNodeList(nodes: string[]): Promise<void>;
  getWalletStatus(): Promise<"none" | "stored" | "loaded">;
  createWallet(passwords: string[]): Promise<boolean>;
  loadWallet(password: string, accountIndex: number): Promise<boolean>;
  switchAccount(accountIndex: number): Promise<void>;
  getAccountAddress(index: number): Promise<string>;
  getAccountByNumber(index: number): Promise<AccountInfo>;
  getAccountByAddress(address: string): Promise<AccountInfo>;
  watchAccount(address: string): Promise<void>;
  unwatchAccount(address: string): Promise<void>;
  onAccountChange(
    listener: (account: AccountInfo) => void,
    address: string,
  ): () => void;
  getTransaction(transactionHash: string): Promise<TransactionInfo>;
  queryTransactions(params: TransactionQueryParams): Promise<TransactionInfo[]>;
  submitTransaction(
    type: TransactionType,
    payload: TransactionPayload,
  ): Promise<void>;
}

export function libernet(): LibernetAPI {
  return (window as unknown as { libernet: LibernetAPI }).libernet;
}
