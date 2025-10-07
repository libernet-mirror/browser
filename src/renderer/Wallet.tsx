import { useState } from "react";

import { libernet, useAsyncEffect } from "./Utilities";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

const Hello = () => {
  const [address, setAddress] = useState<string | null>(null);
  useAsyncEffect(async () => {
    setAddress(await libernet().getAccountByNumber(0));
  }, []);
  if (!address) {
    return null;
  }
  return (
    <div className="mx-10 my-5">
      <p className="prose lg:prose-lg">Hello, {address}.</p>
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
