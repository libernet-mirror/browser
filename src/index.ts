// Copyright 2025 The Libernet Team
// SPDX-License-Identifier: Apache-2.0

import fs from "node:fs/promises";
import path from "node:path";

import {
  app,
  BaseWindow,
  BrowserWindow as ElectronBrowserWindow,
  ipcMain,
  WebContentsView,
} from "electron";

import { getHomeAddress, saveHomeAddress } from "./config";
import {
  CONTROL_BAR_HEIGHT,
  DEFAULT_SEARCH_ENGINE,
  DNS_HEURISTIC_PREFIX_PATTERN,
  DNS_NAME_PATTERN,
  DNS_PREFIX_PATTERN,
  INITIAL_HEIGHT,
  INITIAL_WIDTH,
  PRELOAD_WEBPACK_ENTRY,
  WEBPACK_ENTRY,
  SYSTEM_URL_SETTINGS,
  SYSTEM_URL_WALLET,
  URL_PREFIX_PATTERN,
} from "./constants";
import {
  type AccountListener,
  getBootstrapNodes,
  libernet,
  offAccountProof,
  onAccountProof,
  setBootstrapNodes,
  setLibernetAccount,
} from "./libernet";
import { BrowserWindow } from "./window";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  const mainWindow = new BaseWindow({
    title: "Libernet",
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  });
  mainWindow.setMenu(null);

  const controlBar = new WebContentsView({
    webPreferences: {
      contextIsolation: true,
      devTools: false,
      preload: PRELOAD_WEBPACK_ENTRY,
    },
  });
  controlBar.setBackgroundColor("#0fff");
  controlBar.setBounds({
    x: 0,
    y: 0,
    width: INITIAL_WIDTH,
    height: CONTROL_BAR_HEIGHT,
  });
  controlBar.webContents.loadURL(WEBPACK_ENTRY);

  let viewType: "web" | "settings" | "wallet" = "web";
  let currentView: WebContentsView | null = null;
  let currentUrl = await getHomeAddress();

  let accountListener: AccountListener | null = null;

  const installAccountListenerFor = async (view: WebContentsView) => {
    if (accountListener) {
      offAccountProof(accountListener);
    }
    accountListener = (proof) => {
      view.webContents.send("net/watch-account", proof);
    };
    onAccountProof(accountListener);
  };

  const removeAccountListener = async () => {
    if (accountListener) {
      offAccountProof(accountListener);
      accountListener = null;
    }
  };

  const setSystemView = async (systemAddress: "settings" | "wallet") => {
    console.log(`setSystemView(${JSON.stringify(systemAddress)})`);
    if (viewType === "web") {
      if (currentView) {
        await removeAccountListener();
        currentView.removeAllListeners();
        mainWindow.contentView.removeChildView(currentView);
        currentView.webContents.close();
        currentView = null;
      }
    }
    viewType = systemAddress;
    if (!currentView) {
      currentView = new WebContentsView({
        webPreferences: {
          contextIsolation: true,
          devTools: false,
          preload: PRELOAD_WEBPACK_ENTRY,
        },
      });
      const { width, height } = mainWindow.getBounds();
      currentView.setBounds({
        x: 0,
        y: CONTROL_BAR_HEIGHT,
        width,
        height: height - CONTROL_BAR_HEIGHT,
      });
      mainWindow.contentView.addChildView(currentView);
      mainWindow.contentView.addChildView(controlBar);
      await installAccountListenerFor(currentView);
    }
    currentUrl = "liber://" + systemAddress;
    controlBar.webContents.send("root/url", currentUrl);
    currentView.webContents.send("root/view-change", systemAddress);
    await currentView.webContents.loadURL(WEBPACK_ENTRY);
  };

  const setWebView = async (url: string) => {
    console.log(`setWebView(${JSON.stringify(url)})`);
    const match = url.match(URL_PREFIX_PATTERN);
    if (!match) {
      if (DNS_HEURISTIC_PREFIX_PATTERN.test(url)) {
        url = "http://" + url;
      } else {
        url = DEFAULT_SEARCH_ENGINE.replace("$QUERY$", encodeURIComponent(url));
      }
    }
    {
      const protocol = match[1];
      if (protocol !== "http" && protocol !== "https") {
        throw new Error(`invalid protocol "${protocol}"`);
      }
    }
    if (viewType !== "web") {
      if (currentView) {
        await removeAccountListener();
        currentView.removeAllListeners();
        mainWindow.contentView.removeChildView(currentView);
        currentView.webContents.close();
        currentView = null;
      }
      viewType = "web";
    }
    if (!currentView) {
      currentView = new WebContentsView({
        webPreferences: {
          contextIsolation: true,
          devTools: true,
        },
      });
      const { width, height } = mainWindow.getBounds();
      currentView.setBounds({
        x: 0,
        y: CONTROL_BAR_HEIGHT,
        width,
        height: height - CONTROL_BAR_HEIGHT,
      });
      currentView.webContents
        .on("will-navigate", ({ url, isMainFrame }) => {
          if (isMainFrame) {
            controlBar.webContents.send("root/url", (currentUrl = url));
          }
        })
        .on("did-navigate", (_, url) => {
          controlBar.webContents.send("root/url", (currentUrl = url));
        })
        .on("did-navigate-in-page", (_, url, isMainFrame) => {
          if (isMainFrame) {
            controlBar.webContents.send("root/url", (currentUrl = url));
          }
        })
        .on("did-start-loading", () => {
          controlBar.webContents.send("root/start-navigation");
        })
        .on("did-stop-loading", () => {
          controlBar.webContents.send("root/finish-navigation");
        });
      mainWindow.contentView.addChildView(currentView);
      mainWindow.contentView.addChildView(controlBar);
    }
    currentUrl = url;
    controlBar.webContents.send("root/url", currentUrl);
    await currentView.webContents.loadURL(currentUrl);
  };

  ipcMain.handle("root/get-view", async ({ sender }) => {
    switch (sender) {
      case controlBar.webContents:
        return "control";
      case currentView?.webContents:
        return viewType;
      default:
        throw new Error();
    }
  });

  ipcMain.handle("root/get-url", async () => currentUrl);

  ipcMain.handle("root/set-url", async (_, url: string) => {
    switch (url) {
      case SYSTEM_URL_WALLET:
        await setSystemView("wallet");
        break;
      case SYSTEM_URL_SETTINGS:
        await setSystemView("settings");
        break;
      default:
        await setWebView(url);
        break;
    }
  });

  ipcMain.handle("root/back", () => {
    const history = currentView?.webContents.navigationHistory;
    if (history) {
      history.goBack();
      const entry = history.getEntryAtIndex(history.getActiveIndex());
      return entry.url;
    } else {
      return "";
    }
  });

  ipcMain.handle("root/forward", () => {
    const history = currentView?.webContents.navigationHistory;
    if (history) {
      history.goForward();
      const entry = history.getEntryAtIndex(history.getActiveIndex());
      return entry.url;
    } else {
      return "";
    }
  });

  ipcMain.handle("root/refresh", () => {
    currentView?.webContents.reload();
  });

  ipcMain.handle("root/cancel-navigation", () => {
    currentView?.webContents.stop();
  });

  mainWindow.on("resize", () => {
    const { width, height } = mainWindow.getBounds();
    controlBar.setBounds({ x: 0, y: 0, width, height: CONTROL_BAR_HEIGHT });
    currentView?.setBounds({
      x: 0,
      y: CONTROL_BAR_HEIGHT,
      width,
      height: height - CONTROL_BAR_HEIGHT,
    });
  });

  await setWebView(currentUrl);
};

// This method will be called when Electron has finished initialization and is ready to create
// browser windows. Some APIs can only be used after this event occurs.
app.on("ready", () => BrowserWindow.create());

// Quit when all windows are closed, except on macOS. There, it's common for applications and their
// menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the dock icon is clicked and there
  // are no other windows open.
  if (ElectronBrowserWindow.getAllWindows().length === 0) {
    BrowserWindow.create();
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
