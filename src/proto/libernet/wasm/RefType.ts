// Original file: proto/libernet_wasm_types.proto

export const RefType = {
  REF_TYPE_REF_FUNC: 1,
  REF_TYPE_EXTERN_REF: 2,
} as const;

export type RefType =
  | 'REF_TYPE_REF_FUNC'
  | 1
  | 'REF_TYPE_EXTERN_REF'
  | 2

export type RefType__Output = typeof RefType[keyof typeof RefType]
