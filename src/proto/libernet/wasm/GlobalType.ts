// Original file: proto/libernet_wasm.proto

import type { ValueType as _libernet_wasm_ValueType, ValueType__Output as _libernet_wasm_ValueType__Output } from '../../libernet/wasm/ValueType';

export interface GlobalType {
  'contentType'?: (_libernet_wasm_ValueType | null);
  'mutable'?: (boolean);
  'shared'?: (boolean);
}

export interface GlobalType__Output {
  'contentType'?: (_libernet_wasm_ValueType__Output);
  'mutable'?: (boolean);
  'shared'?: (boolean);
}
