// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Long } from '@grpc/proto-loader';

export interface AccountInfo {
  'lastNonce'?: (number | string | Long);
  'balance'?: (_libernet_Scalar | null);
  'stakingBalance'?: (_libernet_Scalar | null);
}

export interface AccountInfo__Output {
  'lastNonce'?: (Long);
  'balance'?: (_libernet_Scalar__Output);
  'stakingBalance'?: (_libernet_Scalar__Output);
}
