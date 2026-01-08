import { clsx } from "clsx";

import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const TooltipContext = createContext(false);

export const TooltipContainer = ({
  children,
  absolute = false,
  className = "",
}: PropsWithChildren & { absolute?: boolean; className?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <TooltipContext value={show}>
      <span
        className={clsx(absolute ? "absolute" : "relative", className)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
    </TooltipContext>
  );
};

export const Tooltip = ({
  children,
  className = "",
  anchor = "middle",
}: ComponentPropsWithoutRef<"span"> & {
  className?: string;
  show: boolean;
  anchor?: "left" | "middle" | "right";
}) => {
  const show = useContext(TooltipContext);
  return (
    <span
      className={clsx(
        { invisible: !show },
        "absolute bottom-full z-1000 mb-1.5 inline-block rounded-sm bg-black px-2 py-1 text-sm text-white shadow-xs",
        {
          left: "left-0",
          middle: "left-1/2 -translate-x-1/2",
          right: "right-0",
        }[anchor || "middle"],
        className,
      )}
    >
      {children}
    </span>
  );
};
