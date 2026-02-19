// Original file: proto/libernet_wasm.proto

import type { ExternalKind as _libernet_wasm_ExternalKind, ExternalKind__Output as _libernet_wasm_ExternalKind__Output } from '../../libernet/wasm/ExternalKind';

export interface Export {
  'name'?: (string);
  'kind'?: (_libernet_wasm_ExternalKind);
  'index'?: (number);
}

export interface Export__Output {
  'name'?: (string);
  'kind'?: (_libernet_wasm_ExternalKind__Output);
  'index'?: (number);
}
