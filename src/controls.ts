import { BaseWindow, WebContents, WebContentsView } from "electron";

import {
  CONTROL_BAR_HEIGHT,
  PRELOAD_WEBPACK_ENTRY,
  WEBPACK_ENTRY,
} from "./constants";

export type NavigationButton =
  | "back"
  | "forward"
  | "refresh"
  | "cancel"
  | "minimize"
  | "maximize"
  | "close";

export class ControlBar {
  private readonly _view: WebContentsView;

  public constructor(
    private readonly _parentWindow: BaseWindow,
    private readonly _url: string,
    private readonly _onUrl: (url: string) => void,
    private readonly _onClick: (button: NavigationButton) => void,
  ) {
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
    this._view.webContents.loadURL(WEBPACK_ENTRY);
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

  public setUrl(url: string): void {
    // TODO: update the URL in the address bar.
  }

  public onStartNavigation(): void {
    // TODO: set the spinner.
  }

  public onFinishNavigation(): void {
    // TODO: reset the spinner.
  }
}
