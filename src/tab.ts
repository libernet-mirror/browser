import path from "node:path";

import {
  type MenuItemConstructorOptions,
  BaseWindow,
  HandlerDetails,
  Menu,
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

export interface WindowHandlerDetails {
  url: string;
  disposition:
    | "default"
    | "foreground-tab"
    | "background-tab"
    | "new-window"
    | "other";
}

function _normalizeFileUrl(url: string): string {
  const match = url.match(/^file:\/\/([^?#&]*)([?#&].*)?$/);
  if (match) {
    return `file://${path.normalize(match[1])}${match[2] || ""}`;
  } else {
    return url;
  }
}

export class Tab {
  private static _NEXT_ID = 0;

  private readonly _id = Tab._NEXT_ID++;
  private _view: WebContentsView | null = null;
  private _icons: string[] = [];
  private _accountListener: AccountListener | null = null;

  // REQUIRES: `url` must be valid and must include the protocol part.
  private static _mapSystemUrlToUserUrl(url: string): string {
    url = _normalizeFileUrl(url);
    const webpack_entry = _normalizeFileUrl(WEBPACK_ENTRY);
    if (!url.startsWith(webpack_entry)) {
      return url;
    }
    const params = url
      .slice(webpack_entry.length)
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
      console.log(`unrecognized system URL: ${JSON.stringify(url)}`);
      console.log(
        `normalized Webpack entry URL is: ${JSON.stringify(webpack_entry)}`,
      );
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
    private readonly _onUpdate: (descriptor: TabDescriptor) => void,
    private readonly _onStartNavigation: (tabId: number) => void,
    private readonly _onFinishNavigation: (tabId: number) => void,
    private readonly _createWindow: (details: WindowHandlerDetails) => void,
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
        this._onStartNavigation(this._id);
      })
      .on("did-stop-loading", () => {
        this._onFinishNavigation(this._id);
      })
      .on("page-title-updated", () => {
        this._triggerUpdate();
      })
      .on("page-favicon-updated", (_, icons: string[]) => {
        this._icons = icons;
        this._triggerUpdate();
      })
      .setWindowOpenHandler((details: HandlerDetails) => {
        this._createWindow(details);
        return { action: "deny" };
      });
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
        partition: "persist:libernet",
        devTools: true,
      },
    });
    this._configureView(view);
    view.webContents.on(
      "context-menu",
      (_, { linkURL, isEditable, editFlags }) => {
        const items: MenuItemConstructorOptions[] = [];
        if (linkURL) {
          items.push(
            {
              label: "Open link in new tab",
              click: () =>
                this._createWindow({
                  url: linkURL,
                  disposition: "foreground-tab",
                }),
            },
            {
              label: "Open link in new window",
              click: () =>
                this._createWindow({
                  url: linkURL,
                  disposition: "new-window",
                }),
            },
            {
              type: "separator",
            },
          );
        }
        items.push(
          { label: "Back", click: () => this.goBack() },
          { label: "Forward", click: () => this.goForward() },
          {
            label: "Reload",
            accelerator: "CommandOrControl+R",
            click: () => this.reload(),
          },
          { type: "separator" },
        );
        if (isEditable) {
          items.push(
            {
              label: "Undo",
              accelerator: "CommandOrControl+Z",
              enabled: editFlags.canUndo,
              role: "undo",
            },
            {
              label: "Redo",
              accelerator: "CommandOrControl+Y",
              enabled: editFlags.canRedo,
              role: "redo",
            },
            {
              label: "Cut",
              accelerator: "CommandOrControl+X",
              enabled: editFlags.canCut,
              role: "cut",
            },
            {
              label: "Copy",
              accelerator: "CommandOrControl+C",
              enabled: editFlags.canCopy,
              role: "copy",
            },
            {
              label: "Paste",
              accelerator: "CommandOrControl+V",
              enabled: editFlags.canPaste,
              role: "paste",
            },
            {
              label: "Paste as plain text",
              accelerator: "CommandOrControl+Shift+V",
              enabled: editFlags.canPaste,
              role: "pasteAndMatchStyle",
            },
            {
              label: "Select all",
              accelerator: "CommandOrControl+A",
              enabled: editFlags.canSelectAll,
              role: "selectAll",
            },
            { type: "separator" },
          );
        }
        items.push({
          label: "Inspect page",
          accelerator: "F11",
          click: () => this._view?.webContents?.openDevTools(),
        });
        Menu.buildFromTemplate(items).popup({
          window: this._parentWindow,
        });
      },
    );
    return view;
  }

  private _createSystemView(): WebContentsView {
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

  public get id(): number {
    return this._id;
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
      id: this._id,
      title: this.getTitle(),
      url: this._url,
      icons: this._icons,
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

  public ensureLoaded(): void {
    this._getView(/*resize=*/ true);
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

  public isLoading(): boolean {
    return this._view?.webContents?.isLoadingMainFrame() || false;
  }

  public stopLoading(): void {
    this._view?.webContents?.stop();
  }

  public free(): void {
    this._view?.removeAllListeners();
    this._view?.webContents?.close();
  }
}
