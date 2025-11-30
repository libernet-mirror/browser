import { clsx } from "clsx";
import { type ComponentPropsWithoutRef } from "react";

export const Table = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"table">) => (
  <div
    className={clsx(
      "overflow-hidden rounded-md border border-neutral-300",
      className,
    )}
  >
    <table className="w-full text-left text-sm rtl:text-right" {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"thead">) => (
  <thead className={clsx("bg-neutral-100 text-sm", className)} {...props}>
    <tr>{children}</tr>
  </thead>
);

export const TableHeaderCell = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"th">) => (
  <th className={clsx("px-6 py-3 font-medium", className)} {...props}>
    {children}
  </th>
);

export const TableBody = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"tbody">) => <tbody {...props}>{children}</tbody>;

export const TableRow = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={clsx(
      "border-t border-neutral-300 bg-white hover:bg-neutral-100",
      className,
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TableCell = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"td">) => (
  <td className={clsx("px-6 py-4", className)} {...props}>
    {children}
  </td>
);
