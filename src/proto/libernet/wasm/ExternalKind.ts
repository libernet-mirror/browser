// Original file: proto/libernet_wasm.proto

export const ExternalKind = {
  EXTERNAL_KIND_EXT_FUNC: 1,
  EXTERNAL_KIND_EXT_TABLE: 2,
  EXTERNAL_KIND_EXT_MEMORY: 3,
  EXTERNAL_KIND_EXT_GLOBAL: 4,
  EXTERNAL_KIND_EXT_TAG: 5,
  EXTERNAL_KIND_EXT_FUNC_EXACT: 6,
} as const;

export type ExternalKind =
  | 'EXTERNAL_KIND_EXT_FUNC'
  | 1
  | 'EXTERNAL_KIND_EXT_TABLE'
  | 2
  | 'EXTERNAL_KIND_EXT_MEMORY'
  | 3
  | 'EXTERNAL_KIND_EXT_GLOBAL'
  | 4
  | 'EXTERNAL_KIND_EXT_TAG'
  | 5
  | 'EXTERNAL_KIND_EXT_FUNC_EXACT'
  | 6

export type ExternalKind__Output = typeof ExternalKind[keyof typeof ExternalKind]
