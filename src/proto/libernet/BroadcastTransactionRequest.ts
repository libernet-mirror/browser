// Original file: proto/libernet.proto

import type { Transaction as _libernet_Transaction, Transaction__Output as _libernet_Transaction__Output } from '../libernet/Transaction';

export interface BroadcastTransactionRequest {
  'transaction'?: (_libernet_Transaction | null);
  'ttl'?: (number);
}

export interface BroadcastTransactionRequest__Output {
  'transaction': (_libernet_Transaction__Output | null);
  'ttl': (number);
}
