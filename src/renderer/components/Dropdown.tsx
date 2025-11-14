import { clsx } from "clsx";

import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface DropdownContextInterface {
  isOpen: boolean;
  setOpen(open: boolean): void;
}

const DropdownContext = createContext<DropdownContextInterface>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setOpen() {},
});

export const Dropdown = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext value={{ isOpen: open, setOpen }}>
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
      onClick={() => setOpen(!isOpen)}
      {...props}
    >
      {children}
    </button>
  );
};

export const DropdownMenu = ({ children }: PropsWithChildren) => {
  const { isOpen } = useContext(DropdownContext);
  if (!isOpen) {
    return null;
  }
  return (
    <div className="absolute top-full right-0 w-sm rounded-lg border border-neutral-200 bg-white p-1 shadow-md">
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
        "rounded-sm hover:bg-neutral-100",
        !disabled && "active:bg-neutral-200",
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
