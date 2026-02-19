// Original file: proto/libernet_wasm_types.proto

export const PlainType = {
  VALUE_TYPE_I32: 1,
  VALUE_TYPE_I64: 2,
  VALUE_TYPE_F32: 3,
  VALUE_TYPE_F64: 4,
  VALUE_TYPE_V128: 5,
  VALUE_TYPE_REF: 6,
} as const;

export type PlainType =
  | 'VALUE_TYPE_I32'
  | 1
  | 'VALUE_TYPE_I64'
  | 2
  | 'VALUE_TYPE_F32'
  | 3
  | 'VALUE_TYPE_F64'
  | 4
  | 'VALUE_TYPE_V128'
  | 5
  | 'VALUE_TYPE_REF'
  | 6

export type PlainType__Output = typeof PlainType[keyof typeof PlainType]
