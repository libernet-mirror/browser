import { clsx } from "clsx";
import { useMemo, useState } from "react";

import { PlainButton, PrimaryButton } from "./components/Buttons";
import { EyeIcon } from "./components/Icons";
import { Input } from "./components/Input";
import { SpinnerIcon } from "./components/Spinner";

export const Page = ({
  onSubmit,
}: {
  onSubmit: (password: string) => Promise<boolean>;
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const canSubmit = useMemo(
    () => !!password && !unlocking,
    [password, unlocking],
  );
  return (
    <div className="mx-auto mt-40 max-w-xl min-w-md">
      <form
        className="grow"
        onSubmit={async (e) => {
          e.preventDefault();
          setUnlocking(true);
          try {
            if (!(await onSubmit(password))) {
              setPassword("");
              setInvalidPassword(true);
            }
          } finally {
            setUnlocking(false);
          }
        }}
      >
        <div className="mb-3 flex flex-row gap-3">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Wallet password"
            disabled={unlocking}
            autoFocus
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            onFocus={() => setInvalidPassword(false)}
            required
          />
          <div className="content-center">
            <PlainButton
              type="button"
              round
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
            >
              <EyeIcon className="size-6" />
            </PlainButton>
          </div>
        </div>
        <p
          className={clsx(
            invalidPassword ? "visible" : "invisible",
            "mb-3 text-sm text-red-600",
          )}
        >
          Invalid password, please try again!
        </p>
        <div className="flex">
          <span className="grow"></span>
          <PrimaryButton type="submit" disabled={!canSubmit}>
            {unlocking && <SpinnerIcon color="white" className="me-3 size-4" />}{" "}
            Unlock
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};
