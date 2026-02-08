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
      "bg-blue-700 text-center text-sm font-medium text-white not-disabled:cursor-pointer active:bg-blue-800 disabled:bg-blue-400",
      round ? "rounded-full p-3" : "rounded-lg px-5 py-2.5",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const SecondaryButton = ({
  className,
  round = false,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { round?: boolean }) => (
  <button
    className={clsx(
      "border-2 border-neutral-300 bg-transparent text-center text-sm font-medium text-neutral-800 not-disabled:cursor-pointer not-disabled:hover:bg-neutral-100 not-disabled:active:bg-neutral-200 disabled:text-neutral-300",
      round ? "rounded-full p-3" : "rounded-lg px-5 py-2.5",
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
  style = "not-disabled:hover:bg-neutral-100 not-disabled:active:bg-neutral-200 disabled:text-neutral-300",
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "style"> & {
  round?: boolean;
  style?: string;
}) => (
  <button
    className={clsx(
      "bg-transparent p-2",
      round ? "rounded-full" : "rounded-lg",
      style,
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
