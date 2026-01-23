import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

const SIZES = {
  md: "p-4",
  lg: "p-10",
};

export const Card = ({
  size = "md",
  clip = true,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  size?: keyof typeof SIZES;
  clip?: boolean;
}) => (
  <div
    className={clsx(
      clip && "overflow-hidden",
      "rounded-lg bg-white",
      SIZES[size],
      "shadow-sm",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
