import { useState } from "react";

import { libernet } from "./Libernet";
import { useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

const Hello = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  useAsyncEffect(async () => {
    const account = await libernet().getAccountByNumber(0);
    setAddress(account);
    setBalance(await libernet().getAccountBalance(account));
  }, []);
  if (!address) {
    return null;
  }
  return (
    <div className="mx-10 my-5">
      <p className="prose lg:prose-lg">Hello, {address}.</p>
      {balance && <p className="prose lg:prose-lg">LIB balance: {balance}</p>}
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
