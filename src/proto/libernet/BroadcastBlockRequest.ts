// Original file: proto/libernet.proto

import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from '../libernet/BlockDescriptor';
import type { Transaction as _libernet_Transaction, Transaction__Output as _libernet_Transaction__Output } from '../libernet/Transaction';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';
import type { Long } from '@grpc/proto-loader';

export interface _libernet_BroadcastBlockRequest_LeaderElectionProof {
  'chainId'?: (number | string | Long);
  'slotNumber'?: (number | string | Long);
  'previousBlockHash'?: (_libernet_Scalar | null);
  'verifiableRandomness'?: (_libernet_Signature | null);
}

export interface _libernet_BroadcastBlockRequest_LeaderElectionProof__Output {
  'chainId'?: (Long);
  'slotNumber'?: (Long);
  'previousBlockHash'?: (_libernet_Scalar__Output);
  'verifiableRandomness'?: (_libernet_Signature__Output);
}

export interface BroadcastBlockRequest {
  'leaderElectionProof'?: (_libernet_BroadcastBlockRequest_LeaderElectionProof | null);
  'blockDescriptor'?: (_libernet_BlockDescriptor | null);
  'transaction'?: (_libernet_Transaction)[];
  'ttl'?: (number);
}

export interface BroadcastBlockRequest__Output {
  'leaderElectionProof'?: (_libernet_BroadcastBlockRequest_LeaderElectionProof__Output);
  'blockDescriptor'?: (_libernet_BlockDescriptor__Output);
  'transaction'?: (_libernet_Transaction__Output)[];
  'ttl'?: (number);
}
