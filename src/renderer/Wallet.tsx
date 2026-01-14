import { type ReactNode, useState } from "react";

import {
  type AccountInfo,
  type BlockRewardTransactionPayload,
  type CoinTransferTransactionPayload,
  type TransactionInfo,
} from "../data";

import { Backdrop, BackdropProvider } from "./components/Backdrop";
import { PrimaryButton, SecondaryButton } from "./components/Buttons";
import { BreadcrumbItem, Breadcrumbs } from "./components/Breadcrumbs";
import { Card } from "./components/Card";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./components/Dropdown";
import { ValidatedInput } from "./components/Input";
import { Scalar } from "./components/Scalar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "./components/Tables";
import { Tooltip, TooltipContainer } from "./components/Tooltip";
import { LeftIcon } from "./icons/Left";
import { PlusIcon } from "./icons/Plus";
import { RightIcon } from "./icons/Right";
import { SpinnerIcon } from "./icons/Spinner";

import { jazzicon } from "./Jazzicon";
import { libernet } from "./Libernet";
import Logo from "./Logo";
import { formatLibAmount, parseLibAmount, useAsyncEffect } from "./Utilities";
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
  return (
    <Card clip={false} className="mx-auto mt-3">
      <p className="prose lg:prose-lg">
        Hello <Scalar value={account?.address || accountAddress} />
      </p>
      {account && (
        <p className="prose mt-3 lg:prose-lg">
          Your LIB balance is:{" "}
          <strong>{formatLibAmount(account.balance)}</strong>
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

const TransactionRow = ({
  accountAddress,
  transaction,
}: {
  accountAddress: string;
  transaction: TransactionInfo;
}) => {
  const { hash, blockDescriptor, signerAddress, type, payload } = transaction;
  const recipient = ((): string | null => {
    switch (type) {
      case "blockReward":
        return (payload as BlockRewardTransactionPayload).recipient;
      case "sendCoins":
        return (payload as CoinTransferTransactionPayload).recipient;
      default:
        return null;
    }
  })();
  const uiType = (() => {
    switch (type) {
      case "blockReward":
        if (recipient !== accountAddress) {
          return "none";
        } else {
          return "received";
        }
      case "sendCoins":
        if (recipient === accountAddress) {
          return "received";
        } else if (signerAddress === accountAddress) {
          return "sent";
        } else {
          return "none";
        }
      default:
        return "none";
    }
  })();
  const amount = (() => {
    switch (type) {
      case "blockReward":
        return (payload as CoinTransferTransactionPayload).amount;
      case "sendCoins":
        return (payload as CoinTransferTransactionPayload).amount;
      default:
        return null;
    }
  })();
  return (
    <TableRow>
      <TableCell>{blockDescriptor.timestamp.toLocaleString()}</TableCell>
      <TableCell>
        {signerAddress !== accountAddress ? (
          <Scalar value={signerAddress} maxLength={15} />
        ) : (
          "You"
        )}
      </TableCell>
      <TableCell>
        {recipient !== accountAddress
          ? recipient && <Scalar value={recipient} maxLength={15} />
          : "You"}
      </TableCell>
      <TableCell className="text-nowrap">
        {((): ReactNode => {
          switch (uiType) {
            case "sent":
              return (
                <>
                  <RightIcon className="inline size-4 text-red-500" /> sent
                </>
              );
            case "received":
              return (
                <>
                  <LeftIcon className="inline size-4 text-green-500" /> received
                </>
              );
            default:
              return null;
          }
        })()}
      </TableCell>
      <TableCell>{amount && formatLibAmount(amount, 3)}</TableCell>
      <TableCell>
        <Scalar value={hash} maxLength={15} />
      </TableCell>
    </TableRow>
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
            second.blockDescriptor.timestamp.valueOf() -
            first.blockDescriptor.timestamp.valueOf(),
        )
        .slice(0, 10),
    );
  }, [accountAddress]);
  return (
    <Card className="relative m-3 flex grow flex-col">
      <Breadcrumbs className="mb-3">
        <BreadcrumbItem home active>
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
          <TableHeaderCell>hash</TableHeaderCell>
        </TableHeader>
        <TableBody>
          {transactions === null ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <em>Loading&hellip;</em>
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionRow
                accountAddress={accountAddress}
                transaction={transaction}
              />
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
        <PrimaryButton round className="shadow-md" onClick={onNewTransaction}>
          <PlusIcon className="size-6" />
        </PrimaryButton>
        <Tooltip anchor="right" className="whitespace-nowrap">
          New transaction&hellip;
        </Tooltip>
      </TooltipContainer>
    </Card>
  );
};

const NewTransaction = ({
  senderAccount,
  onCancel,
  onDone,
}: {
  senderAccount: AccountInfo;
  onCancel: () => void;
  onDone: (transaction: TransactionInfo) => void;
}) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const validateRecipientAddress = (address: string) =>
    address !== senderAccount.address && /^0x[0-9a-f]{64}$/i.test(address);
  const validateAmount = (value: string) => {
    if (!/^[0-9]+(?:\.[0-9]+)?$/.test(value)) {
      return false;
    }
    if (parseLibAmount(value) > senderAccount.balance) {
      return false;
    }
    return true;
  };
  return (
    <Card className="m-3 flex grow flex-col">
      <Breadcrumbs className="mb-3">
        <BreadcrumbItem home onClick={onCancel}>
          Account overview
        </BreadcrumbItem>
        <BreadcrumbItem active>New transaction</BreadcrumbItem>
      </Breadcrumbs>
      <form
        className="mx-auto w-md"
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            validateRecipientAddress(recipientAddress) &&
            validateAmount(amount)
          ) {
            let transaction: TransactionInfo;
            try {
              setSubmitting(true);
              transaction = await libernet().submitTransaction("sendCoins", {
                recipient: recipientAddress,
                amount: parseLibAmount(amount),
              });
            } catch (e) {
              setSubmitting(false);
              throw e;
            }
            onDone(transaction);
          }
        }}
      >
        <label className="mb-3 block text-sm font-medium text-neutral-800">
          Recipient address:
          <ValidatedInput
            value={recipientAddress}
            validate={validateRecipientAddress}
            onChange={({ target }) => setRecipientAddress("" + target.value)}
          />
        </label>
        <label className="mb-3 block text-sm font-medium text-neutral-800">
          LIB amount:
          <ValidatedInput
            value={amount}
            validate={validateAmount}
            onChange={({ target }) => setAmount("" + target.value)}
          />
        </label>
        <div className="flex gap-x-3">
          <span className="grow"></span>
          <SecondaryButton onClick={onCancel}>Back</SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={
              submitting ||
              !validateRecipientAddress(recipientAddress) ||
              !validateAmount(amount)
            }
          >
            {submitting && <SpinnerIcon className="me-3 size-4" />} Submit
          </PrimaryButton>
        </div>
      </form>
    </Card>
  );
};

const TransactionReceipt = ({
  transaction: { hash, signerAddress, chainId, nonce, type, payload },
  onClose,
}: {
  transaction: TransactionInfo;
  onClose: () => void;
}) => (
  <Card className="m-3 flex grow flex-col">
    <Breadcrumbs className="mb-3">
      <BreadcrumbItem home onClick={onClose}>
        Account overview
      </BreadcrumbItem>
      <BreadcrumbItem>New transaction</BreadcrumbItem>
      <BreadcrumbItem active>Receipt</BreadcrumbItem>
    </Breadcrumbs>
    <form
      className="w-xxl mx-auto text-sm font-medium text-neutral-800"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="mb-3">
        Thank you. Your transaction has been recorded and should be included in
        a block soon.
      </div>
      <label className="mb-3 block">
        Transaction hash: <Scalar value={hash} />
      </label>
      <label className="mb-3 block">
        Signer address: <Scalar value={signerAddress} />
      </label>
      <label className="mb-3 block">Chain ID: {chainId}</label>
      <label className="mb-3 block">Nonce: {nonce}</label>
      {type === "sendCoins" && (
        <>
          <label className="mb-3 block">
            Recipient address:{" "}
            <Scalar
              value={(payload as CoinTransferTransactionPayload).recipient}
            />
          </label>
          <label className="mb-3 block">
            amount: LIB{" "}
            {formatLibAmount(
              (payload as CoinTransferTransactionPayload).amount,
            )}
          </label>
        </>
      )}
      <div className="flex">
        <span className="grow"></span>
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </form>
  </Card>
);

const hasAssets = (account: AccountInfo) =>
  account.balance !== 0n || account.stakingBalance !== 0n;

const Hello = () => {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [view, setView] = useState<"list" | "new" | TransactionInfo>("list");
  useAsyncEffect(async () => {
    let newAccounts = accounts;
    let account: AccountInfo;
    let index = 0;
    while (
      ((account = await libernet().getAccountByNumber(index)),
      !index++ || hasAssets(account))
    ) {
      setAccounts((newAccounts = newAccounts.concat(account)));
    }
  }, []);
  if (!accounts.length) {
    return null;
  }
  return (
    <BackdropProvider>
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
        <Backdrop className="flex grow flex-col">
          <Balance accountAddress={accounts[currentAccountIndex].address} />
          {(() => {
            switch (view) {
              case "list":
                return (
                  <TransactionList
                    accountAddress={accounts[currentAccountIndex].address}
                    onNewTransaction={() => setView("new")}
                  />
                );
              case "new":
                return (
                  <NewTransaction
                    senderAccount={accounts[currentAccountIndex]}
                    onCancel={() => setView("list")}
                    onDone={(transaction: TransactionInfo) =>
                      setView(transaction)
                    }
                  />
                );
              default:
                return (
                  <TransactionReceipt
                    transaction={view}
                    onClose={() => setView("list")}
                  />
                );
            }
          })()}
        </Backdrop>
      </div>
    </BackdropProvider>
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
