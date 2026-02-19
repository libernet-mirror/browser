// Original file: proto/libernet_wasm_operators.proto

import type { CatchOne as _libernet_wasm_CatchOne, CatchOne__Output as _libernet_wasm_CatchOne__Output } from '../../libernet/wasm/CatchOne';
import type { CatchOneRef as _libernet_wasm_CatchOneRef, CatchOneRef__Output as _libernet_wasm_CatchOneRef__Output } from '../../libernet/wasm/CatchOneRef';
import type { CatchAllElements as _libernet_wasm_CatchAllElements, CatchAllElements__Output as _libernet_wasm_CatchAllElements__Output } from '../../libernet/wasm/CatchAllElements';
import type { CatchAllRef as _libernet_wasm_CatchAllRef, CatchAllRef__Output as _libernet_wasm_CatchAllRef__Output } from '../../libernet/wasm/CatchAllRef';

export interface CatchElement {
  'one'?: (_libernet_wasm_CatchOne | null);
  'oneRef'?: (_libernet_wasm_CatchOneRef | null);
  'all'?: (_libernet_wasm_CatchAllElements | null);
  'allRef'?: (_libernet_wasm_CatchAllRef | null);
  'catchElement'?: "one"|"oneRef"|"all"|"allRef";
}

export interface CatchElement__Output {
  'one'?: (_libernet_wasm_CatchOne__Output);
  'oneRef'?: (_libernet_wasm_CatchOneRef__Output);
  'all'?: (_libernet_wasm_CatchAllElements__Output);
  'allRef'?: (_libernet_wasm_CatchAllRef__Output);
}
