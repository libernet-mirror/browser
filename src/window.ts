import { BaseWindow, ipcMain } from "electron";

import { URL_PROTOCOL_PATTERN } from "./constants";
import { ControlBar, NavigationButton } from "./controls";
import { Tab, WebTab } from "./tabs";

export class BrowserWindow {
  private readonly _window: BaseWindow;
  private readonly _controlBar: ControlBar;
  private readonly _tabs: Tab[] = [];
  private _currentTab: Tab;

  public constructor(width: number, height: number, initialUrl: string) {
    this._window = new BaseWindow({
      title: "Libernet",
      width,
      height,
    });
    this._window.removeMenu();

    this._controlBar = new ControlBar(
      this._window,
      initialUrl,
      this._onControlUrl.bind(this),
      this._onControl.bind(this),
    );

    const tab = new WebTab(
      this._window,
      initialUrl,
      (url) => this._controlBar.setUrl(url),
      () => this._controlBar.onStartNavigation(),
      () => this._controlBar.onFinishNavigation(),
    );
    this._tabs = [tab];
    this._currentTab = tab;
    tab.addTo(this._window);
    this._controlBar.bringForward();

    this._window.on("resize", () => {
      this._controlBar.resize();
      this._currentTab.resize();
    });

    ipcMain.handle("root/get-view", async ({ sender }) => {
      if (this._controlBar.matches(sender)) {
        return "control";
      }
      if (this._currentTab.matches(sender)) {
        return "web";
      }
      throw new Error();
    });

    ipcMain.handle("root/get-url", () => this._currentTab.getUrl());
    ipcMain.handle("root/set-url", (_, url) => this._onControlUrl(url));
    ipcMain.handle("root/back", () => this._onControl("back"));
    ipcMain.handle("root/forward", () => this._onControl("forward"));
    ipcMain.handle("root/refresh", () => this._onControl("refresh"));
    ipcMain.handle("root/cancel-navigation", () => this._onControl("cancel"));
  }

  private _setCurrentTab(tab: Tab): void {
    this._currentTab.removeFrom(this._window);
    this._currentTab = tab;
    tab.addTo(this._window);
    this._controlBar.bringForward();
  }

  private _onControlUrl(url: string): void {
    const match = url.match(URL_PROTOCOL_PATTERN);
    if (!match) {
      throw new Error(`invalid URL: ${JSON.stringify(url)}`);
    }
    const protocol = match[1];
    switch (protocol) {
      case "http":
      case "https":
      case "file":
        this._currentTab.setUrl(url);
        break;
      case "liber":
        // TODO
        break;
      default:
        throw new Error(`unknown protocol ${JSON.stringify(protocol)}`);
    }
  }

  private _onControl(button: NavigationButton): void {
    switch (button) {
      case "back":
        this._currentTab.goBack();
        break;
      case "forward":
        this._currentTab.goForward();
        break;
      case "refresh":
        this._currentTab.reload();
        break;
      case "cancel":
        this._currentTab.stopLoading();
        break;
      case "minimize":
        this._window.minimize();
        break;
      case "maximize":
        this._window.maximize();
        break;
      case "close":
        this.close();
        break;
    }
  }

  public close(): void {
    this._window.close();
    for (const tab of this._tabs) {
      tab.free();
    }
  }
}
