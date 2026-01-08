import { useEffect } from "react";

export const MAX_WALLET_PASSWORDS = 10;

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

export function formatLibAmount(balance: bigint): string {
  return `${balance / LIBER_UNIT}.${(balance % LIBER_UNIT).toString().padStart(18, "0")}`;
}

export function parseLibAmount(balance: string): bigint {
  const match = balance.match(/^([0-9]+)(?:\.([0-9]+))?$/);
  if (!match) {
    throw new Error(`invalid LIB balance format: ${JSON.stringify(balance)}`);
  }
  const [units, fraction] = [match[1], match[2]].map((digits) =>
    (digits || "")
      .split("")
      .map((digit) => digit.charCodeAt(0) - 48)
      .reduce((a, b) => a * 10n + BigInt(b), 0n),
  );
  return units * LIBER_UNIT + fraction;
}

export function bigIntToScalar(value: bigint): string {
  return "0x" + value.toString(16).toLowerCase().padStart(64, "0");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
