// Original file: proto/libernet_wasm.proto

import type { ElementKind as _libernet_wasm_ElementKind, ElementKind__Output as _libernet_wasm_ElementKind__Output } from '../../libernet/wasm/ElementKind';
import type { ElementFunctions as _libernet_wasm_ElementFunctions, ElementFunctions__Output as _libernet_wasm_ElementFunctions__Output } from '../../libernet/wasm/ElementFunctions';
import type { ElementExpressions as _libernet_wasm_ElementExpressions, ElementExpressions__Output as _libernet_wasm_ElementExpressions__Output } from '../../libernet/wasm/ElementExpressions';

export interface Element {
  'kind'?: (_libernet_wasm_ElementKind | null);
  'functions'?: (_libernet_wasm_ElementFunctions | null);
  'expressions'?: (_libernet_wasm_ElementExpressions | null);
  'items'?: "functions"|"expressions";
}

export interface Element__Output {
  'kind'?: (_libernet_wasm_ElementKind__Output);
  'functions'?: (_libernet_wasm_ElementFunctions__Output);
  'expressions'?: (_libernet_wasm_ElementExpressions__Output);
}
