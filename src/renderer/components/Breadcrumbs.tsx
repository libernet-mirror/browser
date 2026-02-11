import { clsx } from "clsx";
import { type PropsWithChildren } from "react";

import { GreaterThanIcon, HomeIcon } from "./Icons";

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
  active = false,
  onClick = null,
}: PropsWithChildren & {
  home?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => (
  <li
    className={clsx(
      "inline-flex items-center text-sm font-medium",
      active ? "text-neutral-800" : "text-neutral-600",
      onClick ? "cursor-pointer hover:text-blue-800" : "cursor-default",
    )}
    onClick={() => onClick?.()}
  >
    {home ? (
      <HomeIcon className="me-1.5 size-4" />
    ) : (
      <GreaterThanIcon className="me-1.5 size-4" />
    )}
    {children}
  </li>
);
