import { clsx } from "clsx";
import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface BackdropManager {
  isActive(): boolean;
  activate(onDeactivate: () => void): void;
  deactivate(): void;
}

export const BackdropContext = createContext<BackdropManager>({
  isActive: () => false,
  activate: () => void 0,
  deactivate: () => void 0,
});

export const BackdropProvider = ({ children }: PropsWithChildren) => {
  const [onDeactivate, setOnDeactivate] = useState<(() => void) | null>(null);
  return (
    <BackdropContext.Provider
      value={{
        isActive: () => !!onDeactivate,
        activate: (onDeactivate) => setOnDeactivate(() => onDeactivate),
        deactivate: () => {
          if (onDeactivate) {
            onDeactivate();
            setOnDeactivate(null);
          }
        },
      }}
    >
      {children}
    </BackdropContext.Provider>
  );
};

export const Backdrop = ({
  children,
  className,
}: ComponentPropsWithoutRef<"div">) => {
  const { isActive, deactivate } = useContext(BackdropContext);
  return (
    <div className={clsx("relative", className)}>
      {children}
      {isActive() && (
        <div
          className="absolute top-0 right-0 bottom-0 left-0 h-full w-full bg-neutral-500 opacity-50"
          onClick={deactivate}
        />
      )}
    </div>
  );
};
