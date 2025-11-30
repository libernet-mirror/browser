import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

const sizes = {
  md: "p-4",
  lg: "p-10",
};

export const Card = ({
  size = "md",
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & { size?: keyof typeof sizes }) => (
  <div
    className={clsx("rounded-lg bg-white", sizes[size], "shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);
