// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Long } from '@grpc/proto-loader';

export interface AccountInfo {
  'last_nonce'?: (number | string | Long);
  'balance'?: (_libernet_Scalar | null);
  'staking_balance'?: (_libernet_Scalar | null);
}

export interface AccountInfo__Output {
  'last_nonce': (string);
  'balance': (_libernet_Scalar__Output | null);
  'staking_balance': (_libernet_Scalar__Output | null);
}
