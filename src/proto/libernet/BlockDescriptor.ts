// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface BlockDescriptor {
  'blockHash'?: (_libernet_Scalar | null);
  'chainId'?: (number | string | Long);
  'blockNumber'?: (number | string | Long);
  'previousBlockHash'?: (_libernet_Scalar | null);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'networkTopologyRootHash'?: (_libernet_Scalar | null);
  'transactionsRootHash'?: (_libernet_Scalar | null);
  'accountsRootHash'?: (_libernet_Scalar | null);
  'programStorageRootHash'?: (_libernet_Scalar | null);
}

export interface BlockDescriptor__Output {
  'blockHash'?: (_libernet_Scalar__Output);
  'chainId'?: (Long);
  'blockNumber'?: (Long);
  'previousBlockHash'?: (_libernet_Scalar__Output);
  'timestamp'?: (_google_protobuf_Timestamp__Output);
  'networkTopologyRootHash'?: (_libernet_Scalar__Output);
  'transactionsRootHash'?: (_libernet_Scalar__Output);
  'accountsRootHash'?: (_libernet_Scalar__Output);
  'programStorageRootHash'?: (_libernet_Scalar__Output);
}
