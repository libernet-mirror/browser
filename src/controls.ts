import { app, BaseWindow, WebContents, WebContentsView } from "electron";

import {
  CONTROL_BAR_HEIGHT,
  PRELOAD_WEBPACK_ENTRY,
  WEBPACK_ENTRY,
} from "./constants";
import { TabDescriptor } from "./data";

export class ControlBar {
  private static readonly _CONTENT_SECURITY_POLICY_DEV = `
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src * data: blob:;
    connect-src ws: http: https:;
  `
    .replace(/\s+/g, " ")
    .trim();

  private static readonly _CONTENT_SECURITY_POLICY_PROD = `
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src * data: blob:;
    connect-src ws: http: https:;
  `
    .replace(/\s+/g, " ")
    .trim();

  private _view: WebContentsView;

  private _createView(): WebContentsView {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        partition: "control-bar",
        devTools: false,
        preload: PRELOAD_WEBPACK_ENTRY,
      },
    });
    view.webContents.on("render-process-gone", (_, details) => {
      console.dir(details);
      console.error("The control bar crashed. Restarting...");
      this._view?.webContents?.close();
      this._view = this._createView();
    });
    view.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            "Content-Security-Policy": app.isPackaged
              ? ControlBar._CONTENT_SECURITY_POLICY_PROD
              : ControlBar._CONTENT_SECURITY_POLICY_DEV,
          },
        });
      },
    );
    view.setBackgroundColor("#0fff");
    const { width } = this._parentWindow.getBounds();
    view.setBounds({ x: 0, y: 0, width, height: CONTROL_BAR_HEIGHT });
    this._parentWindow.contentView.addChildView(view);
    view.webContents.loadURL(WEBPACK_ENTRY + "?route=control");
    return view;
  }

  public constructor(private readonly _parentWindow: BaseWindow) {
    this._view = this._createView();
  }

  public resize(): void {
    const { width } = this._parentWindow.getBounds();
    this._view.setBounds({ x: 0, y: 0, width, height: CONTROL_BAR_HEIGHT });
  }

  public matches(sender: WebContents): boolean {
    return sender === this._view.webContents;
  }

  public update(tabs: TabDescriptor[], activeTabId: number): void {
    this._view.webContents.send("window/tabs", tabs, activeTabId);
    this._view.webContents.send(
      "tab/url",
      activeTabId,
      tabs.find(({ id }) => id === activeTabId).url,
    );
  }

  public onStartNavigation(tabId: number): void {
    this._view.webContents.send("tab/start-navigation", tabId);
  }

  public onFinishNavigation(tabId: number): void {
    this._view.webContents.send("tab/finish-navigation", tabId);
  }
}
