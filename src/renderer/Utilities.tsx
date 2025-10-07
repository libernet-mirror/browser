import { useEffect } from "react";

export interface LibernetAPI {
  getView(): Promise<"control" | "web" | "system">;
  getUrl(): Promise<string>;
  setUrl(url: string): Promise<void>;
  onUrl(listener: (url: string) => void): () => void;
  startRefresh(): void;
  getWalletStatus(): Promise<"none" | "stored" | "loaded">;
  createWallet(passwords: string[]): Promise<boolean>;
  loadWallet(password: string): Promise<boolean>;
  getAccountByNumber(index: number): Promise<string>;
}

export function libernet(): LibernetAPI {
  return (window as unknown as { libernet: LibernetAPI }).libernet;
}

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
