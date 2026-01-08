import { clsx } from "clsx";
import { type PropsWithChildren } from "react";

import { GreaterIcon } from "../icons/Greater";
import { HomeIcon } from "../icons/Home";

export const Breadcrumbs = ({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) => (
  <nav className={className}>
    <ol className="inline-flex items-center space-x-2">{children}</ol>
  </nav>
);

export const BreadcrumbItem = ({
  children,
  home = false,
  onClick = null,
}: PropsWithChildren & {
  home?: boolean;
  onClick?: () => void;
}) => (
  <li
    className={clsx(
      "inline-flex items-center text-sm font-medium",
      onClick
        ? "cursor-pointer text-neutral-600 hover:text-blue-800"
        : "cursor-default text-neutral-800",
    )}
    onClick={() => onClick?.()}
  >
    {home ? (
      <HomeIcon className="me-1.5 size-4" />
    ) : (
      <GreaterIcon className="me-1.5 size-4" />
    )}
    {children}
  </li>
);
