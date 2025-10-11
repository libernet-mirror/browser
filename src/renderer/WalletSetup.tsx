import { useEffect, useMemo, useState } from "react";

import { clsx } from "clsx";
import { initTooltips } from "flowbite";

import { libernet } from "./Libernet";
import { MAX_WALLET_PASSWORDS } from "./Utilities";

const PasswordRow = ({
  index,
  password,
  onChangePassword,
  duplicate,
  confirmation,
  onChangeConfirmation,
  onRemove,
}: {
  index: number;
  password: string;
  onChangePassword: (password: string) => void;
  duplicate: boolean;
  confirmation: string;
  onChangeConfirmation: (confirmation: string) => void;
  onRemove: () => void;
}) => {
  const [typedPassword, setTypedPassword] = useState<string | null>(null);
  const [typedConfirmation, setTypedConfirmation] = useState<string | null>(
    null,
  );
  const [show, setShow] = useState(false);
  const editing = useMemo(
    () => typedPassword !== null || typedConfirmation !== null,
    [typedPassword, typedConfirmation],
  );
  const flagDuplicate = useMemo(
    () => !editing && duplicate,
    [editing, duplicate],
  );
  const mismatch = useMemo(
    () => password !== confirmation,
    [password, confirmation],
  );
  const flagMismatch = useMemo(() => !editing && mismatch, [editing, mismatch]);
  return (
    <div className="flex flex-row gap-3">
      <label className="w-30 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
        {index > 0 ? `Decoy password ${index}` : "Master password"}
      </label>
      <div className="display-inline-block grow">
        <input
          type={show ? "text" : "password"}
          placeholder="Type password"
          className={clsx(
            "w-full rounded-lg border",
            flagDuplicate
              ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500"
              : "border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
          )}
          value={typedPassword || password}
          onChange={({ target }) => setTypedPassword(target.value)}
          onFocus={() => setTypedPassword(password)}
          onBlur={() => {
            setTypedPassword(null);
            onChangePassword(typedPassword);
          }}
          required
        />
        {flagDuplicate && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            duplicate password
          </p>
        )}
      </div>
      <div className="display-inline-block grow">
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          className={clsx(
            "w-full rounded-lg border",
            flagMismatch
              ? "border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500"
              : "border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
          )}
          value={typedConfirmation || confirmation}
          onChange={({ target }) => setTypedConfirmation(target.value)}
          onFocus={() => setTypedConfirmation(confirmation)}
          onBlur={() => {
            setTypedConfirmation(null);
            onChangeConfirmation(typedConfirmation);
          }}
          required
        />
        {flagMismatch && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            password mismatch
          </p>
        )}
      </div>
      <div className="display-inline-block">
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
          onClick={() => setShow(!show)}
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            {show ? (
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            ) : (
              <>
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </>
            )}
          </svg>
        </button>
      </div>
      <div className="display-inline-block">
        <button
          type="button"
          className={clsx(
            { invisible: index === 0 },
            "inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800",
          )}
          disabled={index === 0}
          onClick={onRemove}
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const Page = () => {
  const [passwords, setPasswords] = useState<
    { password: string; confirmation: string }[]
  >([{ password: "", confirmation: "" }]);

  useEffect(() => {
    initTooltips();
  }, []);

  const [creationInProgress, setCreationInProgress] = useState(false);

  const hasEmptyPasswords = useMemo(
    () => passwords.some(({ password }) => !password),
    [passwords],
  );

  const hasBadConfirmations = useMemo(
    () =>
      passwords.some(({ password, confirmation }) => password !== confirmation),
    [passwords],
  );

  const hasDuplicatePasswords = useMemo(() => {
    for (let i = 0; i < passwords.length; i++) {
      for (let j = i + 1; j < passwords.length; j++) {
        if (passwords[i].password === passwords[j].password) {
          return true;
        }
      }
    }
    return false;
  }, [passwords]);

  const canSubmit = useMemo(
    () =>
      !creationInProgress &&
      !hasEmptyPasswords &&
      !hasBadConfirmations &&
      !hasDuplicatePasswords,
    [
      creationInProgress,
      hasEmptyPasswords,
      hasBadConfirmations,
      hasDuplicatePasswords,
    ],
  );

  return (
    <div className="mx-10 my-5">
      <article className="prose lg:prose-lg">
        <h1>Wallet Setup</h1>
        <p>Please provide a password for your wallet.</p>
        <p>
          You may optionally provide one or more decoy passwords. At most{" "}
          {MAX_WALLET_PASSWORDS} passwords are supported.
        </p>
      </article>
      <form
        className="mx-auto mt-10 w-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          if (canSubmit) {
            setCreationInProgress(true);
            try {
              await libernet().createWallet(
                passwords.map(({ password }) => password),
              );
            } finally {
              setCreationInProgress(false);
            }
          }
        }}
      >
        <div className="mb-3 flex flex-col gap-3">
          {passwords.map(({ password, confirmation }, index) => (
            <PasswordRow
              key={index}
              index={index}
              password={password}
              onChangePassword={(newPassword) => {
                setPasswords(
                  passwords.map(({ password, confirmation }, passwordIndex) => {
                    if (passwordIndex !== index) {
                      return { password, confirmation };
                    } else {
                      return { password: newPassword, confirmation };
                    }
                  }),
                );
              }}
              duplicate={(() => {
                if (!password) {
                  return false;
                }
                for (let i = 0; i < index; i++) {
                  if (passwords[i].password === password) {
                    return true;
                  }
                }
                return false;
              })()}
              confirmation={confirmation}
              onChangeConfirmation={(newConfirmation) => {
                setPasswords(
                  passwords.map(({ password, confirmation }, passwordIndex) => {
                    if (passwordIndex !== index) {
                      return { password, confirmation };
                    } else {
                      return { password, confirmation: newConfirmation };
                    }
                  }),
                );
              }}
              onRemove={() => {
                const newPasswords = passwords.slice();
                newPasswords.splice(index, 1);
                setPasswords(newPasswords);
              }}
            />
          ))}
          {passwords.length < MAX_WALLET_PASSWORDS && (
            <div className="flex flex-row gap-3">
              <span className="grow"></span>
              <button
                type="button"
                data-tooltip-target="add-decoy-password-tooltip"
                className="inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                onClick={() =>
                  setPasswords(
                    passwords.concat({ password: "", confirmation: "" }),
                  )
                }
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </button>
              <div
                id="add-decoy-password-tooltip"
                role="tooltip"
                className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-xs transition-opacity duration-300 dark:bg-gray-700"
              >
                Add a decoy password
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={clsx(
            !canSubmit && "cursor-not-allowed",
            "rounded-lg",
            canSubmit
              ? "bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              : "bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-blue-500",
          )}
          disabled={!canSubmit}
        >
          {creationInProgress && (
            <svg
              className="me-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          Create wallet
        </button>
      </form>
    </div>
  );
};
