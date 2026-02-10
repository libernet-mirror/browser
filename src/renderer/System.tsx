import { useMemo } from "react";

import { Page as AboutPage } from "./About";
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
    case "about":
      document.title = "About LiberBrowser";
      return <AboutPage />;
    case "control":
      document.title = "Libernet";
      return <ControlBar />;
    case "control-incognito":
      document.title = "Libernet - Incognito";
      return <ControlBar incognito />;
    case "new":
      document.title = "New tab";
      return null;
    case "settings":
      document.title = "Libernet Settings";
      return <SettingsPage />;
    case "wallet":
      document.title = "LiberWallet";
      return <WalletPage />;
    default:
      return null;
  }
};
