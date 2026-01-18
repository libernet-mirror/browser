import { useMemo } from "react";

import { ControlBar } from "./ControlBar";
import { Page as SettingsPage } from "./Settings";
import { Page as WalletPage } from "./Wallet";

function getRoute(): string[] {
  return new URLSearchParams(window.location.search).get("route").split("/");
}

export const System = () => {
  const view = useMemo<string | null>(() => {
    const route = getRoute();
    if (route.length > 0) {
      return route[0];
    } else {
      return null;
    }
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
