// Original file: proto/libernet_wasm_operators.proto

import type { Long } from '@grpc/proto-loader';

export interface MemArg {
  'align'?: (number);
  'maxAlign'?: (number);
  'offset'?: (number | string | Long);
  'memory'?: (number);
}

export interface MemArg__Output {
  'align'?: (number);
  'maxAlign'?: (number);
  'offset'?: (Long);
  'memory'?: (number);
}
