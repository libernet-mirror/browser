import path from "node:path";

import {
  app,
  BaseWindow,
  BaseWindowConstructorOptions,
  HandlerDetails,
  ipcMain,
  Menu,
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
  CONTROL_BAR_HEIGHT,
  DEFAULT_SEARCH_ENGINE,
  DNS_HEURISTIC_PREFIX_PATTERN,
  URL_PREFIX_PATTERN,
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

enum NewTabDisposition {
  Activate,
  Load,
  Idle,
}

export class BrowserWindow {
  private readonly _window: BaseWindow;
  private readonly _mainMenu: Menu;
  private readonly _controlBar: ControlBar;
  private readonly _tabs: Tab[] = [];
  private _currentTabIndex: number;

  private _getTabIndex(id: number): number {
    const index = this._tabs.findIndex((tab) => tab.id === id);
    if (index < 0) {
      throw new Error(`tab ID ${id} not found`);
    }
    return index;
  }

  private _getTab(id: number): Tab {
    return this._tabs[this._getTabIndex(id)];
  }

  private _getCurrentTab(): Tab {
    return this._tabs[this._currentTabIndex];
  }

  private _createTab(url: string): Tab {
    return new Tab(
      this._window,
      url,
      () => this._updateControlBar(),
      (tabId: number) => this._controlBar.onStartNavigation(tabId),
      (tabId: number) => this._controlBar.onFinishNavigation(tabId),
      ({ url, disposition }: HandlerDetails) =>
        this._insertTab(
          this._tabs.length,
          url,
          disposition !== "background-tab"
            ? NewTabDisposition.Activate
            : NewTabDisposition.Load,
        ),
    );
  }

  private _logErrors(
    fn: (...args: unknown[]) => void,
    ...args: unknown[]
  ): void {
    try {
      fn.call(this, ...args);
    } catch (e) {
      console.error(e);
    }
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
    this._tabs[this._currentTabIndex].show();

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

    this._mainMenu = Menu.buildFromTemplate([
      {
        label: "New tab",
        accelerator: "CommandOrControl+T",
        click: () => this._addTab(),
      },
      { type: "separator" },
      {
        label: "LiberWallet",
        click: () => this._addTab("liber://wallet"),
      },
      { type: "separator" },
      {
        label: "Settings",
        click: () => this._addTab("liber://settings"),
      },
      {
        label: "Exit",
        accelerator: "Alt+F4",
        click: () => this.close(),
      },
    ]);

    ipcMain.handle("window/minimize", () => this._window.minimize());

    ipcMain.handle("window/maximize", () => {
      if (this._window.isMaximized()) {
        this._window.unmaximize();
      } else {
        this._window.maximize();
      }
    });

    ipcMain.handle("window/close", () => this._logErrors(this.close));

    ipcMain.handle("window/get-tabs", () =>
      this._tabs.map((tab) => tab.getDescriptor()),
    );

    ipcMain.handle(
      "window/get-active-tab",
      () => this._tabs[this._currentTabIndex].id,
    );

    ipcMain.handle("window/select-tab", (_, id: number) =>
      this._logErrors(this._setCurrentTab, id),
    );

    ipcMain.handle("window/add-tab", () => this._logErrors(this._addTab));

    ipcMain.handle("window/delete-tab", (_, id: number) =>
      this._logErrors(this._destroyTab, id),
    );

    ipcMain.handle("tab/get-url", (_, tabId: number) =>
      this._getTab(tabId).getUrl(),
    );

    ipcMain.handle("tab/set-url", (_, url: string) =>
      this._logErrors(this._setUrl, url),
    );

    ipcMain.handle("tab/is-loading", (_, tabId: number) =>
      this._getTab(tabId).isLoading(),
    );

    ipcMain.handle("root/back", () =>
      this._logErrors(() => this._getCurrentTab().goBack()),
    );

    ipcMain.handle("root/forward", () =>
      this._logErrors(() => this._getCurrentTab().goForward()),
    );

    ipcMain.handle("root/refresh", () =>
      this._logErrors(() => this._getCurrentTab().reload()),
    );

    ipcMain.handle("root/cancel-navigation", () =>
      this._logErrors(() => this._getCurrentTab().stopLoading()),
    );

    ipcMain.handle("root/main-menu", () => {
      const { width } = this._window.getBounds();
      this._mainMenu.popup({
        x: width,
        y: CONTROL_BAR_HEIGHT - 5,
      });
    });
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

  private _updateControlBar(): void {
    this._controlBar.update(
      this._tabs.map((tab) => tab.getDescriptor()),
      this._tabs[this._currentTabIndex].id,
    );
  }

  private _setCurrentTab(id: number): void {
    const index = this._getTabIndex(id);
    this._getCurrentTab().hide();
    this._currentTabIndex = index;
    this._getCurrentTab().show();
    this._updateControlBar();
  }

  private _insertTab(
    index: number,
    url: string,
    disposition: NewTabDisposition,
  ): void {
    if (index < 0) {
      throw new Error(`invalid new tab index ${index}`);
    }
    if (index > this._tabs.length) {
      throw new Error(
        `invalid new tab index ${index}, must be less than or equal to ${this._tabs.length}`,
      );
    }
    if (disposition === NewTabDisposition.Activate) {
      this._getCurrentTab().hide();
    }
    const tab = this._createTab(url);
    this._tabs.splice(index, 0, tab);
    switch (disposition) {
      case NewTabDisposition.Activate:
        this._currentTabIndex = index;
        tab.show();
        break;
      case NewTabDisposition.Load:
        tab.ensureLoaded();
        break;
    }
    this._updateControlBar();
  }

  private _addTab(url = "liber://new"): void {
    this._insertTab(this._tabs.length, url, NewTabDisposition.Activate);
  }

  private _destroyTab(id: number): void {
    const index = this._getTabIndex(id);
    this._tabs.splice(index, 1).forEach((tab) => {
      tab.hide();
      tab.free();
    });
    if (!this._tabs.length) {
      this._window.close();
      return;
    }
    if (this._currentTabIndex > index) {
      this._currentTabIndex--;
    } else if (this._currentTabIndex === index) {
      this._currentTabIndex = Math.min(
        this._currentTabIndex,
        this._tabs.length - 1,
      );
    }
    this._tabs[this._currentTabIndex].show();
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
      try {
        tab.free();
      } catch {
        // ignore
      }
    }
  }
}
