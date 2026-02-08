import path from "node:path";

import {
  type WebContents,
  app,
  BaseWindow,
  BaseWindowConstructorOptions,
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
import { type TabDescriptor } from "./data";
import { type WindowHandlerDetails, Tab } from "./tab";

export interface BrowserWindowOptions {
  initialUrl?: string;
  incognito?: boolean;
}

interface BrowserWindowSettings {
  x: number | null;
  y: number | null;
  width: number;
  height: number;
  maximized: boolean;
  incognito: boolean;
}

enum NewTabDisposition {
  Activate,
  Load,
  Idle,
}

export class BrowserWindow {
  private static readonly _INSTANCES: BrowserWindow[] = [];

  private readonly _incognito: boolean;
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

  private _getTab(id: number): Tab | null {
    const index = this._tabs.findIndex((tab) => tab.id === id);
    if (index < 0) {
      return null;
    } else {
      return this._tabs[index];
    }
  }

  private _getCurrentTab(): Tab {
    return this._tabs[this._currentTabIndex];
  }

  private _createTab(url: string): Tab {
    return new Tab(
      this._window,
      url,
      this._incognito,
      () => this._updateControlBar(),
      (tabId: number) => this._controlBar.onStartNavigation(tabId),
      (tabId: number) => this._controlBar.onFinishNavigation(tabId),
      ({ url, disposition }: WindowHandlerDetails) => {
        switch (disposition) {
          case "background-tab":
            this._insertTab(this._tabs.length, url, NewTabDisposition.Load);
            break;
          case "new-window":
            BrowserWindow.create({ initialUrl: url });
            break;
          default:
            this._insertTab(this._tabs.length, url, NewTabDisposition.Activate);
            break;
        }
      },
    );
  }

  private constructor(tabUrls: string[], settings: BrowserWindowSettings) {
    if (tabUrls.length < 1) {
      throw new Error("at least one tab URL must be specified");
    }

    BrowserWindow._INSTANCES.push(this);

    this._incognito = !!settings.incognito;

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
        click: () => this.addTab(),
      },
      {
        label: "New window",
        accelerator: "CommandOrControl+N",
        click: () => {
          BrowserWindow.create({});
        },
      },
      {
        label: "New Incognito window",
        accelerator: "CommandOrControl+Shift+N",
        click: () => {
          BrowserWindow.create({ incognito: true });
        },
      },
      { type: "separator" },
      {
        label: "LiberWallet",
        click: () => this.addTab("liber://wallet"),
      },
      { type: "separator" },
      {
        label: "Settings",
        click: () => this.addTab("liber://settings"),
      },
      {
        label: "Exit",
        accelerator: "Alt+F4",
        click: () => this.close(),
      },
    ]);
  }

  public static async create(
    options: BrowserWindowOptions,
  ): Promise<BrowserWindow> {
    const [maximized, { x, y }, { width, height }, homeAddress] =
      await Promise.all([
        isWindowMaximized(),
        getWindowPosition(),
        getWindowSize(),
        getHomeAddress(),
      ]);
    return new BrowserWindow(
      [options.initialUrl ? options.initialUrl : homeAddress],
      {
        x,
        y,
        width,
        height,
        maximized,
        incognito: !!options.incognito,
      },
    );
  }

  private _updateControlBar(): void {
    this._controlBar.update(
      this._tabs.map((tab) => tab.getDescriptor()),
      this._tabs[this._currentTabIndex].id,
    );
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

  private _matches(sender: WebContents): boolean {
    return (
      this._controlBar.matches(sender) ||
      this._tabs.some((tab) => tab.matches(sender))
    );
  }

  public static find(sender: WebContents): BrowserWindow | null {
    const index = BrowserWindow._INSTANCES.findIndex((window) =>
      window._matches(sender),
    );
    if (index < 0) {
      console.error(new Error(`window not found for renderer ID ${sender.id}`));
      return null;
    } else {
      return BrowserWindow._INSTANCES[index];
    }
  }

  public minimize(): void {
    this._window.minimize();
  }

  public maximize(): void {
    if (this._window.isMaximized()) {
      this._window.unmaximize();
    } else {
      this._window.maximize();
    }
  }

  public close(): void {
    const index = BrowserWindow._INSTANCES.indexOf(this);
    if (index >= 0) {
      BrowserWindow._INSTANCES.splice(index, 1);
    }
    this._window.close();
    for (const tab of this._tabs) {
      try {
        tab.free();
      } catch {
        // ignore
      }
    }
  }

  public getTabs(): TabDescriptor[] {
    return this._tabs.map((tab) => tab.getDescriptor());
  }

  public getTab(id: number): TabDescriptor {
    return this._getTab(id)?.getDescriptor();
  }

  public isTabLoading(id: number): boolean {
    return this._getTab(id)?.isLoading();
  }

  public setCurrentUrl(url: string): void {
    if (!URL_PREFIX_PATTERN.test(url)) {
      if (DNS_HEURISTIC_PREFIX_PATTERN.test(url)) {
        url = "http://" + url;
      } else {
        url = DEFAULT_SEARCH_ENGINE.replace("$QUERY$", encodeURIComponent(url));
      }
    }
    this._getCurrentTab().setUrl(url);
  }

  public goBack(): void {
    this._getCurrentTab().goBack();
  }

  public goForward(): void {
    this._getCurrentTab().goForward();
  }

  public reload(): void {
    this._getCurrentTab().reload();
  }

  public stopLoading(): void {
    this._getCurrentTab().stopLoading();
  }

  public getActiveTab(): number {
    return this._tabs[this._currentTabIndex].id;
  }

  public selectTab(id: number): void {
    const index = this._getTabIndex(id);
    this._getCurrentTab().hide();
    this._currentTabIndex = index;
    this._getCurrentTab().show();
    this._updateControlBar();
  }

  public addTab(url = "liber://new"): void {
    this._insertTab(this._tabs.length, url, NewTabDisposition.Activate);
  }

  public destroyTab(id: number): void {
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

  public openMainMenu(): void {
    const { width } = this._window.getBounds();
    this._mainMenu.popup({
      window: this._window,
      x: width,
      y: CONTROL_BAR_HEIGHT - 5,
    });
  }
}
