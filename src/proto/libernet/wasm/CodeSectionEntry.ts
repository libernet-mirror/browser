// Original file: proto/libernet_wasm.proto

import type { Locals as _libernet_wasm_Locals, Locals__Output as _libernet_wasm_Locals__Output } from '../../libernet/wasm/Locals';
import type { Operator as _libernet_wasm_Operator, Operator__Output as _libernet_wasm_Operator__Output } from '../../libernet/wasm/Operator';

export interface CodeSectionEntry {
  'locals'?: (_libernet_wasm_Locals)[];
  'body'?: (_libernet_wasm_Operator)[];
}

export interface CodeSectionEntry__Output {
  'locals'?: (_libernet_wasm_Locals__Output)[];
  'body'?: (_libernet_wasm_Operator__Output)[];
}
