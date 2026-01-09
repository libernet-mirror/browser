import { clsx } from "clsx";
import { useMemo, useState, type ComponentPropsWithoutRef } from "react";

const states = {
  valid: "border-green-500 bg-gray-50 text-gray-900",
  invalid: "border-red-500 bg-gray-50 text-gray-900",
  neutral: "border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500",
};

export const Input = ({
  type = "text",
  state = "neutral",
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  state?: "valid" | "invalid" | "neutral";
}) => (
  <input
    type={type}
    className={clsx(
      "w-full rounded-lg border-2 p-2.5 text-sm outline-none",
      states[state],
      className,
    )}
    {...props}
  />
);

export const ValidatedInput = ({
  value,
  pattern,
  className,
  onFocus = null,
  onBlur = null,
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  value: string;
  onFocus?: (() => void) | null;
  onBlur?: (() => void) | null;
}) => {
  const [focus, setFocus] = useState(false);
  const state = useMemo<"valid" | "invalid" | "neutral">(() => {
    if (focus) {
      return "neutral";
    } else if (value) {
      if (new RegExp(pattern).test(value)) {
        return "valid";
      } else {
        return "invalid";
      }
    } else {
      return "neutral";
    }
  }, [value, focus]);
  return (
    <input
      type="text"
      value={value}
      className={clsx(
        "w-full rounded-lg border-2 p-2.5 text-sm outline-none",
        states[state],
        className,
      )}
      onFocus={() => {
        setFocus(true);
        onFocus?.();
      }}
      onBlur={() => {
        onBlur?.();
        setFocus(false);
      }}
      {...props}
    />
  );
};

export const TextArea = ({
  rows = 3,
  state = "neutral",
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & {
  state?: "valid" | "invalid" | "neutral";
}) => (
  <textarea
    className={clsx(
      "w-full rounded-lg border-2 p-2.5 text-sm outline-none",
      states[state],
      className,
    )}
    rows={rows}
    {...props}
  />
);

export const ValidationError = ({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) => <p className={clsx("text-sm text-red-500", className)}>{message}</p>;
