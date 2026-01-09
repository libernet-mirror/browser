import { useState } from "react";

import { type AccountInfo, type TransactionInfo } from "../data";

import { AccountAddress } from "./components/Address";
import { PrimaryButton } from "./components/Buttons";
import { BreadcrumbItem, Breadcrumbs } from "./components/Breadcrumbs";
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
import { GreaterIcon } from "./icons/Greater";
import { HomeIcon } from "./icons/Home";
import { PlusIcon } from "./icons/Plus";

import { jazzicon } from "./Jazzicon";
import { libernet } from "./Libernet";
import Logo from "./Logo";
import { formatBalance, useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";
import { ValidatedInput } from "./components/Input";

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
  return (
    <Card clip={false} className="mx-auto mt-3">
      <p className="prose lg:prose-lg">
        Hello <AccountAddress address={account?.address || accountAddress} />
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

const TransactionList = ({
  accountAddress,
  onNewTransaction,
}: {
  accountAddress: string;
  onNewTransaction: () => void;
}) => {
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
    <Card className="relative m-3 flex grow flex-col">
      <Breadcrumbs className="mb-3">
        <BreadcrumbItem active>
          <HomeIcon className="me-1.5 size-4" />
          Account overview
        </BreadcrumbItem>
      </Breadcrumbs>
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
      <TooltipContainer absolute className="right-0 bottom-0 mr-6 mb-6">
        <PrimaryButton
          round
          className="cursor-pointer shadow-md"
          onClick={onNewTransaction}
        >
          <PlusIcon className="size-6" />
        </PrimaryButton>
        <Tooltip anchor="right" className="whitespace-nowrap">
          New transaction&hellip;
        </Tooltip>
      </TooltipContainer>
    </Card>
  );
};

const NewTransaction = ({ onClose }: { onClose: () => void }) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  return (
    <Card className="m-3 flex grow flex-col">
      <Breadcrumbs className="mb-3">
        <BreadcrumbItem onClick={onClose}>
          <HomeIcon className="me-1.5 size-4" />
          Account overview
        </BreadcrumbItem>
        <BreadcrumbItem>
          <GreaterIcon className="me-1.5 size-4" />
          New transaction
        </BreadcrumbItem>
      </Breadcrumbs>
      <form
        className="mx-auto w-md"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO
        }}
      >
        <label className="block text-sm font-medium text-neutral-600">
          Recipient address:
          <ValidatedInput
            value={recipientAddress}
            pattern="0[xX][0-9a-fA-F]{64}"
            onChange={({ target }) => setRecipientAddress("" + target.value)}
          />
        </label>
        {/* TODO */}
      </form>
    </Card>
  );
};

const hasAssets = (account: AccountInfo) =>
  account.balance !== 0n || account.stakingBalance !== 0n;

const Hello = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [view, setView] = useState<"list" | "new">("list");
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
          setView("list");
        }}
        onSwitchToNextAccount={async () => {
          const index = accounts.length;
          const account = await libernet().getAccountByNumber(index);
          if (accounts.length === index) {
            setAccounts(accounts.concat(account));
            await libernet().switchAccount(index);
            setCurrentAccountIndex(index);
            setView("list");
          }
        }}
      />
      <Balance accountAddress={accounts[currentAccountIndex].address} />
      {
        {
          list: (
            <TransactionList
              accountAddress={accounts[currentAccountIndex].address}
              onNewTransaction={() => setView("new")}
            />
          ),
          new: <NewTransaction onClose={() => setView("list")} />,
        }[view]
      }
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
