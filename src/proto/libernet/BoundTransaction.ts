// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Transaction as _libernet_Transaction, Transaction__Output as _libernet_Transaction__Output } from '../libernet/Transaction';

export interface BoundTransaction {
  'parent_transaction_hash'?: (_libernet_Scalar | null);
  'transaction'?: (_libernet_Transaction | null);
}

export interface BoundTransaction__Output {
  'parent_transaction_hash': (_libernet_Scalar__Output | null);
  'transaction': (_libernet_Transaction__Output | null);
}
