// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface AccountSubscriptionRequest {
  'account_address'?: (_libernet_Scalar | null);
  'every_block'?: (boolean);
}

export interface AccountSubscriptionRequest__Output {
  'account_address': (_libernet_Scalar__Output | null);
  'every_block': (boolean);
}
