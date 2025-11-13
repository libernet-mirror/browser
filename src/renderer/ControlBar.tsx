import { useEffect, useMemo, useState } from "react";

import { PlainButton } from "./components/Buttons";
import { LeftIcon } from "./icons/Left";
import { RefreshIcon } from "./icons/Refresh";
import { RightIcon } from "./icons/Right";
import { WalletIcon } from "./icons/Wallet";

import { libernet } from "./Libernet";
import { useAsyncEffect } from "./Utilities";

export const ControlBar = () => {
  const [url, setUrl] = useState("");
  const [typingUrl, setTypingUrl] = useState<string | null>(null);
  const shownUrl = useMemo(
    () => (typingUrl !== null ? typingUrl : url),
    [url, typingUrl],
  );
  useEffect(
    () =>
      libernet().onUrl((url: string) => {
        setUrl(url);
        setTypingUrl(null);
      }),
    [],
  );
  useAsyncEffect(async () => {
    setUrl(await libernet().getUrl());
  }, []);
  return (
    <div className="flex w-full gap-2 overflow-hidden px-2 py-1 shadow-sm">
      <PlainButton
        round
        onClick={async () => setUrl(await libernet().navigateBack())}
      >
        <LeftIcon className="size-5" />
      </PlainButton>
      <PlainButton
        round
        onClick={async () => setUrl(await libernet().navigateForward())}
      >
        <RightIcon className="size-5" />
      </PlainButton>
      <PlainButton round onClick={() => libernet().startRefresh()}>
        <RefreshIcon className="size-5" />
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
    </div>
  );
};
