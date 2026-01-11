import { clsx } from "clsx";
import { type PropsWithChildren } from "react";

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
  onClick = null,
}: PropsWithChildren & { active?: boolean; onClick?: () => void }) => (
  <li
    className={clsx(
      "inline-flex items-center text-sm font-medium",
      onClick
        ? "cursor-pointer text-neutral-600 hover:text-blue-800"
        : "cursor-default text-neutral-800",
    )}
    onClick={() => onClick?.()}
  >
    {children}
  </li>
);
