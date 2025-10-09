// Original file: proto/libernet.proto

import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from '../libernet/BlockDescriptor';
import type { Transaction as _libernet_Transaction, Transaction__Output as _libernet_Transaction__Output } from '../libernet/Transaction';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';
import type { Long } from '@grpc/proto-loader';

export interface _libernet_BroadcastBlockRequest_LeaderElectionProof {
  'chain_id'?: (number | string | Long);
  'slot_number'?: (number | string | Long);
  'previous_block_hash'?: (_libernet_Scalar | null);
  'verifiable_randomness'?: (_libernet_Signature | null);
}

export interface _libernet_BroadcastBlockRequest_LeaderElectionProof__Output {
  'chain_id': (string);
  'slot_number': (string);
  'previous_block_hash': (_libernet_Scalar__Output | null);
  'verifiable_randomness': (_libernet_Signature__Output | null);
}

export interface BroadcastBlockRequest {
  'leader_election_proof'?: (_libernet_BroadcastBlockRequest_LeaderElectionProof | null);
  'block_descriptor'?: (_libernet_BlockDescriptor | null);
  'transaction'?: (_libernet_Transaction)[];
  'ttl'?: (number);
}

export interface BroadcastBlockRequest__Output {
  'leader_election_proof': (_libernet_BroadcastBlockRequest_LeaderElectionProof__Output | null);
  'block_descriptor': (_libernet_BlockDescriptor__Output | null);
  'transaction': (_libernet_Transaction__Output)[];
  'ttl': (number);
}
