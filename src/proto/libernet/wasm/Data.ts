// Original file: proto/libernet_wasm.proto

import type { DataKind as _libernet_wasm_DataKind, DataKind__Output as _libernet_wasm_DataKind__Output } from '../../libernet/wasm/DataKind';

export interface Data {
  'kind'?: (_libernet_wasm_DataKind | null);
  'data'?: (Buffer | Uint8Array | string);
}

export interface Data__Output {
  'kind'?: (_libernet_wasm_DataKind__Output);
  'data'?: (Buffer);
}
