import { clsx } from "clsx";
import { PropsWithChildren, useState } from "react";

import { PrimaryButton } from "./components/Buttons";
import { Card } from "./components/Card";
import { Input, TextArea } from "./components/Input";
import { GearIcon } from "./icons/Gear";
import { NetworkIcon } from "./icons/Network";
import { SpinnerIcon } from "./icons/Spinner";

import { libernet } from "./Libernet";
import { useAsyncEffect } from "./Utilities";

type ViewType = "general" | "network";

const PageTitle = ({ children }: PropsWithChildren) => (
  <h1 className="text-2xl font-bold">{children}</h1>
);

const HomePageField = () => {
  const [previousValue, setPreviousValue] = useState("");
  const [homePage, setHomePage] = useState("");
  const [validation, setValidation] = useState<string | null>(null);
  useAsyncEffect(async () => {
    const homePage = await libernet().getHomePage();
    setPreviousValue(homePage);
    setHomePage(homePage);
  }, []);
  return (
    <label>
      Home page:
      <Input
        value={homePage}
        state={(() => {
          switch (validation) {
            case null:
              return "neutral";
            case "":
              return "valid";
            default:
              return "invalid";
          }
        })()}
        onFocus={() => {
          setValidation(null);
          setPreviousValue(homePage);
        }}
        onChange={({ target }) => setHomePage(target.value)}
        onBlur={async ({ target }) => {
          let value;
          try {
            value = await libernet().setHomePage(target.value);
          } catch (e) {
            setValidation((e as Error).message);
            return;
          }
          setHomePage(value);
          if (value !== previousValue) {
            setValidation("");
          } else {
            setValidation(null);
          }
        }}
      />
    </label>
  );
};

const GeneralSettings = () => {
  return (
    <>
      <PageTitle>General Settings</PageTitle>
      <form
        className="mt-2 flex flex-col gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <HomePageField />
      </form>
    </>
  );
};

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
      <PageTitle>Network Settings</PageTitle>
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
    case "general":
      return <GeneralSettings />;
    case "network":
      return <NetworkSettings />;
    default:
      return null;
  }
};

const Navbar = ({ children }: PropsWithChildren) => (
  <nav className="flex w-40 flex-col bg-white shadow-sm">{children}</nav>
);

const NavItem = ({
  active = false,
  onSelect,
  children,
}: PropsWithChildren & {
  active?: boolean;
  onSelect: () => void;
}) => (
  <label
    className={clsx(
      "w-full cursor-pointer p-2 hover:bg-neutral-100 active:bg-neutral-200",
      active ? "bg-neutral-100" : "bg-transparent",
    )}
  >
    <input
      type="radio"
      name="view"
      checked={active}
      hidden
      onChange={({ target }) => {
        if (target.checked) {
          onSelect();
        }
      }}
    />
    {children}
  </label>
);

export const Page = () => {
  const [view, setView] = useState<ViewType>("general");
  return (
    <div className="flex min-h-svh w-full flex-row bg-neutral-100">
      <Navbar>
        <NavItem
          active={view === "general"}
          onSelect={() => setView("general")}
        >
          <GearIcon className="me-3 inline-block size-6" /> General
        </NavItem>
        <NavItem
          active={view === "network"}
          onSelect={() => setView("network")}
        >
          <NetworkIcon className="me-3 inline-block size-6" /> Network
        </NavItem>
      </Navbar>
      <Card className="m-3 grow">
        <Settings view={view} />
      </Card>
    </div>
  );
};
