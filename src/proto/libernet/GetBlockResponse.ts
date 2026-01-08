// Original file: proto/libernet.proto

import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from '../libernet/BlockDescriptor';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface GetBlockResponse {
  'blockDescriptor'?: (_libernet_BlockDescriptor | null);
  'transactionHash'?: (_libernet_Scalar)[];
}

export interface GetBlockResponse__Output {
  'blockDescriptor'?: (_libernet_BlockDescriptor__Output);
  'transactionHash'?: (_libernet_Scalar__Output)[];
}
