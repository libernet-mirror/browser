// Original file: proto/libernet_wasm_operators.proto

import type { ValueType as _libernet_wasm_ValueType, ValueType__Output as _libernet_wasm_ValueType__Output } from '../../libernet/wasm/ValueType';

export interface BlockType {
  'empty'?: (number);
  'valueType'?: (_libernet_wasm_ValueType | null);
  'functionType'?: (number);
  'blockType'?: "empty"|"valueType"|"functionType";
}

export interface BlockType__Output {
  'empty'?: (number);
  'valueType'?: (_libernet_wasm_ValueType__Output);
  'functionType'?: (number);
}
