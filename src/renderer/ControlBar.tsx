import { useEffect, useMemo, useState } from "react";

import { libernet, useAsyncEffect } from "./Utilities";

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
      }),
    [],
  );
  useAsyncEffect(async () => {
    setUrl(await libernet().getUrl());
  }, []);
  return (
    <div className="flex w-full gap-2 overflow-hidden px-2 py-1 shadow-sm">
      <div className="inline-flex rounded-md shadow-xs">
        <button
          type="button"
          className="inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14M5 12l4-4m-4 4 4 4"
            />
          </svg>
        </button>
        <button
          type="button"
          className="inline-flex items-center border-t border-b border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 12H5m14 0-4 4m4-4-4-4"
            />
          </svg>
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-e-lg border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
          onClick={() => libernet().startRefresh()}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
            />
          </svg>
        </button>
      </div>
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
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
            autoCorrect="off"
            autoCapitalize="off"
          />
        </form>
      </div>
    </div>
  );
};
