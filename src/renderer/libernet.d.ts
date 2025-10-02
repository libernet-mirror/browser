interface LibernetAPI {
  deriveAccount: (password: string, index: number) => Promise<string>;
}

interface Window {
  libernet: LibernetAPI;
}
