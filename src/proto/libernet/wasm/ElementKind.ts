// Original file: proto/libernet_wasm.proto

import type { ElementKindType as _libernet_wasm_ElementKindType, ElementKindType__Output as _libernet_wasm_ElementKindType__Output } from '../../libernet/wasm/ElementKindType';
import type { Expression as _libernet_wasm_Expression, Expression__Output as _libernet_wasm_Expression__Output } from '../../libernet/wasm/Expression';

export interface ElementKind {
  'type'?: (_libernet_wasm_ElementKindType);
  'tableIndex'?: (number);
  'expression'?: (_libernet_wasm_Expression | null);
}

export interface ElementKind__Output {
  'type'?: (_libernet_wasm_ElementKindType__Output);
  'tableIndex'?: (number);
  'expression'?: (_libernet_wasm_Expression__Output);
}
