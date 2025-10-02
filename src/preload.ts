import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("libernet", {
  deriveAccount: (password: string, index: number) =>
    ipcRenderer.invoke("wallet/derive-account", password, index),
});

contextBridge.exposeInMainWorld("__dirname", __dirname);
