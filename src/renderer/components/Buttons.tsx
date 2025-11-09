import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export const PrimaryButton = ({
  className,
  round = false,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { round?: boolean }) => (
  <button
    className={clsx(
      round ? "rounded-full" : "rounded-lg",
      "bg-blue-700",
      round ? "p-3" : "px-5 py-2.5",
      "text-center text-sm font-medium text-white active:bg-blue-800 disabled:bg-blue-400",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const PlainButton = ({
  className,
  round = false,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { round?: boolean }) => (
  <button
    className={clsx(
      round ? "rounded-full" : "rounded-lg",
      "bg-transparent p-2 hover:bg-neutral-100 active:bg-neutral-200",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
