import { useState } from "react";

import { type AccountInfo } from "../data";

import { Card } from "./components/Card";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./components/Dropdown";

import { jazzicon } from "./Jazzicon";
import { libernet } from "./Libernet";
import Logo from "./Logo";
import { formatBalance, useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

const AccountTile = ({
  account,
  index,
}: {
  account: AccountInfo;
  index: number;
}) => (
  <span className="inline-flex flex-row gap-x-4">
    <span className="content-center">
      <img
        src={jazzicon(account.address)}
        alt={account.address}
        className="size-8 rounded-md"
      />
    </span>
    <span className="flex grow flex-col">
      <span>Account {index + 1}</span>
      <pre>{account.address.slice(0, 30)}&hellip;</pre>
    </span>
  </span>
);

const Navbar = ({
  accounts,
  currentAccountIndex,
  onSwitchToAccount,
  onSwitchToNextAccount,
}: {
  accounts: AccountInfo[];
  currentAccountIndex: number;
  onSwitchToAccount(index: number): Promise<void>;
  onSwitchToNextAccount(): Promise<void>;
}) => {
  const account = accounts[currentAccountIndex];
  return (
    <header className="flex bg-white p-2 shadow-sm">
      <Logo className="size-8" />
      <span className="grow" />
      <Dropdown>
        <DropdownButton>
          <img
            src={jazzicon(account.address)}
            alt={account.address}
            className="size-6 rounded-md"
          />
        </DropdownButton>
        <DropdownMenu>
          {accounts.map((account, index) => (
            <DropdownItem
              key={index}
              disabled={index === currentAccountIndex}
              onClick={() => onSwitchToAccount(index)}
            >
              <AccountTile account={account} index={index} />
            </DropdownItem>
          ))}
          <DropdownItem onClick={() => onSwitchToNextAccount()}>
            Switch to next account&hellip;
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
};

const Balance = ({ accountAddress }: { accountAddress: string }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  useAsyncEffect(async () => {
    setAccount(await libernet().getAccountByAddress(accountAddress));
    const offAccountChange = libernet().onAccountChange((account) => {
      if (account.address === accountAddress) {
        setAccount(account);
      }
    }, accountAddress);
    await libernet().watchAccount(accountAddress);
    return async () => {
      offAccountChange();
      await libernet().unwatchAccount(accountAddress);
    };
  }, [accountAddress]);
  if (account) {
    return (
      <Card className="mx-auto mt-3">
        <p className="prose lg:prose-lg">Hello, {account.address}.</p>
        <p className="prose lg:prose-lg">
          Your LIB balance is: <strong>{formatBalance(account.balance)}</strong>
          <br />
          (proven at block #{account.blockDescriptor.blockNumber} as of{" "}
          {account.blockDescriptor.timestamp.toLocaleString()})
        </p>
      </Card>
    );
  } else {
    return (
      <Card className="mx-auto mt-3">
        <p className="prose lg:prose-lg">Hello, {accountAddress}.</p>
        <p className="prose lg:prose-lg">{/* TODO: balance skeleton */}</p>
      </Card>
    );
  }
};

const hasAssets = (account: AccountInfo) =>
  account.balance !== 0n || account.stakingBalance !== 0n;

const Hello = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  useAsyncEffect(async () => {
    let account: AccountInfo;
    let index = 0;
    do {
      account = await libernet().getAccountByNumber(index++);
      setAccounts(accounts.concat(account));
    } while (hasAssets(account));
  }, []);
  if (!accounts.length) {
    return null;
  }
  return (
    <div className="flex min-h-svh w-full flex-col bg-neutral-100">
      <Navbar
        accounts={accounts}
        currentAccountIndex={currentAccountIndex}
        onSwitchToAccount={async (index) => {
          await libernet().switchAccount(index);
          setCurrentAccountIndex(index);
        }}
        onSwitchToNextAccount={async () => {
          const index = accounts.length;
          const account = await libernet().getAccountByNumber(index);
          if (accounts.length === index) {
            setAccounts(accounts.concat(account));
            await libernet().switchAccount(index);
            setCurrentAccountIndex(index);
          }
        }}
      />
      <Balance accountAddress={accounts[currentAccountIndex].address} />
    </div>
  );
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
      return (
        <WalletSetupPage
          onCreate={async () =>
            setWalletStatus(await libernet().getWalletStatus())
          }
        />
      );
    default:
      return null;
  }
};
