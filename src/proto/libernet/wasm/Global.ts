// Original file: proto/libernet_wasm.proto

import type { GlobalType as _libernet_wasm_GlobalType, GlobalType__Output as _libernet_wasm_GlobalType__Output } from '../../libernet/wasm/GlobalType';
import type { Expression as _libernet_wasm_Expression, Expression__Output as _libernet_wasm_Expression__Output } from '../../libernet/wasm/Expression';

export interface Global {
  'type'?: (_libernet_wasm_GlobalType | null);
  'initExpr'?: (_libernet_wasm_Expression | null);
}

export interface Global__Output {
  'type'?: (_libernet_wasm_GlobalType__Output);
  'initExpr'?: (_libernet_wasm_Expression__Output);
}
