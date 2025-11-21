// Original file: proto/libernet.proto

import type { BoundTransaction as _libernet_BoundTransaction, BoundTransaction__Output as _libernet_BoundTransaction__Output } from '../libernet/BoundTransaction';

export interface GetTransactionResponse {
  'transaction'?: (_libernet_BoundTransaction | null);
}

export interface GetTransactionResponse__Output {
  'transaction': (_libernet_BoundTransaction__Output | null);
}
