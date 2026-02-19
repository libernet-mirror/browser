// Original file: proto/libernet_wasm.proto

import type { RefType as _libernet_wasm_RefType, RefType__Output as _libernet_wasm_RefType__Output } from '../../libernet/wasm/RefType';
import type { Long } from '@grpc/proto-loader';

export interface TableType {
  'referenceType'?: (_libernet_wasm_RefType);
  'table64'?: (boolean);
  'initial'?: (number | string | Long);
  'maximum'?: (number | string | Long);
  'shared'?: (boolean);
}

export interface TableType__Output {
  'referenceType'?: (_libernet_wasm_RefType__Output);
  'table64'?: (boolean);
  'initial'?: (Long);
  'maximum'?: (Long);
  'shared'?: (boolean);
}
