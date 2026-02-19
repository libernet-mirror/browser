// Original file: proto/libernet_wasm.proto

export const TagKind = {
  TAG_KIND_EXCEPTION: 1,
} as const;

export type TagKind =
  | 'TAG_KIND_EXCEPTION'
  | 1

export type TagKind__Output = typeof TagKind[keyof typeof TagKind]
