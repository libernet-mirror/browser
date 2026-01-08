// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface GetAccountRequest {
  'blockHash'?: (_libernet_Scalar | null);
  'accountAddress'?: (_libernet_Scalar | null);
}

export interface GetAccountRequest__Output {
  'blockHash'?: (_libernet_Scalar__Output);
  'accountAddress'?: (_libernet_Scalar__Output);
}
