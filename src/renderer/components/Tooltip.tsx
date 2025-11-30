import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, type PropsWithChildren } from "react";

export const TooltipContainer = ({ children }: PropsWithChildren) => (
  <span className="relative">{children}</span>
);

export const Tooltip = ({
  children,
  show,
}: ComponentPropsWithoutRef<"span"> & { show: boolean }) => (
  <span
    className={clsx(
      { invisible: !show },
      "absolute bottom-[100%] left-[50%] z-1000 mb-1.5 inline-block -translate-x-[50%] rounded-sm bg-black px-2 py-1 text-sm text-white shadow-xs",
    )}
  >
    {children}
  </span>
);
