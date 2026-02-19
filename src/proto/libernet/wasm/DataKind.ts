// Original file: proto/libernet_wasm.proto

import type { DataKindType as _libernet_wasm_DataKindType, DataKindType__Output as _libernet_wasm_DataKindType__Output } from '../../libernet/wasm/DataKindType';
import type { Expression as _libernet_wasm_Expression, Expression__Output as _libernet_wasm_Expression__Output } from '../../libernet/wasm/Expression';

export interface DataKind {
  'type'?: (_libernet_wasm_DataKindType);
  'memoryIndex'?: (number);
  'expression'?: (_libernet_wasm_Expression | null);
}

export interface DataKind__Output {
  'type'?: (_libernet_wasm_DataKindType__Output);
  'memoryIndex'?: (number);
  'expression'?: (_libernet_wasm_Expression__Output);
}
