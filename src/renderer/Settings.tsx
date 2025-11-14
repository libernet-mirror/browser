import { useState } from "react";

import { PrimaryButton } from "./components/Buttons";
import { Card } from "./components/Card";
import { TextArea } from "./components/Input";
import { NetworkIcon } from "./icons/Network";
import { SpinnerIcon } from "./icons/Spinner";

import { libernet } from "./Libernet";
import { useAsyncEffect } from "./Utilities";

type ViewType = "network";

const NetworkSettings = () => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [text, setText] = useState<string | null>(null);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useAsyncEffect(async () => {
    setAddresses(await libernet().getNodeList());
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">Network Settings</h1>
      <form
        className="mt-2 flex flex-col gap-2"
        onSubmit={async () => {
          setSaving(true);
          try {
            await libernet().setNodeList(addresses);
          } finally {
            setDirty(false);
            setSaving(false);
          }
        }}
      >
        <label>
          Enter the list of known Libernet nodes, one per line.
          <TextArea
            className="font-mono"
            rows={5}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            value={text ?? addresses.join("\n")}
            required
            onFocus={() => setText(addresses.join("\n"))}
            onChange={({ target }) => setText(target.value)}
            onBlur={() => {
              setAddresses(
                (text ?? "")
                  .split("\n")
                  .map((address) => address.trim())
                  .filter((address) => !!address)
                  .sort(),
              );
              setText(null);
              setDirty(true);
            }}
          />
        </label>
        <div className="text-end">
          <PrimaryButton type="submit" disabled={!dirty || saving}>
            {saving && <SpinnerIcon className="me-3 size-4" />}
            Save
          </PrimaryButton>
        </div>
      </form>
    </>
  );
};

const Settings = ({ view }: { view: ViewType }) => {
  switch (view) {
    case "network":
      return <NetworkSettings />;
    default:
      return null;
  }
};

export const Page = () => {
  const [view, setView] = useState<ViewType>("network");
  return (
    <div className="flex min-h-svh w-full flex-row bg-neutral-100">
      <nav className="flex w-40 flex-col bg-white shadow-sm">
        <label className="w-full cursor-pointer bg-transparent p-2 hover:bg-neutral-100 active:bg-neutral-200">
          <input type="radio" checked hidden />
          <NetworkIcon className="me-3 inline-block size-6" /> Network
        </label>
      </nav>
      <Card className="m-3 grow">
        <Settings view={view} />
      </Card>
    </div>
  );
};
