import {
  BaseWindow,
  BrowserWindowConstructorOptions,
  HandlerDetails,
  Session,
  WebContents,
  WebContentsView,
} from "electron";

import {
  CONTROL_BAR_HEIGHT,
  PRELOAD_WEBPACK_ENTRY,
  URL_PREFIX_PATTERN,
  WEBPACK_ENTRY,
} from "./constants";
import { TabDescriptor } from "./data";
import { AccountListener, offAccountProof, onAccountProof } from "./libernet";

export type TabOverrideSettings = {
  session?: Session;
  partition?: string;
};

export class Tab {
  private _view: WebContentsView | null = null;
  private _icons: string[] = [];
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
    private readonly _overrides: TabOverrideSettings,
    private readonly _onUpdate: (descriptor: TabDescriptor) => void,
    private readonly _onStartNavigation: () => void,
    private readonly _onFinishNavigation: () => void,
    private readonly _makeCreateWindow: (
      details: HandlerDetails,
    ) => (options: BrowserWindowConstructorOptions) => WebContents,
  ) {}

  private _triggerUpdate(): void {
    this._onUpdate(this.getDescriptor());
  }

  private _notifyUrl(url: string): void {
    this._url = Tab._mapSystemUrlToUserUrl(url);
    this._triggerUpdate();
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
        this._triggerUpdate();
      })
      .on("page-favicon-updated", (_, icons: string[]) => {
        this._icons = icons;
        this._triggerUpdate();
      })
      .setWindowOpenHandler((details: HandlerDetails) => ({
        action: "allow",
        createWindow: this._makeCreateWindow(details),
        outlivesOpener: true,
      }));
    const { width, height } = this._parentWindow.getBounds();
    view.setBounds({
      x: 0,
      y: CONTROL_BAR_HEIGHT,
      width,
      height: height - CONTROL_BAR_HEIGHT,
    });
    view.webContents.loadURL(Tab._mapUserUrlToSystemUrl(this._url));
  }

  private _createWebView(): WebContentsView {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        session: this._overrides.session ?? void 0,
        partition: this._overrides.partition ?? "persist:libernet",
        devTools: true,
      },
    });
    this._configureView(view);
    return view;
  }

  private _createSystemView(): WebContentsView {
    // NOTE: we're intentionally ignoring the session and partition overrides here for security
    // reasons & paranoia. The system session must be completely isolated from the regular web
    // browsing session. For example, we don't want any cookies set by the system pages to enter the
    // web browsing session.
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        partition: "system",
        devTools: false,
        preload: PRELOAD_WEBPACK_ENTRY,
      },
    });
    this._configureView(view);
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

  public getView(resize = false): WebContentsView {
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
    this._icons = [];
    this._url = url;
    this._view = this._createView();
    this._parentWindow.contentView.addChildView(this._view);
    this._triggerUpdate();
  }

  public getTitle(): string {
    return (
      this._view?.webContents?.getTitle() ??
      Tab._mapSystemUrlToUserUrl(this._url)
    );
  }

  public getIcons(): string[] {
    return this._icons;
  }

  public getDescriptor(): TabDescriptor {
    return {
      title: this.getTitle(),
      url: this._url,
      icons: this._icons,
    };
  }

  public show(): void {
    const view = this.getView(/*resize=*/ true);
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
    this.getView(/*resize=*/ true);
  }

  public goBack(): void {
    this.getView().webContents?.navigationHistory.goBack();
  }

  public goForward(): void {
    this.getView().webContents?.navigationHistory.goForward();
  }

  public reload(): void {
    this.getView().webContents?.reload();
  }

  public stopLoading(): void {
    this._view?.webContents?.stop();
  }

  public free(): void {
    this._view?.removeAllListeners();
    this._view?.webContents?.close();
  }
}
