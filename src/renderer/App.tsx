import { useEffect, useState } from "react";

import { ControlBar } from "./ControlBar";
import { libernet } from "./Libernet";
import { Page as SettingsPage } from "./Settings";
import { useAsyncEffect } from "./Utilities";
import { Page as WalletPage } from "./Wallet";

export const App = () => {
  const [view, setView] = useState<
    "control" | "web" | "wallet" | "settings" | null
  >(null);
  useEffect(() => libernet().onViewChange((view) => setView(view)), []);
  useAsyncEffect(async () => {
    setView(await libernet().getView());
  }, []);
  switch (view) {
    case "control":
      return <ControlBar />;
    case "settings":
      return <SettingsPage />;
    case "wallet":
      return <WalletPage />;
    default:
      return null;
  }
};
