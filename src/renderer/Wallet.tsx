import { initDropdowns } from "flowbite";
import { useEffect, useState } from "react";

import { type AccountInfo } from "../data";

import { jazzicon } from "./Jazzicon";
import { libernet } from "./Libernet";
import Logo from "./Logo";
import { formatBalance, useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

const AccountDropdown = ({
  accounts,
  currentAccountIndex,
  onAddAccount,
}: {
  accounts: AccountInfo[];
  currentAccountIndex: number;
  onAddAccount?: () => void;
}) => {
  useEffect(() => {
    initDropdowns();
  }, []);
  const account = accounts[currentAccountIndex];
  return (
    <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
      <button
        type="button"
        className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 md:me-0 dark:focus:ring-gray-600"
        id="account-menu-button"
        data-dropdown-toggle="account-dropdown"
        data-dropdown-placement="bottom-end"
      >
        <img
          className="h-8 w-8 rounded-full"
          src={jazzicon(account.address)}
          alt={account.address}
        />
      </button>
      <div
        className="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow-sm dark:divide-gray-600 dark:bg-gray-700"
        id="account-dropdown"
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">
            Account {currentAccountIndex + 1}
          </span>
          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
            <pre>{account.address}</pre>
          </span>
        </div>
        <ol className="py-2">
          {accounts.map((_, index) => (
            <li>
              <button
                disabled={index === currentAccountIndex}
                className="block w-full cursor-pointer px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Account {index + 1}
              </button>
            </li>
          ))}
        </ol>
        <ol className="py-2">
          <li>
            <button
              className="block w-full cursor-pointer px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => onAddAccount?.()}
            >
              Show next account&hellip;
            </button>
          </li>
        </ol>
      </div>
    </div>
  );
};

const Navbar = ({
  accounts,
  currentAccountIndex,
  onAddAccount,
}: {
  accounts: AccountInfo[];
  currentAccountIndex: number;
  onAddAccount?: () => void;
}) => (
  <nav className="border-gray-200 bg-white dark:bg-gray-900">
    <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <a
        href="liber://wallet"
        className="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <Logo className="h-8 w-8" />
      </a>
      <AccountDropdown
        accounts={accounts}
        currentAccountIndex={currentAccountIndex}
        onAddAccount={onAddAccount}
      />
    </div>
  </nav>
);

const Balance = ({ account }: { account: AccountInfo }) => (
  <div className="mx-10 my-5">
    <p className="prose lg:prose-lg">Hello, {account.address}.</p>
    <p className="prose lg:prose-lg">
      Your LIB balance is: <strong>{formatBalance(account.balance)}</strong>
      <br />
      (proven at block #{account.blockDescriptor.blockNumber} as of{" "}
      {account.blockDescriptor.timestamp.toLocaleString()})
    </p>
  </div>
);

const hasAssets = (account: AccountInfo) =>
  account.balance !== 0n || account.stakingBalance !== 0n;

const Hello = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  useAsyncEffect(async () => {
    let account: AccountInfo;
    let index = 0;
    do {
      account = await libernet().getAccountByNumber(index++);
      setAccounts(accounts.concat(account));
    } while (hasAssets(account));
  }, []);
  if (accounts.length > 0) {
    const account = accounts[0];
    return (
      <>
        <Navbar
          accounts={accounts}
          currentAccountIndex={0}
          onAddAccount={async () => {
            const account = await libernet().getAccountByNumber(
              accounts.length,
            );
            setAccounts(accounts.concat(account));
          }}
        />
        <Balance account={account} />
      </>
    );
  } else {
    return null;
  }
};

export const Page = () => {
  const [walletStatus, setWalletStatus] = useState<
    null | "none" | "stored" | "loaded"
  >(null);
  useAsyncEffect(async () => {
    setWalletStatus(await libernet().getWalletStatus());
  }, []);
  switch (walletStatus) {
    case "loaded":
      return <Hello />;
    case "stored":
      return (
        <WalletLoginPage
          onSubmit={async (password) => {
            try {
              if (!(await libernet().loadWallet(password, 0))) {
                return false;
              }
            } catch {
              return false;
            }
            setWalletStatus(await libernet().getWalletStatus());
            return true;
          }}
        />
      );
    case "none":
      return <WalletSetupPage />;
    default:
      return null;
  }
};
