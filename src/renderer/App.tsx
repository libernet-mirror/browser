import { useState } from "react";

import { useAsyncEffect } from "./Utilities";
import { Page as WalletPage } from "./Wallet";
import { Page as WalletLoginPage } from "./WalletLogin";
import { Page as WalletSetupPage } from "./WalletSetup";

export const App = () => {
  const [walletStatus, setWalletStatus] = useState<
    null | "none" | "stored" | "loaded"
  >(null);
  useAsyncEffect(async () => {
    setWalletStatus(await window.libernet.getWalletStatus());
  }, []);
  switch (walletStatus) {
    case "loaded":
      return <WalletPage />;
    case "stored":
      return (
        <WalletLoginPage
          onSubmit={async (password) => {
            try {
              if (!(await window.libernet.loadWallet(password))) {
                return false;
              }
            } catch {
              return false;
            }
            setWalletStatus(await window.libernet.getWalletStatus());
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
