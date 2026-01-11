import { clsx } from "clsx";

import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { BackdropContext } from "./Backdrop";

interface DropdownManager {
  isOpen(): boolean;
  setOpen(open: boolean): void;
}

const DropdownContext = createContext<DropdownManager>({
  isOpen: () => false,
  setOpen: () => void 0,
});

export const Dropdown = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const [open, setOpen] = useState(false);
  const backdrop = useContext(BackdropContext);
  return (
    <DropdownContext
      value={{
        isOpen: () => open,
        setOpen(open: boolean) {
          if (open) {
            backdrop.activate(() => setOpen(false));
            setOpen(true);
          } else {
            backdrop.deactivate();
          }
        },
      }}
    >
      <div className="relative overflow-visible" {...props}>
        {children}
      </div>
    </DropdownContext>
  );
};

export const DropdownButton = ({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button">) => {
  const { isOpen, setOpen } = useContext(DropdownContext);
  return (
    <button
      className={clsx(
        "h-8 w-10 rounded-md bg-transparent px-2 py-1 outline-none hover:bg-neutral-100 active:bg-neutral-200",
        className,
      )}
      onClick={() => setOpen(!isOpen())}
      {...props}
    >
      {children}
    </button>
  );
};

export const DropdownMenu = ({ children }: PropsWithChildren) => {
  const { isOpen } = useContext(DropdownContext);
  if (!isOpen()) {
    return null;
  }
  return (
    <div className="absolute top-full right-0 z-1000 w-sm rounded-lg border border-neutral-200 bg-white p-1 shadow-md">
      <ol>{children}</ol>
    </div>
  );
};

export const DropdownItem = ({
  disabled = false,
  children,
  onClick,
}: PropsWithChildren & { disabled?: boolean; onClick: () => void }) => {
  const { setOpen } = useContext(DropdownContext);
  return (
    <li
      className={clsx(
        disabled ? "cursor-default" : "cursor-pointer",
        "px-2 py-1",
        disabled && "text-neutral-400",
        "rounded-sm",
        !disabled && "hover:bg-neutral-100 active:bg-neutral-200",
      )}
      onClick={() => {
        if (!disabled) {
          setOpen(false);
          onClick();
        }
      }}
    >
      {children}
    </li>
  );
};
