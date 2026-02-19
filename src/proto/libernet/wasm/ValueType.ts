// Original file: proto/libernet_wasm_types.proto

import type { PlainType as _libernet_wasm_PlainType, PlainType__Output as _libernet_wasm_PlainType__Output } from '../../libernet/wasm/PlainType';
import type { RefType as _libernet_wasm_RefType, RefType__Output as _libernet_wasm_RefType__Output } from '../../libernet/wasm/RefType';

export interface ValueType {
  'valueType'?: (_libernet_wasm_PlainType);
  'referenceType'?: (_libernet_wasm_RefType);
}

export interface ValueType__Output {
  'valueType'?: (_libernet_wasm_PlainType__Output);
  'referenceType'?: (_libernet_wasm_RefType__Output);
}
