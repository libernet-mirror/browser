// Original file: proto/libernet_wasm.proto

import type { RefType as _libernet_wasm_RefType, RefType__Output as _libernet_wasm_RefType__Output } from '../../libernet/wasm/RefType';
import type { Expression as _libernet_wasm_Expression, Expression__Output as _libernet_wasm_Expression__Output } from '../../libernet/wasm/Expression';

export interface ElementExpressions {
  'referenceType'?: (_libernet_wasm_RefType);
  'expressions'?: (_libernet_wasm_Expression)[];
}

export interface ElementExpressions__Output {
  'referenceType'?: (_libernet_wasm_RefType__Output);
  'expressions'?: (_libernet_wasm_Expression__Output)[];
}
