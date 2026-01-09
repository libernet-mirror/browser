import { clsx } from "clsx";
import { type PropsWithChildren } from "react";

export const Breadcrumbs = ({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) => (
  <nav className={clsx("flex", className)}>
    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      {children}
    </ol>
  </nav>
);

export const BreadcrumbItem = ({
  children,
  onClick = null,
}: PropsWithChildren & { active?: boolean; onClick?: () => void }) => (
  <li className="inline-flex items-center">
    <span
      className={clsx(
        "inline-flex items-center text-sm font-medium",
        onClick
          ? "cursor-pointer text-neutral-400 hover:text-blue-600"
          : "cursor-default text-neutral-600",
      )}
      onClick={() => onClick?.()}
    >
      {children}
    </span>
  </li>
);
