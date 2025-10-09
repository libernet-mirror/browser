import { useState } from "react";

import { type AccountInfo } from "../data";

import { libernet } from "./Libernet";
import { formatBalance, useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

const Hello = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  useAsyncEffect(async () => {
    const account = await libernet().getAccountByNumber(0);
    setAddress(account);
    setAccountInfo(await libernet().getAccountInfo(account));
  }, []);
  if (!address) {
    return null;
  }
  return (
    <div className="mx-10 my-5">
      <p className="prose lg:prose-lg">Hello, {address}.</p>
      {accountInfo && (
        <p className="prose lg:prose-lg">
          Your LIB balance is:{" "}
          <strong>{formatBalance(accountInfo.balance)}</strong>
          <br />
          (proven at block #{accountInfo.blockDescriptor.blockNumber} as of{" "}
          {accountInfo.blockDescriptor.timestamp.toLocaleString()})
        </p>
      )}
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
              if (!(await libernet().loadWallet(password))) {
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
