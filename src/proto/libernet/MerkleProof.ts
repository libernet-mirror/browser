// Original file: proto/libernet.proto

import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from '../libernet/BlockDescriptor';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';

export interface _libernet_MerkleProof_Node {
  'child_hashes'?: (_libernet_Scalar)[];
}

export interface _libernet_MerkleProof_Node__Output {
  'child_hashes': (_libernet_Scalar__Output)[];
}

export interface MerkleProof {
  'block_descriptor'?: (_libernet_BlockDescriptor | null);
  'key'?: (_libernet_Scalar | null);
  'value'?: (_google_protobuf_Any | null);
  'path'?: (_libernet_MerkleProof_Node)[];
}

export interface MerkleProof__Output {
  'block_descriptor': (_libernet_BlockDescriptor__Output | null);
  'key': (_libernet_Scalar__Output | null);
  'value': (_google_protobuf_Any__Output | null);
  'path': (_libernet_MerkleProof_Node__Output)[];
}
