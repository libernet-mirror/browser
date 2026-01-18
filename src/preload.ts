import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

import {
  type AccountInfo,
  type TransactionPayload,
  type TransactionQueryParams,
  type TransactionType,
} from "./data";

function makeEventHandler<Listener extends (...args: never[]) => void>(
  name: string,
): (listener: Listener) => () => void {
  return (listener) => {
    const lowLevelListener = (_event: IpcRendererEvent, ...args: never[]) => {
      listener(...args);
    };
    ipcRenderer.on(name, lowLevelListener);
    return () => {
      ipcRenderer.off(name, lowLevelListener);
    };
  };
}

type NavigationListener = () => void;
type UrlListener = (url: string) => void;
type ViewListener = (view: string) => void;
type AccountListener = (account: AccountInfo) => void;

contextBridge.exposeInMainWorld("libernet", {
  getHomePage: () => ipcRenderer.invoke("settings/get-home-page"),
  setHomePage: (homePage: string) =>
    ipcRenderer.invoke("settings/set-home-page", homePage),
  minimizeWindow: () => ipcRenderer.invoke("window/minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window/maximize"),
  closeWindow: () => ipcRenderer.invoke("window/close"),
  getView: () => ipcRenderer.invoke("root/get-view"),
  getUrl: () => ipcRenderer.invoke("root/get-url"),
  setUrl: (url: string) => ipcRenderer.invoke("root/set-url", url),
  onUrl: makeEventHandler<UrlListener>("root/url"),
  onViewChange: makeEventHandler<ViewListener>("root/view-change"),
  onStartNavigation: makeEventHandler<NavigationListener>(
    "root/start-navigation",
  ),
  onFinishNavigation: makeEventHandler<NavigationListener>(
    "root/finish-navigation",
  ),
  navigateBack: () => ipcRenderer.invoke("root/back"),
  navigateForward: () => ipcRenderer.invoke("root/forward"),
  startRefresh: () => ipcRenderer.invoke("root/refresh"),
  cancelNavigation: () => ipcRenderer.invoke("root/cancel-navigation"),
  getNodeList: () => ipcRenderer.invoke("net/get-node-list"),
  setNodeList: (nodes: string[]) =>
    ipcRenderer.invoke("net/set-node-list", nodes),
  getWalletStatus: () => ipcRenderer.invoke("wallet/get-status"),
  createWallet: (passwords: string[]) =>
    ipcRenderer.invoke("wallet/create", passwords),
  loadWallet: (password: string, accountIndex: number) =>
    ipcRenderer.invoke("wallet/load", password, accountIndex),
  switchAccount: (accountIndex: number) =>
    ipcRenderer.invoke("wallet/switch-account", accountIndex),
  getAccountAddress: (index: number) =>
    ipcRenderer.invoke("wallet/get-account-address", index),
  getAccountByNumber: (index: number) =>
    ipcRenderer.invoke("wallet/get-account-by-number", index),
  getAccountByAddress: (address: string) =>
    ipcRenderer.invoke("wallet/get-account-by-address", address),
  watchAccount: (address: string) =>
    ipcRenderer.invoke("net/watch-account", address),
  unwatchAccount: (address: string) =>
    ipcRenderer.invoke("net/unwatch-account", address),
  onAccountChange: makeEventHandler<AccountListener>(`net/watch-account`),
  getTransaction: (transactionHash: string) =>
    ipcRenderer.invoke("net/get-transaction", transactionHash),
  queryTransactions: (params: TransactionQueryParams) =>
    ipcRenderer.invoke("net/query-transactions", params),
  submitTransaction: (type: TransactionType, payload: TransactionPayload) =>
    ipcRenderer.invoke("net/submit-transaction", type, payload),
});
