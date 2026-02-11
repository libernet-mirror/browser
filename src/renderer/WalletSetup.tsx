import { useMemo, useState } from "react";

import { clsx } from "clsx";

import { PlainButton, PrimaryButton } from "./components/Buttons";
import { Card } from "./components/Card";
import { EyeIcon, EyeSlashIcon, MinusIcon, PlusIcon } from "./components/Icons";
import { Input, ValidationError } from "./components/Input";
import { SpinnerIcon } from "./components/Spinner";

import { libernet } from "./Libernet";
import { MAX_WALLET_PASSWORDS } from "./Utilities";

const PasswordRow = ({
  index,
  duplicate,
  password,
  onPasswordChange,
  confirmation,
  onConfirmationChange,
  onRemove,
}: {
  index: number;
  duplicate: boolean;
  password: string;
  onPasswordChange: (newPassword: string) => void;
  confirmation: string;
  onConfirmationChange: (newConfirmation: string) => void;
  onRemove: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const mismatch = useMemo(
    () => !editing && password !== confirmation,
    [editing, password, confirmation],
  );
  return (
    <>
      <span className="col-1 content-center text-nowrap">
        {index > 0 ? `Decoy password ${index}` : "Master password"}
      </span>
      <Input
        type={visible ? "text" : "password"}
        placeholder="Type password"
        value={password}
        state={duplicate ? "invalid" : "neutral"}
        onChange={({ target }) => onPasswordChange(target.value)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        required
      />
      <Input
        type={visible ? "text" : "password"}
        placeholder="Confirm password"
        value={confirmation}
        state={mismatch ? "invalid" : "neutral"}
        onChange={({ target }) => onConfirmationChange(target.value)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        required
      />
      <PlainButton type="button" round onClick={() => setVisible(!visible)}>
        {visible ? (
          <EyeSlashIcon className="size-6" />
        ) : (
          <EyeIcon className="size-6" />
        )}
      </PlainButton>
      <PlainButton
        type="button"
        className={clsx({ invisible: index === 0 })}
        round
        disabled={index === 0}
        onClick={onRemove}
      >
        <MinusIcon className="size-6" />
      </PlainButton>
      {duplicate && (
        <ValidationError message="duplicate password" className="col-2" />
      )}
      {mismatch && (
        <ValidationError message="password mismatch" className="col-3" />
      )}
    </>
  );
};

const SetupForm = ({ onCreate }: { onCreate: () => void }) => {
  const [passwords, setPasswords] = useState<
    { password: string; confirmation: string }[]
  >([{ password: "", confirmation: "" }]);

  const [creationInProgress, setCreationInProgress] = useState(false);

  const hasEmptyPasswords = useMemo(
    () => passwords.some(({ password }) => !password),
    [passwords],
  );

  const hasBadConfirmations = useMemo(
    () =>
      passwords.some(({ password, confirmation }) => password !== confirmation),
    [passwords],
  );

  const hasDuplicatePasswords = useMemo(() => {
    for (let i = 0; i < passwords.length; i++) {
      for (let j = i + 1; j < passwords.length; j++) {
        if (passwords[i].password === passwords[j].password) {
          return true;
        }
      }
    }
    return false;
  }, [passwords]);

  const canSubmit = useMemo(
    () =>
      !creationInProgress &&
      !hasEmptyPasswords &&
      !hasBadConfirmations &&
      !hasDuplicatePasswords,
    [
      creationInProgress,
      hasEmptyPasswords,
      hasBadConfirmations,
      hasDuplicatePasswords,
    ],
  );

  return (
    <form
      className="mt-10"
      onSubmit={async (e) => {
        e.preventDefault();
        if (canSubmit) {
          setCreationInProgress(true);
          try {
            await libernet().createWallet(
              passwords.map(({ password }) => password),
            );
            onCreate();
          } finally {
            setCreationInProgress(false);
          }
        }
      }}
    >
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-3">
        {passwords.map(({ password, confirmation }, index) => (
          <PasswordRow
            key={index}
            index={index}
            duplicate={
              password.length > 0 &&
              passwords.some(
                ({ password: password2 }, index2) =>
                  index2 !== index && password2 === password,
              )
            }
            password={password}
            onPasswordChange={(newPassword) => {
              const newPasswords = passwords.slice();
              newPasswords[index].password = newPassword;
              setPasswords(newPasswords);
            }}
            confirmation={confirmation}
            onConfirmationChange={(newConfirmation) => {
              const newPasswords = passwords.slice();
              newPasswords[index].confirmation = newConfirmation;
              setPasswords(newPasswords);
            }}
            onRemove={() => {
              const newPasswords = passwords.slice();
              newPasswords.splice(index, 1);
              setPasswords(newPasswords);
            }}
          />
        ))}
      </div>
      {passwords.length < MAX_WALLET_PASSWORDS && (
        <div className="mt-3 text-right">
          <PrimaryButton
            type="button"
            round
            onClick={() =>
              setPasswords(passwords.concat({ password: "", confirmation: "" }))
            }
          >
            <PlusIcon className="size-6" />
          </PrimaryButton>
        </div>
      )}
      <PrimaryButton type="submit" className="mt-3" disabled={!canSubmit}>
        {creationInProgress && (
          <SpinnerIcon color="white" className="me-3 size-4" />
        )}{" "}
        Create wallet
      </PrimaryButton>
    </form>
  );
};

export const Page = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="flow-root min-h-svh w-full bg-neutral-100">
      <Card size="lg" className="mx-auto my-10 block w-3xl">
        <article className="prose lg:prose-lg">
          <h1>Wallet Setup</h1>
          <p>Please provide a password for your wallet.</p>
          <p>
            You may optionally provide one or more decoy passwords. At most{" "}
            {MAX_WALLET_PASSWORDS} passwords are supported.
          </p>
        </article>
        <SetupForm onCreate={onCreate} />
      </Card>
    </div>
  );
};
