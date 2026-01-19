// Copyright 2025 The Libernet Team
// SPDX-License-Identifier: Apache-2.0

import fs from "node:fs/promises";
import path from "node:path";

import { app, BrowserWindow as ElectronBrowserWindow, ipcMain } from "electron";

import { getHomeAddress, saveHomeAddress } from "./config";
import {
  DNS_NAME_PATTERN,
  DNS_PREFIX_PATTERN,
  URL_PREFIX_PATTERN,
} from "./constants";
import {
  getBootstrapNodes,
  libernet,
  setBootstrapNodes,
  setLibernetAccount,
} from "./libernet";
import { BrowserWindow } from "./window";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished initialization and is ready to create
// browser windows. Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  await BrowserWindow.create();
});

// Quit when all windows are closed, except on macOS. There, it's common for applications and their
// menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the dock icon is clicked and there
  // are no other windows open.
  if (ElectronBrowserWindow.getAllWindows().length === 0) {
    await BrowserWindow.create();
  }
});

// In this file you can include the rest of your app's specific main process code. You can also put
// them in separate files and import them here.

import { Mutex } from "./mutex";
import { Wallet, WalletData } from "./wallet";
import {
  type TransactionPayload,
  type TransactionQueryParams,
  type TransactionType,
} from "./data";

const walletFileMutex = new Mutex();

function getWalletPath(): string {
  return path.join(app.getPath("userData"), "wallet.json");
}

ipcMain.handle("settings/get-home-page", () => getHomeAddress());

ipcMain.handle("settings/set-home-page", async (_, homePage: string) => {
  homePage = (() => {
    if (URL_PREFIX_PATTERN.test(homePage)) {
      return homePage;
    } else if (DNS_NAME_PATTERN.test(homePage)) {
      return `https://${homePage}/`;
    } else if (DNS_PREFIX_PATTERN.test(homePage)) {
      return "https://" + homePage;
    } else {
      throw new Error(`invalid URL: ${JSON.stringify(homePage)}`);
    }
  })();
  await saveHomeAddress(homePage);
  return homePage;
});

ipcMain.handle("net/get-node-list", () => getBootstrapNodes());

ipcMain.handle("net/set-node-list", async (_, addresses: string[]) => {
  await setBootstrapNodes(addresses);
});

ipcMain.handle("wallet/get-status", async () => {
  if (Wallet.isLoaded()) {
    return "loaded";
  }
  try {
    await fs.stat(getWalletPath());
    return "stored";
  } catch {
    return "none";
  }
});

ipcMain.handle("wallet/create", async (_, passwords: string[]) => {
  const wallet = await Wallet.create(passwords);
  const data: WalletData = {
    version: "1.0",
    seed: wallet.seed,
    c: wallet.commitment,
    y: wallet.proofs,
  };
  const path = getWalletPath();
  const text = JSON.stringify(data, null, 2);
  await walletFileMutex.locked(async () => {
    await fs.writeFile(path, text);
    try {
      await fs.chmod(path, 0o400);
    } catch (error) {
      console.error(error);
    }
  });
  console.log(`${path} written`);
});

ipcMain.handle(
  "wallet/load",
  async (_, password: string, accountIndex: number) => {
    const path = getWalletPath();
    console.log(`reading ${path}`);
    const data = (
      await walletFileMutex.locked(() => fs.readFile(path))
    ).toString("utf-8");
    await Wallet.load_v1_0(JSON.parse(data) as WalletData, password);
    await setLibernetAccount(accountIndex);
    return true;
  },
);

ipcMain.handle("wallet/switch-account", async (_, accountIndex: number) => {
  await setLibernetAccount(accountIndex);
});

ipcMain.handle("wallet/get-account-address", async (_, index: number) => {
  return Wallet.get().getAccountByNumber(index).address();
});

ipcMain.handle("wallet/get-account-by-number", async (_, index: number) => {
  const address = Wallet.get().getAccountByNumber(index).address();
  return await (await libernet()).getAccountInfo(address);
});

ipcMain.handle("wallet/get-account-by-address", async (_, address: string) => {
  return await (await libernet()).getAccountInfo(address);
});

ipcMain.handle("net/watch-account", async (_, address: string) => {
  (await libernet()).watchAccount(address);
});

ipcMain.handle("net/unwatch-account", async (_, address: string) => {
  (await libernet()).unwatchAccount(address);
});

ipcMain.handle(
  "net/get-transaction",
  async (_, transactionHash: string) =>
    await (await libernet()).getTransaction(transactionHash),
);

ipcMain.handle(
  "net/query-transactions",
  async (_, params: TransactionQueryParams) =>
    await (await libernet()).queryTransactions(params),
);

ipcMain.handle(
  "net/submit-transaction",
  async (_, type: TransactionType, payload: TransactionPayload) =>
    await (await libernet()).submitTransaction(type, payload),
);
