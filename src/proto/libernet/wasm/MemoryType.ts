// Original file: proto/libernet_wasm.proto

import type { Long } from '@grpc/proto-loader';

export interface MemoryType {
  'memory64'?: (boolean);
  'shared'?: (boolean);
  'initial'?: (number | string | Long);
  'maximum'?: (number | string | Long);
  'pageSizeLog2'?: (number);
}

export interface MemoryType__Output {
  'memory64'?: (boolean);
  'shared'?: (boolean);
  'initial'?: (Long);
  'maximum'?: (Long);
  'pageSizeLog2'?: (number);
}
