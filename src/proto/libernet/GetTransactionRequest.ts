// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface GetTransactionRequest {
  'transaction_hash'?: (_libernet_Scalar | null);
}

export interface GetTransactionRequest__Output {
  'transaction_hash': (_libernet_Scalar__Output | null);
}
