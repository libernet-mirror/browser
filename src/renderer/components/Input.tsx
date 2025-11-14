import { clsx } from "clsx";
import { type ComponentPropsWithoutRef } from "react";

export const Input = ({
  type = "text",
  invalid = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) => (
  <input
    type={type}
    className={clsx(
      "w-full rounded-lg border-2 p-2.5 text-sm outline-none",
      invalid
        ? "border-red-500 bg-gray-50 text-gray-900"
        : "border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500",
      className,
    )}
    {...props}
  />
);

export const TextArea = ({
  rows = 3,
  invalid = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea"> & { invalid?: boolean }) => (
  <textarea
    className={clsx(
      "w-full rounded-lg border-2 p-2.5 text-sm outline-none",
      invalid
        ? "border-red-500 bg-gray-50 text-gray-900"
        : "border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500",
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
