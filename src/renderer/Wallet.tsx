import { useState } from "react";

import { type AccountInfo, type TransactionInfo } from "../data";

import { Card } from "./components/Card";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./components/Dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "./components/Tables";
import { Tooltip, TooltipContainer } from "./components/Tooltip";
import { CopyIcon } from "./icons/Copy";

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
  const [tooltip, setTooltip] = useState<string | null>(null);
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
  return (
    <Card className="mx-auto mt-3">
      <p className="prose lg:prose-lg">
        Hello{" "}
        <kbd className="whitespace-nowrap">
          {account?.address || accountAddress}{" "}
          <TooltipContainer>
            <button
              className="m-0 cursor-pointer border-none bg-none p-0"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  account?.address || accountAddress,
                );
                setTooltip("Copied!");
              }}
              onMouseEnter={() => setTooltip("Copy to clipboard")}
              onMouseLeave={() => setTooltip(null)}
            >
              <CopyIcon className="inline size-4" />
            </button>
            <Tooltip show={tooltip !== null}>{tooltip}</Tooltip>
          </TooltipContainer>
        </kbd>
      </p>
      {account && (
        <p className="prose mt-3 lg:prose-lg">
          Your LIB balance is: <strong>{formatBalance(account.balance)}</strong>{" "}
          <br />
          <small>
            proven at block #{account.blockDescriptor.blockNumber} as of{" "}
            {account.blockDescriptor.timestamp.toLocaleString()}
          </small>
        </p>
      )}
    </Card>
  );
};

const Transactions = ({ accountAddress }: { accountAddress: string }) => {
  const [transactions, setTransactions] = useState<TransactionInfo[] | null>(
    null,
  );
  useAsyncEffect(async () => {
    setTransactions(null);
    setTransactions(
      (
        await Promise.all([
          libernet().queryTransactions({
            from: accountAddress,
            sortOrder: "descending",
            maxCount: 10,
          }),
          libernet().queryTransactions({
            to: accountAddress,
            sortOrder: "descending",
            maxCount: 10,
          }),
        ])
      )
        .flat()
        .sort(
          (first, second) =>
            first.blockDescriptor.timestamp.valueOf() -
            second.blockDescriptor.timestamp.valueOf(),
        )
        .slice(0, 10),
    );
  }, [accountAddress]);
  return (
    <Card className="m-3 flex grow flex-col">
      <Table className="grow">
        <TableHeader>
          <TableHeaderCell>date &amp; time</TableHeaderCell>
          <TableHeaderCell>from</TableHeaderCell>
          <TableHeaderCell>to</TableHeaderCell>
          <TableHeaderCell>type</TableHeaderCell>
          <TableHeaderCell>amount</TableHeaderCell>
          <TableHeaderCell>tx hash</TableHeaderCell>
        </TableHeader>
        <TableBody>
          {transactions === null ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <em>Loading&hellip;</em>
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map(({ blockDescriptor, signerAddress }) => (
              <TableRow>
                <TableCell>
                  {blockDescriptor.timestamp.toLocaleString()}
                </TableCell>
                <TableCell>
                  {signerAddress !== accountAddress ? (
                    <pre>{signerAddress}</pre>
                  ) : (
                    <>You ({signerAddress})</>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <em>No transactions yet.</em>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

const hasAssets = (account: AccountInfo) =>
  account.balance !== 0n || account.stakingBalance !== 0n;

const Hello = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  useAsyncEffect(async () => {
    let newAccounts = accounts;
    let stop = false;
    let account: AccountInfo;
    let index = 0;
    do {
      account = await libernet().getAccountByNumber(index++);
      setAccounts((newAccounts = newAccounts.concat(account)));
    } while (!stop && hasAssets(account));
    return () => {
      stop = true;
    };
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
      <Transactions accountAddress={accounts[currentAccountIndex].address} />
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
