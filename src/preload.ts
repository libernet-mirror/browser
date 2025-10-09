import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

type UrlListener = (url: string) => void;

contextBridge.exposeInMainWorld("libernet", {
  getView: () => ipcRenderer.invoke("root/get-view"),
  getUrl: () => ipcRenderer.invoke("root/get-url"),
  setUrl: (url: string) => ipcRenderer.invoke("root/set-url", url),
  onUrl: (listener: UrlListener) => {
    const lowLevelListener = (_event: IpcRendererEvent, url: string) => {
      listener(url);
    };
    ipcRenderer.on("root/url", lowLevelListener);
    return () => {
      ipcRenderer.off("root/url", lowLevelListener);
    };
  },
  startRefresh: () => ipcRenderer.send("root/refresh"),
  getWalletStatus: () => ipcRenderer.invoke("wallet/get-status"),
  createWallet: (passwords: string[]) =>
    ipcRenderer.invoke("wallet/create", passwords),
  loadWallet: (password: string) => ipcRenderer.invoke("wallet/load", password),
  getAccountByNumber: (index: number) =>
    ipcRenderer.invoke("wallet/get-account-by-number", index),
  getAccountInfo: (address: string) =>
    ipcRenderer.invoke("account/get-info", address),
});
