// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { PointG1 as _libernet_PointG1, PointG1__Output as _libernet_PointG1__Output } from '../libernet/PointG1';
import type { PointG2 as _libernet_PointG2, PointG2__Output as _libernet_PointG2__Output } from '../libernet/PointG2';

export interface Signature {
  'signer'?: (_libernet_Scalar | null);
  'publicKey'?: (_libernet_PointG1 | null);
  'signature'?: (_libernet_PointG2 | null);
}

export interface Signature__Output {
  'signer'?: (_libernet_Scalar__Output);
  'publicKey'?: (_libernet_PointG1__Output);
  'signature'?: (_libernet_PointG2__Output);
}
