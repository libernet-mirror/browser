import { BaseWindow, WebContents, WebContentsView } from "electron";

import {
  CONTROL_BAR_HEIGHT,
  PRELOAD_WEBPACK_ENTRY,
  WEBPACK_ENTRY,
} from "./constants";
import { TabDescriptor } from "./data";

export class ControlBar {
  private readonly _view: WebContentsView;

  public constructor(private readonly _parentWindow: BaseWindow) {
    this._view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        devTools: false,
        preload: PRELOAD_WEBPACK_ENTRY,
      },
    });
    this._view.setBackgroundColor("#0fff");
    const { width } = this._parentWindow.getBounds();
    this._view.setBounds({ x: 0, y: 0, width, height: CONTROL_BAR_HEIGHT });
    this._parentWindow.contentView.addChildView(this._view);
    this._view.webContents.loadURL(WEBPACK_ENTRY + "?route=control");
  }

  public bringForward(): void {
    this._parentWindow.contentView.addChildView(this._view);
  }

  public resize(): void {
    const { width } = this._parentWindow.getBounds();
    this._view.setBounds({ x: 0, y: 0, width, height: CONTROL_BAR_HEIGHT });
  }

  public matches(sender: WebContents): boolean {
    return sender === this._view.webContents;
  }

  public update(tabs: TabDescriptor[], activeIndex: number): void {
    this._view.webContents.send("window/tabs", tabs, activeIndex);
    this._view.webContents.send("root/url", tabs[activeIndex].url);
  }

  public onStartNavigation(): void {
    this._view.webContents.send("root/start-navigation");
  }

  public onFinishNavigation(): void {
    this._view.webContents.send("root/finish-navigation");
  }
}
