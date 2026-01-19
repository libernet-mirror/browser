import { BaseWindow, WebContents, WebContentsView } from "electron";

import {
  CONTROL_BAR_HEIGHT,
  PRELOAD_WEBPACK_ENTRY,
  URL_PREFIX_PATTERN,
  WEBPACK_ENTRY,
} from "./constants";
import { AccountListener, offAccountProof, onAccountProof } from "./libernet";
import { TabDescriptor } from "./data";

export class Tab {
  private _view: WebContentsView | null = null;
  private _accountListener: AccountListener | null = null;

  // REQUIRES: `url` must be valid and must include the protocol part.
  private static _mapSystemUrlToUserUrl(url: string): string {
    if (!url.startsWith(WEBPACK_ENTRY)) {
      return url;
    }
    const params = url
      .slice(WEBPACK_ENTRY.length)
      .replace(/^\?/, "")
      .replace(/#.*$/, "")
      .split("&")
      .map((entry) => entry.split("="))
      .filter(([key]) => key === "route")
      .map(([, value]) => decodeURIComponent(value));
    if (params.length > 0) {
      return `liber://${params[0]}`;
    } else {
      // This should never happen.
      return "liber:///";
    }
  }

  // REQUIRES: `url` must be valid and must include the protocol part.
  private static _mapUserUrlToSystemUrl(url: string): string {
    const [, protocol, address] = url.match(URL_PREFIX_PATTERN);
    if (protocol !== "liber") {
      return url;
    }
    return `${WEBPACK_ENTRY}?route=${encodeURIComponent(address)}`;
  }

  public constructor(
    private readonly _parentWindow: BaseWindow,
    private _url: string,
    private readonly _onUrl: (url: string) => void,
    private readonly _onTitle: (title: string) => void,
    private readonly _onStartNavigation: () => void,
    private readonly _onFinishNavigation: () => void,
  ) {}

  private _notifyUrl(url: string): void {
    this._url = Tab._mapSystemUrlToUserUrl(url);
    this._onUrl(this._url);
  }

  private _installAccountListenerFor(view: WebContentsView): void {
    if (this._accountListener) {
      offAccountProof(this._accountListener);
    }
    this._accountListener = (proof) => {
      view.webContents?.send("net/watch-account", proof);
    };
    onAccountProof(this._accountListener);
  }

  private _removeAccountListener(): void {
    if (this._accountListener) {
      offAccountProof(this._accountListener);
      this._accountListener = null;
    }
  }

  private _configureView(view: WebContentsView): void {
    view.webContents
      .on("will-navigate", ({ url, isMainFrame }) => {
        if (isMainFrame) {
          this._notifyUrl(url);
        }
      })
      .on("did-navigate", (_, url) => {
        this._notifyUrl(url);
      })
      .on("did-navigate-in-page", (_, url, isMainFrame) => {
        if (isMainFrame) {
          this._notifyUrl(url);
        }
      })
      .on("did-start-loading", () => {
        this._onStartNavigation();
      })
      .on("did-stop-loading", () => {
        this._onFinishNavigation();
      })
      .on("page-title-updated", () => {
        this._onTitle(this.getTitle());
      });
    const { width, height } = this._parentWindow.getBounds();
    view.setBounds({
      x: 0,
      y: CONTROL_BAR_HEIGHT,
      width,
      height: height - CONTROL_BAR_HEIGHT,
    });
  }

  private _createWebView(): WebContentsView {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        devTools: true,
      },
    });
    this._configureView(view);
    view.webContents.loadURL(Tab._mapUserUrlToSystemUrl(this._url));
    return view;
  }

  private _createSystemView(): WebContentsView {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        devTools: false,
        preload: PRELOAD_WEBPACK_ENTRY,
      },
    });
    this._configureView(view);
    view.webContents.loadURL(Tab._mapUserUrlToSystemUrl(this._url));
    return view;
  }

  private _createView(): WebContentsView {
    const match = this._url.match(URL_PREFIX_PATTERN);
    if (!match) {
      throw new Error(`invalid URL: ${JSON.stringify(this._url)}`);
    }
    const protocol = match[1];
    switch (protocol) {
      case "http":
      case "https":
      case "file":
        return this._createWebView();
      case "liber": {
        const view = this._createSystemView();
        this._installAccountListenerFor(view);
        return view;
      }
      default:
        throw new Error(`unknown protocol ${JSON.stringify(protocol)}`);
    }
  }

  private _getView(resize = false): WebContentsView {
    if (!this._view) {
      this._view = this._createView();
    } else if (resize) {
      const { width, height } = this._parentWindow.getBounds();
      this._view.setBounds({
        x: 0,
        y: CONTROL_BAR_HEIGHT,
        width,
        height: height - CONTROL_BAR_HEIGHT,
      });
    }
    return this._view;
  }

  public getUrl(): string {
    return this._url;
  }

  public setUrl(url: string): void {
    if (this._view) {
      this._removeAccountListener();
      this._parentWindow.contentView.removeChildView(this._view);
      this._view.webContents?.close();
    }
    this._url = url;
    this._view = this._createView();
    this._parentWindow.contentView.addChildView(this._view);
  }

  public getTitle(): string {
    return (
      this._view?.webContents?.getTitle() ??
      Tab._mapSystemUrlToUserUrl(this._url)
    );
  }

  public getDescriptor(): TabDescriptor {
    return {
      title: this.getTitle(),
      url: this._url,
    };
  }

  public show(): void {
    const view = this._getView(/*resize=*/ true);
    this._parentWindow.contentView.addChildView(view);
  }

  public hide(): void {
    if (this._view) {
      this._parentWindow.contentView.removeChildView(this._view);
    }
  }

  public matches(sender: WebContents): boolean {
    return sender === this._view.webContents;
  }

  public resize(): void {
    this._getView(/*resize=*/ true);
  }

  public goBack(): void {
    this._getView().webContents?.navigationHistory.goBack();
  }

  public goForward(): void {
    this._getView().webContents?.navigationHistory.goForward();
  }

  public reload(): void {
    this._getView().webContents?.reload();
  }

  public stopLoading(): void {
    this._view?.webContents?.stop();
  }

  public free(): void {
    this._view?.removeAllListeners();
    this._view?.webContents?.close();
  }
}
