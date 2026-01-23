import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

import {
  type AccountInfo,
  type TabDescriptor,
  type TransactionPayload,
  type TransactionQueryParams,
  type TransactionType,
} from "./data";

function makeEventHandler0<Listener extends (...args: never[]) => void>(
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

function makeEventHandler1<Listener extends (...args: never[]) => void, Key>(
  name: string,
): (key: Key, listener: Listener) => () => void {
  const listeners = new Map<Key, Set<Listener>>();
  ipcRenderer.on(
    name,
    (_event: IpcRendererEvent, key: Key, ...args: never[]) => {
      listeners.get(key)?.forEach((listener) => listener(...args));
    },
  );
  return (key: Key, listener: Listener) => {
    const listenersForKey = listeners.get(key);
    if (listenersForKey) {
      listenersForKey.add(listener);
    } else {
      listeners.set(key, new Set([listener]));
    }
    return () => {
      listeners.get(key)?.delete(listener);
    };
  };
}

type TabListListener = (tabs: TabDescriptor[], activeIndex: number) => void;
type NavigationListener = () => void;
type UrlListener = (url: string) => void;
type AccountListener = (account: AccountInfo) => void;

contextBridge.exposeInMainWorld("libernet", {
  getHomePage: () => ipcRenderer.invoke("settings/get-home-page"),
  setHomePage: (homePage: string) =>
    ipcRenderer.invoke("settings/set-home-page", homePage),
  minimizeWindow: () => ipcRenderer.invoke("window/minimize"),
  maximizeWindow: () => ipcRenderer.invoke("window/maximize"),
  closeWindow: () => ipcRenderer.invoke("window/close"),
  getTabs: () => ipcRenderer.invoke("window/get-tabs"),
  getActiveTabId: () => ipcRenderer.invoke("window/get-active-tab"),
  selectTab: (id: number) => ipcRenderer.invoke("window/select-tab", id),
  addTab: () => ipcRenderer.invoke("window/add-tab"),
  deleteTab: (id: number) => ipcRenderer.invoke("window/delete-tab", id),
  onTabs: makeEventHandler0<TabListListener>("window/tabs"),
  getUrl: (tabId: number) => ipcRenderer.invoke("tab/get-url", tabId),
  setUrl: (url: string) => ipcRenderer.invoke("tab/set-url", url),
  onUrl: makeEventHandler1<UrlListener, /*tabId=*/ number>("tab/url"),
  isTabLoading: (tabId: number) => ipcRenderer.invoke("tab/is-loading", tabId),
  onStartNavigation: makeEventHandler1<NavigationListener, /*tabId=*/ number>(
    "tab/start-navigation",
  ),
  onFinishNavigation: makeEventHandler1<NavigationListener, /*tabId=*/ number>(
    "tab/finish-navigation",
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
  onAccountChange: makeEventHandler0<AccountListener>(`net/watch-account`),
  getTransaction: (transactionHash: string) =>
    ipcRenderer.invoke("net/get-transaction", transactionHash),
  queryTransactions: (params: TransactionQueryParams) =>
    ipcRenderer.invoke("net/query-transactions", params),
  submitTransaction: (type: TransactionType, payload: TransactionPayload) =>
    ipcRenderer.invoke("net/submit-transaction", type, payload),
});
