import { useEffect, useMemo, useState } from "react";

import { PlainButton } from "./components/Buttons";
import { CancelIcon } from "./icons/Cancel";
import { DotsIcon } from "./icons/Dots";
import { LeftIcon } from "./icons/Left";
import { MaximizeIcon } from "./icons/Maximize";
import { MinimizeIcon } from "./icons/Minimize";
import { RefreshIcon } from "./icons/Refresh";
import { RightIcon } from "./icons/Right";
import { WalletIcon } from "./icons/Wallet";

import { libernet } from "./Libernet";
import { useAsyncEffect } from "./Utilities";

const Tabs = () => (
  <div className="window-drag-area w-full bg-blue-100 p-1 text-right">
    <PlainButton round style="blue" onClick={() => libernet().minimizeWindow()}>
      <MinimizeIcon className="size-4" />
    </PlainButton>
    <PlainButton round style="blue" onClick={() => libernet().maximizeWindow()}>
      <MaximizeIcon className="size-4" />
    </PlainButton>
    <PlainButton round style="blue" onClick={() => libernet().closeWindow()}>
      <CancelIcon className="size-4" />
    </PlainButton>
  </div>
);

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
