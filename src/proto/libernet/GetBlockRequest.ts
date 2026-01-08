// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface GetBlockRequest {
  'blockHash'?: (_libernet_Scalar | null);
  'getAllTransactionHashes'?: (boolean);
}

export interface GetBlockRequest__Output {
  'blockHash'?: (_libernet_Scalar__Output);
  'getAllTransactionHashes'?: (boolean);
}
