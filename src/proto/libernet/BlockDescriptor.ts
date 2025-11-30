// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface BlockDescriptor {
  'block_hash'?: (_libernet_Scalar | null);
  'chain_id'?: (number | string | Long);
  'block_number'?: (number | string | Long);
  'previous_block_hash'?: (_libernet_Scalar | null);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'network_topology_root_hash'?: (_libernet_Scalar | null);
  'transactions_root_hash'?: (_libernet_Scalar | null);
  'accounts_root_hash'?: (_libernet_Scalar | null);
  'program_storage_root_hash'?: (_libernet_Scalar | null);
}

export interface BlockDescriptor__Output {
  'block_hash': (_libernet_Scalar__Output | null);
  'chain_id': (string);
  'block_number': (string);
  'previous_block_hash': (_libernet_Scalar__Output | null);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'network_topology_root_hash': (_libernet_Scalar__Output | null);
  'transactions_root_hash': (_libernet_Scalar__Output | null);
  'accounts_root_hash': (_libernet_Scalar__Output | null);
  'program_storage_root_hash': (_libernet_Scalar__Output | null);
}
