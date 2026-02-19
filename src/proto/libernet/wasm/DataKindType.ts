// Original file: proto/libernet_wasm.proto

export const DataKindType = {
  DATA_KIND_TYPE_PASSIVE: 1,
  DATA_KIND_TYPE_ACTIVE: 2,
} as const;

export type DataKindType =
  | 'DATA_KIND_TYPE_PASSIVE'
  | 1
  | 'DATA_KIND_TYPE_ACTIVE'
  | 2

export type DataKindType__Output = typeof DataKindType[keyof typeof DataKindType]
