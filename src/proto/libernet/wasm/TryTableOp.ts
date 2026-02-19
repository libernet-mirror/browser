// Original file: proto/libernet_wasm_operators.proto

import type { BlockType as _libernet_wasm_BlockType, BlockType__Output as _libernet_wasm_BlockType__Output } from '../../libernet/wasm/BlockType';
import type { CatchElement as _libernet_wasm_CatchElement, CatchElement__Output as _libernet_wasm_CatchElement__Output } from '../../libernet/wasm/CatchElement';

export interface TryTableOp {
  'type'?: (_libernet_wasm_BlockType | null);
  'catches'?: (_libernet_wasm_CatchElement)[];
}

export interface TryTableOp__Output {
  'type'?: (_libernet_wasm_BlockType__Output);
  'catches'?: (_libernet_wasm_CatchElement__Output)[];
}
