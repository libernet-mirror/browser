// Original file: proto/libernet_wasm.proto

import type { FuncType as _libernet_wasm_FuncType, FuncType__Output as _libernet_wasm_FuncType__Output } from '../../libernet/wasm/FuncType';

export interface SubType {
  'func'?: (_libernet_wasm_FuncType | null);
  'kind'?: "func";
}

export interface SubType__Output {
  'func'?: (_libernet_wasm_FuncType__Output);
}
