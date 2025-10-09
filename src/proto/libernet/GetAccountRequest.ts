// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface GetAccountRequest {
  'block_hash'?: (_libernet_Scalar | null);
  'account_address'?: (_libernet_Scalar | null);
}

export interface GetAccountRequest__Output {
  'block_hash': (_libernet_Scalar__Output | null);
  'account_address': (_libernet_Scalar__Output | null);
}
