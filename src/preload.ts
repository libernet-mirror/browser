import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("libernet", {
  getWalletStatus: () => ipcRenderer.invoke("wallet/get-status"),
  createWallet: (passwords: string[]) =>
    ipcRenderer.invoke("wallet/create", passwords),
  loadWallet: (password: string) => ipcRenderer.invoke("wallet/load", password),
  getAccountByNumber: (index: number) =>
    ipcRenderer.invoke("wallet/get-account-by-number", index),
});

contextBridge.exposeInMainWorld("__dirname", __dirname);
