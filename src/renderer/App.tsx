import { useState } from "react";

import { ControlBar } from "./ControlBar";
import { Page as WalletPage } from "./Wallet";
import { libernet, useAsyncEffect } from "./Utilities";

export const App = () => {
  const [view, setView] = useState<"control" | "system" | "web" | null>(null);
  useAsyncEffect(async () => {
    setView(await libernet().getView());
  }, []);
  switch (view) {
    case "control":
      return <ControlBar />;
    case "system":
      return <WalletPage />;
    default:
      return null;
  }
};
