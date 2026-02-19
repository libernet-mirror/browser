// Original file: proto/libernet_wasm.proto

export const ElementKindType = {
  ELEMENT_KIND_TYPE_EL_PASSIVE: 1,
  ELEMENT_KIND_TYPE_EL_ACTIVE: 2,
  ELEMENT_KIND_TYPE_EL_DECLARED: 3,
} as const;

export type ElementKindType =
  | 'ELEMENT_KIND_TYPE_EL_PASSIVE'
  | 1
  | 'ELEMENT_KIND_TYPE_EL_ACTIVE'
  | 2
  | 'ELEMENT_KIND_TYPE_EL_DECLARED'
  | 3

export type ElementKindType__Output = typeof ElementKindType[keyof typeof ElementKindType]
