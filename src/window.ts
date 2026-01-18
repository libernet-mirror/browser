import { BaseWindow, BaseWindowConstructorOptions, ipcMain } from "electron";

import {
  getHomeAddress,
  getWindowPosition,
  getWindowSize,
  isWindowMaximized,
  saveWindowMaximized,
  saveWindowPosition,
  saveWindowSize,
} from "./config";
import {
  DEFAULT_SEARCH_ENGINE,
  DNS_HEURISTIC_PREFIX_PATTERN,
  SYSTEM_URL_SETTINGS,
  SYSTEM_URL_WALLET,
  URL_PROTOCOL_PATTERN,
} from "./constants";
import { ControlBar } from "./controls";
import { Tab } from "./tab";

export interface BrowserWindowSettings {
  x: number | null;
  y: number | null;
  width: number;
  height: number;
  maximized: boolean;
}

export class BrowserWindow {
  private readonly _window: BaseWindow;
  private readonly _controlBar: ControlBar;
  private readonly _tabs: Tab[] = [];
  private _currentTab: Tab;

  private constructor(tabUrls: string[], settings: BrowserWindowSettings) {
    if (tabUrls.length < 1) {
      throw new Error("at least one tab URL must be specified");
    }

    const options: BaseWindowConstructorOptions = {
      title: "Libernet",
      width: settings.width,
      height: settings.height,
      show: false,
      frame: false,
    };
    if (settings.x !== null) {
      options.x = settings.x;
    }
    if (settings.y !== null) {
      options.y = settings.y;
    }
    this._window = new BaseWindow(options);
    this._window.removeMenu();
    if (settings.maximized) {
      this._window.maximize();
    }
    this._window.show();

    this._controlBar = new ControlBar(this._window);

    this._tabs = tabUrls.map(
      (url) =>
        new Tab(
          this._window,
          url,
          (url) => this._controlBar.setUrl(url),
          () => this._controlBar.onStartNavigation(),
          () => this._controlBar.onFinishNavigation(),
        ),
    );
    this._currentTab = this._tabs[0];
    this._currentTab.show();
    this._controlBar.bringForward();

    this._window
      .on("resize", () => {
        this._controlBar.resize();
        this._currentTab.resize();
      })
      .on("moved", async () => {
        const { x, y } = this._window.getBounds();
        await saveWindowPosition(x, y);
      })
      .on("resized", async () => {
        const { width, height } = this._window.getBounds();
        await saveWindowSize(width, height);
      })
      .on("maximize", () => saveWindowMaximized(true))
      .on("unmaximize", () => saveWindowMaximized(false));

    ipcMain.handle("root/get-view", async ({ sender }) => {
      if (this._controlBar.matches(sender)) {
        return "control";
      }
      if (this._currentTab.matches(sender)) {
        const url = this._currentTab.getUrl();
        const [, protocol] = url.match(URL_PROTOCOL_PATTERN);
        switch (protocol) {
          case "http":
          case "https":
          case "file":
            return "web";
        }
        switch (url) {
          case SYSTEM_URL_WALLET:
            return "wallet";
          case SYSTEM_URL_SETTINGS:
            return "settings";
        }
      }
      // TODO: check other tabs.
      throw new Error("invalid request");
    });

    ipcMain.handle("window/minimize", () => this._window.minimize());

    ipcMain.handle("window/maximize", () => {
      if (this._window.isMaximized()) {
        this._window.unmaximize();
      } else {
        this._window.maximize();
      }
    });

    ipcMain.handle("window/close", () => this.close());

    ipcMain.handle("root/get-url", () => this._currentTab.getUrl());
    ipcMain.handle("root/set-url", (_, url) => this._setUrl(url));

    ipcMain.handle("root/back", () => this._currentTab.goBack());
    ipcMain.handle("root/forward", () => this._currentTab.goForward());
    ipcMain.handle("root/refresh", () => this._currentTab.reload());
    ipcMain.handle("root/cancel-navigation", () =>
      this._currentTab.stopLoading(),
    );
  }

  public static async create(): Promise<BrowserWindow> {
    const [maximized, { x, y }, { width, height }, homeAddress] =
      await Promise.all([
        isWindowMaximized(),
        getWindowPosition(),
        getWindowSize(),
        getHomeAddress(),
      ]);
    return new BrowserWindow([homeAddress], { x, y, width, height, maximized });
  }

  private _setCurrentTab(tab: Tab): void {
    this._currentTab.hide();
    this._currentTab = tab;
    tab.show();
    this._controlBar.bringForward();
  }

  private _setUrl(url: string): void {
    if (!URL_PROTOCOL_PATTERN.test(url)) {
      if (DNS_HEURISTIC_PREFIX_PATTERN.test(url)) {
        url = "http://" + url;
      } else {
        url = DEFAULT_SEARCH_ENGINE.replace("$QUERY$", encodeURIComponent(url));
      }
    }
    this._controlBar.setUrl(url);
    this._currentTab.setUrl(url);
  }

  public close(): void {
    this._window.close();
    for (const tab of this._tabs) {
      tab.free();
    }
  }
}
