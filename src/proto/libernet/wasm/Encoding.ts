// Original file: proto/libernet_wasm.proto

export const Encoding = {
  ENCODING_MODULE: 1,
} as const;

export type Encoding =
  | 'ENCODING_MODULE'
  | 1

export type Encoding__Output = typeof Encoding[keyof typeof Encoding]
