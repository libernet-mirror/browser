import { clsx } from "clsx";
import { useEffect, useMemo, useState } from "react";

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
import { WalletIcon } from "./icons/Wallet";

import { libernet } from "./Libernet";
import { GrayedLogo, Logo } from "./Logo";
import { useAsyncEffect } from "./Utilities";

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
  descriptor: { title, url, icons },
  index,
  active = false,
}: {
  descriptor: TabDescriptor;
  index: number;
  active?: boolean;
}) => (
  <div
    className={clsx(
      "mr-1 flex w-50 flex-row gap-x-2 overflow-hidden rounded-md px-2 py-1 text-sm text-nowrap rtl:flex-row-reverse",
      active
        ? "bg-white shadow-sm"
        : "bg-blue-100 hover:bg-blue-200 active:bg-blue-300",
    )}
  >
    {url.startsWith("liber://") ? (
      <span>
        <Logo className="my-auto size-[1.25rem]" />
      </span>
    ) : (
      <FavIcon className="my-auto size-[1.25rem]" src={icons[0] ?? ""} />
    )}
    <button
      className="grow overflow-hidden bg-transparent text-start overflow-ellipsis"
      onClick={({ button }) => {
        if (!active && button !== 1) {
          libernet().selectTab(index);
        }
      }}
      onMouseUp={({ button }) => {
        if (button === 1) {
          libernet().removeTab(index);
        }
      }}
    >
      {title}
    </button>
    <button
      className={clsx(
        "my-auto rounded-full bg-transparent p-0.5",
        active
          ? "hover:bg-neutral-200 active:bg-neutral-300"
          : "hover:bg-blue-300 active:bg-blue-400",
      )}
      onClick={() => libernet().removeTab(index)}
    >
      <CancelIcon className="size-3" />
    </button>
  </div>
);

const Tabs = () => {
  const [tabs, setTabs] = useState<TabDescriptor[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  useAsyncEffect(async () => {
    const destructor = libernet().onTabs(
      (tabs: TabDescriptor[], activeIndex: number) => {
        setTabs(tabs);
        setActiveTabIndex(activeIndex);
      },
    );
    setTabs(await libernet().getTabs());
    return destructor;
  }, []);
  return (
    <div className="window-drag-area flex w-full overflow-hidden bg-blue-100 p-1 align-middle">
      {tabs.map((tab, index) => (
        <TabPill
          key={index}
          descriptor={tab}
          index={index}
          active={index === activeTabIndex}
        />
      ))}
      <PlainButton round style="blue" onClick={() => libernet().addTab()}>
        <PlusIcon className="size-4" />
      </PlainButton>
      <span className="window-drag-area grow" />
      <PlainButton
        round
        style="blue"
        onClick={() => libernet().minimizeWindow()}
      >
        <MinimizeIcon className="size-4" />
      </PlainButton>
      <PlainButton
        round
        style="blue"
        onClick={() => libernet().maximizeWindow()}
      >
        <MaximizeIcon className="size-4" />
      </PlainButton>
      <PlainButton round style="blue" onClick={() => libernet().closeWindow()}>
        <CancelIcon className="size-4" />
      </PlainButton>
    </div>
  );
};

const Navigation = () => {
  const [url, setUrl] = useState("");
  const [typingUrl, setTypingUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shownUrl = useMemo(
    () => (typingUrl !== null ? typingUrl : url),
    [url, typingUrl],
  );

  const isSystemPage = useMemo(() => url.startsWith("liber://"), [url]);

  useEffect(() => {
    const destructors = [
      libernet().onUrl((url: string) => {
        setUrl(url);
        setTypingUrl(null);
      }),
      libernet().onStartNavigation(() => setLoading(true)),
      libernet().onFinishNavigation(() => setLoading(false)),
    ];
    return () => {
      destructors.forEach((destructor) => {
        try {
          destructor();
        } catch {
          // ignore
        }
      });
    };
  }, []);

  useAsyncEffect(async () => {
    setUrl(await libernet().getUrl());
  }, []);

  return (
    <div className="flex w-full gap-2 overflow-hidden px-2 py-1 shadow-sm">
      <PlainButton
        round
        disabled={isSystemPage}
        onClick={() => libernet().navigateBack()}
      >
        <LeftIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
        disabled={isSystemPage}
        onClick={() => libernet().navigateForward()}
      >
        <RightIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
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
            await libernet().setUrl(typingUrl.trim());
            setTypingUrl(null);
          }}
        >
          <input
            type="text"
            className="w-full rounded-md border-2 border-neutral-100 bg-neutral-100 px-3 py-1 outline-none focus:border-blue-600 focus:bg-white"
            placeholder="Type a URL"
            value={shownUrl}
            onChange={({ target }) => setTypingUrl(target.value)}
            onFocus={({ target }) => {
              target.setSelectionRange(0, target.value.length);
              setTypingUrl(url);
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
      <PlainButton round onClick={() => libernet().setUrl("liber://wallet")}>
        <WalletIcon className="size-5" />
      </PlainButton>
      <PlainButton round onClick={() => libernet().setUrl("liber://settings")}>
        <DotsIcon className="size-5" />
      </PlainButton>
    </div>
  );
};

export const ControlBar = () => (
  <>
    <Tabs />
    <Navigation />
  </>
);
