import {
  type AccountInfo,
  type TabDescriptor,
  type TransactionInfo,
  type TransactionPayload,
  type TransactionQueryParams,
  type TransactionType,
} from "../data";

export interface LibernetAPI {
  getHomePage(): Promise<string>;
  setHomePage(homePage: string): Promise<string>;
  minimizeWindow(): Promise<void>;
  maximizeWindow(): Promise<void>;
  closeWindow(): Promise<void>;
  getTabs(): Promise<TabDescriptor[]>;
  getActiveTabId(): Promise<number>;
  selectTab(id: number): Promise<void>;
  addTab(): Promise<void>;
  deleteTab(id: number): Promise<void>;
  onTabs(
    listener: (tabs: TabDescriptor[], activeTabId: number) => void,
  ): () => void;
  getUrl(tabId: number): Promise<string>;
  setUrl(url: string): Promise<void>;
  onUrl(tabId: number, listener: (url: string) => void): () => void;
  isTabLoading(tabId: number): Promise<boolean>;
  onStartNavigation(tabId: number, listener: () => void): () => void;
  onFinishNavigation(tabId: number, listener: () => void): () => void;
  navigateBack(): Promise<void>;
  navigateForward(): Promise<void>;
  startRefresh(): void;
  cancelNavigation(): void;
  getNetworkId(): Promise<number>;
  setNetworkId(id: number): Promise<void>;
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
  ): Promise<TransactionInfo>;
}

export function libernet(): LibernetAPI {
  return (window as unknown as { libernet: LibernetAPI }).libernet;
}
