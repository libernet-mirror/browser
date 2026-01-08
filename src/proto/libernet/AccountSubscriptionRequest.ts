// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface AccountSubscriptionRequest {
  'accountAddress'?: (_libernet_Scalar | null);
  'everyBlock'?: (boolean);
}

export interface AccountSubscriptionRequest__Output {
  'accountAddress'?: (_libernet_Scalar__Output);
  'everyBlock'?: (boolean);
}
