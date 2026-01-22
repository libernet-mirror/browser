import path from "node:path";

import {
  app,
  BaseWindow,
  BaseWindowConstructorOptions,
  BrowserWindowConstructorOptions,
  HandlerDetails,
  ipcMain,
  WebContents,
} from "electron";

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
  URL_PREFIX_PATTERN,
} from "./constants";
import { ControlBar } from "./controls";
import { Tab, TabOverrideSettings } from "./tab";

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
  private _currentTabIndex: number;

  private _createTab(url: string, overrides: TabOverrideSettings = {}): Tab {
    return new Tab(
      this._window,
      url,
      overrides,
      () => this._updateControlBar(),
      () => this._controlBar.onStartNavigation(),
      () => this._controlBar.onFinishNavigation(),
      ({ url, disposition }: HandlerDetails) =>
        ({ webPreferences }: BrowserWindowConstructorOptions) =>
          this._insertTab(
            this._tabs.length,
            url,
            {
              session: webPreferences?.session,
              partition: webPreferences?.partition,
            },
            /*activate=*/ disposition !== "background-tab",
          ),
    );
  }

  private constructor(tabUrls: string[], settings: BrowserWindowSettings) {
    if (tabUrls.length < 1) {
      throw new Error("at least one tab URL must be specified");
    }

    const options: BaseWindowConstructorOptions = {
      title: "Libernet",
      icon: path.join(app.getAppPath(), ".webpack", "images", "logo.png"),
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

    this._tabs = tabUrls.map((url) => this._createTab(url));
    this._currentTabIndex = 0;
    this._getCurrentTab().show();

    this._window
      .on("resize", () => {
        this._controlBar.resize();
        this._getCurrentTab().resize();
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

    ipcMain.handle("window/minimize", () => this._window.minimize());

    ipcMain.handle("window/maximize", () => {
      if (this._window.isMaximized()) {
        this._window.unmaximize();
      } else {
        this._window.maximize();
      }
    });

    ipcMain.handle("window/close", () => this.close());

    ipcMain.handle("window/get-tabs", () =>
      this._tabs.map((tab) => tab.getDescriptor()),
    );

    ipcMain.handle("window/get-active-tab", () => this._currentTabIndex);

    ipcMain.handle("window/select-tab", (_, index: number) =>
      this._setCurrentTab(index),
    );

    ipcMain.handle("window/add-tab", () => this._addTab());

    ipcMain.handle("window/remove-tab", (_, index: number) =>
      this._destroyTabAt(index),
    );

    ipcMain.handle("root/get-url", () => this._getCurrentTab().getUrl());
    ipcMain.handle("root/set-url", (_, url: string) => this._setUrl(url));

    ipcMain.handle("root/back", () => this._getCurrentTab().goBack());
    ipcMain.handle("root/forward", () => this._getCurrentTab().goForward());
    ipcMain.handle("root/refresh", () => this._getCurrentTab().reload());
    ipcMain.handle("root/cancel-navigation", () =>
      this._getCurrentTab().stopLoading(),
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

  private _getCurrentTab(): Tab {
    return this._tabs[this._currentTabIndex];
  }

  private _updateControlBar(): void {
    this._controlBar.update(
      this._tabs.map((tab) => tab.getDescriptor()),
      this._currentTabIndex,
    );
  }

  private _setCurrentTab(index: number): void {
    this._getCurrentTab().hide();
    this._currentTabIndex = index;
    this._getCurrentTab().show();
    this._updateControlBar();
  }

  private _insertTab(
    index: number,
    url: string,
    overrides: TabOverrideSettings,
    activate: boolean,
  ): WebContents {
    if (index < 0) {
      throw new Error(`invalid new tab index ${index}`);
    }
    if (index > this._tabs.length) {
      throw new Error(
        `invalid new tab index ${index}, must be less than or equal to ${this._tabs.length}`,
      );
    }
    if (activate) {
      this._getCurrentTab().hide();
      this._currentTabIndex = index;
    } else if (this._currentTabIndex >= index) {
      this._currentTabIndex++;
    }
    this._tabs.splice(index, 0, this._createTab(url, overrides));
    const tab = this._getCurrentTab();
    if (activate) {
      tab.show();
    }
    this._updateControlBar();
    return tab.getView().webContents;
  }

  private _addTab(): void {
    this._insertTab(
      this._tabs.length,
      "liber://new",
      /*overrides=*/ {},
      /*activate=*/ true,
    );
  }

  private _destroyTabAt(index: number): void {
    this._tabs.splice(index, 1).forEach((tab) => {
      tab.hide();
      tab.free();
    });
    if (!this._tabs.length) {
      this._window.close();
      return;
    }
    this._currentTabIndex = Math.min(
      this._currentTabIndex,
      this._tabs.length - 1,
    );
    this._getCurrentTab().show();
    this._updateControlBar();
  }

  private _setUrl(url: string): void {
    if (!URL_PREFIX_PATTERN.test(url)) {
      if (DNS_HEURISTIC_PREFIX_PATTERN.test(url)) {
        url = "http://" + url;
      } else {
        url = DEFAULT_SEARCH_ENGINE.replace("$QUERY$", encodeURIComponent(url));
      }
    }
    this._getCurrentTab().setUrl(url);
  }

  public close(): void {
    this._window.close();
    for (const tab of this._tabs) {
      tab.free();
    }
  }
}
