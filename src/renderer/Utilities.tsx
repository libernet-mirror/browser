import { useEffect } from "react";

export const MAX_WALLET_PASSWORDS = 15;

export const LIBER_UNIT = 1_000_000_000_000_000_000n;

export type EffectDestructor = () => void;

export function useAsyncEffect(
  callback: () => Promise<EffectDestructor | void>,
  dependencies?: unknown[],
): void {
  useEffect(() => {
    let destructor: EffectDestructor | null = null;
    let destroy = false;
    callback()
      .then((result) => {
        if (result) {
          if (destroy) {
            result();
          } else {
            destructor = result;
          }
        } else {
          destructor = null;
          destroy = false;
        }
      })
      .catch((error) => {
        destructor = null;
        destroy = false;
        console.error(error);
      });
    return () => {
      if (destructor) {
        destructor();
      } else {
        destroy = true;
      }
    };
  }, dependencies);
}

export function formatBalance(balance: bigint): string {
  return `${balance / LIBER_UNIT}.${(balance % LIBER_UNIT).toString().padStart(18, "0")}`;
}
