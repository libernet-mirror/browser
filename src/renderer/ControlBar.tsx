import { clsx } from "clsx";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { TabDescriptor } from "../data";

import { PlainButton } from "./components/Buttons";
import { CancelIcon } from "./icons/Cancel";
import { DotsIcon } from "./icons/Dots";
import { LeftIcon } from "./icons/Left";
import { MaximizeIcon } from "./icons/Maximize";
import { MinimizeIcon } from "./icons/Minimize";
import { PlusIcon } from "./icons/Plus";
import { RefreshIcon } from "./icons/Refresh";
import { RightIcon } from "./icons/Right";
import { SpinnerIcon } from "./icons/Spinner";
import { WalletIcon } from "./icons/Wallet";

import { libernet } from "./Libernet";
import { GrayedLogo, Logo } from "./Logo";

interface Theme {
  incognito: boolean;
  tabArea: string;
  navArea: string;
  activeTabPill: string;
  inactiveTabPill: string;
  activeTabCloseButton: string;
  inactiveTabCloseButton: string;
  addressBar: string;
}

const THEMES: { [name: string]: Theme } = {
  default: {
    incognito: false,
    tabArea: "bg-blue-100",
    navArea: "bg-white",
    activeTabPill: "bg-white shadow-sm",
    inactiveTabPill: "bg-blue-100 hover:bg-blue-200 active:bg-blue-300",
    activeTabCloseButton: "hover:bg-neutral-200 active:bg-neutral-300",
    inactiveTabCloseButton: "hover:bg-blue-300 active:bg-blue-400",
    addressBar:
      "border-neutral-100 bg-neutral-100 focus:border-blue-600 focus:bg-white",
  },
  incognito: {
    incognito: true,
    tabArea: "bg-gray-800 text-gray-300",
    navArea: "bg-gray-600 text-gray-300",
    activeTabPill: "bg-gray-600 shadow-sm",
    inactiveTabPill: "bg-gray-800 hover:bg-gray-700 active:bg-gray-600",
    activeTabCloseButton: "hover:bg-gray-700 active:bg-gray-800",
    inactiveTabCloseButton: "hover:bg-gray-600 active:bg-gray-500",
    addressBar:
      "border-gray-700 bg-gray-700 focus:border-gray-300 focus:bg-gray-600",
  },
};

const ThemeContext = createContext(THEMES.default);

const FavIcon = ({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState<string | null>(null);
  return (
    <>
      {loaded !== src && (
        <span>
          <GrayedLogo className={className} />
        </span>
      )}
      {src && (
        <img
          className={clsx(className, loaded !== src && "hidden")}
          src={src}
          onLoad={() => setLoaded(src)}
          alt=""
        />
      )}
    </>
  );
};

const TabPill = ({
  tab: { id, title, url, icons },
  active = false,
}: {
  tab: TabDescriptor;
  active?: boolean;
}) => {
  const theme = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const destructors = [
      libernet().onStartNavigation(id, () => {
        if (!cancelled) {
          setLoading(true);
        }
      }),
      libernet().onFinishNavigation(id, () => {
        if (!cancelled) {
          setLoading(false);
        }
      }),
    ];
    (async () => {
      const loading = await libernet().isTabLoading(id);
      if (!cancelled) {
        setLoading(!!loading);
      }
    })();
    return () => {
      cancelled = true;
      destructors.forEach((destructor) => {
        try {
          destructor();
        } catch {
          // ignore
        }
      });
    };
  }, [id]);
  return (
    <div
      className={clsx(
        "mr-1 flex w-50 min-w-15 flex-row gap-x-2 overflow-hidden rounded-md px-2 py-1 text-sm text-nowrap rtl:flex-row-reverse",
        active ? theme.activeTabPill : theme.inactiveTabPill,
      )}
      onClick={({ button }) => {
        if (!active && button !== 1) {
          libernet().selectTab(id);
        }
      }}
      onMouseUp={({ button }) => {
        if (button === 1) {
          libernet().deleteTab(id);
        }
      }}
    >
      {loading ? (
        <span>
          <SpinnerIcon color="blue" className="my-auto size-[1.25rem]" />
        </span>
      ) : url.startsWith("liber://") ? (
        <span>
          <Logo className="my-auto size-[1.25rem]" />
        </span>
      ) : (
        <FavIcon className="my-auto size-[1.25rem]" src={icons[0] ?? ""} />
      )}
      <span className="my-auto grow overflow-hidden bg-transparent text-start overflow-ellipsis">
        {title}
      </span>
      <button
        className={clsx(
          "my-auto rounded-full bg-transparent p-0.5",
          active ? theme.activeTabCloseButton : theme.inactiveTabCloseButton,
        )}
        onClick={(e) => {
          e.stopPropagation();
          libernet().deleteTab(id);
        }}
      >
        <CancelIcon className="size-3" />
      </button>
    </div>
  );
};

const Tabs = ({
  tabs,
  activeTabId,
}: {
  tabs: TabDescriptor[];
  activeTabId: number;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      className={clsx(
        "window-drag-area flex w-full overflow-hidden p-1 align-middle",
        theme.tabArea,
      )}
    >
      {tabs.map((tab) => (
        <TabPill key={tab.id} tab={tab} active={tab.id === activeTabId} />
      ))}
      <PlainButton
        round
        style={theme.incognito ? "incognito2" : "blue"}
        onClick={() => libernet().addTab()}
      >
        <PlusIcon className="size-4" />
      </PlainButton>
      <span className="window-drag-area grow" />
      <PlainButton
        round
        style={theme.incognito ? "incognito2" : "blue"}
        onClick={() => libernet().minimizeWindow()}
      >
        <MinimizeIcon className="size-4" />
      </PlainButton>
      <PlainButton
        round
        style={theme.incognito ? "incognito2" : "blue"}
        onClick={() => libernet().maximizeWindow()}
      >
        <MaximizeIcon className="size-4" />
      </PlainButton>
      <PlainButton
        round
        style={theme.incognito ? "incognito2" : "blue"}
        onClick={() => libernet().closeWindow()}
      >
        <CancelIcon className="size-4" />
      </PlainButton>
    </div>
  );
};

const Navigation = ({ activeTabId }: { activeTabId: number }) => {
  const theme = useContext(ThemeContext);

  const [url, setUrl] = useState("");
  const [urlOverride, setUrlOverride] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shownUrl = useMemo(
    () => (urlOverride !== null ? urlOverride : url),
    [url, urlOverride],
  );

  const isSystemPage = useMemo(() => url.startsWith("liber://"), [url]);

  useEffect(() => {
    let cancelled = false;
    const destructors = [
      libernet().onUrl(activeTabId, (url: string) => {
        if (!cancelled) {
          setUrl(url);
          setUrlOverride(null);
        }
      }),
      libernet().onStartNavigation(activeTabId, () => {
        if (!cancelled) {
          setLoading(true);
        }
      }),
      libernet().onFinishNavigation(activeTabId, () => {
        if (!cancelled) {
          setLoading(false);
        }
      }),
    ];
    (async () => {
      const [url, loading] = await Promise.all([
        libernet().getUrl(activeTabId),
        libernet().isTabLoading(activeTabId),
      ]);
      if (!cancelled) {
        setUrl("" + url);
        setUrlOverride(null);
        setLoading(!!loading);
      }
    })();
    return () => {
      cancelled = true;
      destructors.forEach((destructor) => {
        try {
          destructor();
        } catch {
          // ignore
        }
      });
    };
  }, [activeTabId]);

  return (
    <div
      className={clsx(
        "flex w-full gap-2 overflow-hidden px-2 py-1 shadow-sm",
        theme.navArea,
      )}
    >
      <PlainButton
        round
        disabled={isSystemPage}
        style={theme.incognito ? "incognito1" : "neutral"}
        onClick={() => libernet().navigateBack()}
      >
        <LeftIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
        disabled={isSystemPage}
        style={theme.incognito ? "incognito1" : "neutral"}
        onClick={() => libernet().navigateForward()}
      >
        <RightIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
        style={theme.incognito ? "incognito1" : "neutral"}
        onClick={() => {
          if (loading) {
            libernet().cancelNavigation();
          } else {
            libernet().startRefresh();
          }
        }}
      >
        {loading ? (
          <CancelIcon className="size-5" />
        ) : (
          <RefreshIcon className="size-5" />
        )}
      </PlainButton>
      <div className="grow">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const newUrl = urlOverride.trim();
            setUrlOverride(newUrl);
            await libernet().setUrl(newUrl);
          }}
        >
          <input
            type="text"
            className={clsx(
              "w-full rounded-md border-2 px-3 py-1 outline-none",
              theme.addressBar,
            )}
            placeholder="Type a URL"
            value={shownUrl}
            onChange={({ target }) => setUrlOverride(target.value)}
            onFocus={({ target }) => {
              target.setSelectionRange(0, target.value.length);
              setUrlOverride(url);
            }}
            onBlur={({ target }) => {
              target.setSelectionRange(null, null);
            }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        </form>
      </div>
      <PlainButton
        round
        style={theme.incognito ? "incognito1" : "neutral"}
        onClick={() => libernet().setUrl("liber://wallet")}
      >
        <WalletIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
        style={theme.incognito ? "incognito1" : "neutral"}
        onClick={() => libernet().openMainMenu()}
      >
        <DotsIcon className="size-5" />
      </PlainButton>
    </div>
  );
};

export const ControlBar = ({ incognito = false }: { incognito?: boolean }) => {
  const [tabs, setTabs] = useState<TabDescriptor[]>([]);
  const [activeTabId, setActiveTabId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const destructor = libernet().onTabs(
      (tabs: TabDescriptor[], activeId: number) => {
        if (!cancelled) {
          setTabs(tabs);
          setActiveTabId(activeId);
        }
      },
    );
    (async () => {
      const [tabs, activeTabId] = await Promise.all([
        libernet().getTabs(),
        libernet().getActiveTabId(),
      ]);
      if (!cancelled) {
        setTabs(tabs ?? []);
        setActiveTabId(~~activeTabId);
      }
    })();
    return () => {
      cancelled = true;
      destructor();
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={incognito ? THEMES.incognito : THEMES.default}
    >
      <Tabs tabs={tabs} activeTabId={activeTabId} />
      <Navigation activeTabId={activeTabId} />
    </ThemeContext.Provider>
  );
};
