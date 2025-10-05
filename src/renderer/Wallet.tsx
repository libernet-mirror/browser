import { useState } from "react";

import { useAsyncEffect } from "./Utilities";

export const Page = () => {
  const [address, setAddress] = useState<string | null>(null);
  useAsyncEffect(async () => {
    setAddress(await window.libernet.getAccountByNumber(0));
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
