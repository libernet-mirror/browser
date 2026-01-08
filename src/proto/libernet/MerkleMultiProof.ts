// Original file: proto/libernet.proto

import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from '../libernet/BlockDescriptor';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';

export interface _libernet_MerkleMultiProof_Node_Child {
  'hash'?: (_libernet_Scalar | null);
  'nodeIndex'?: (number);
  'leafIndex'?: (number);
  'child'?: "hash"|"nodeIndex"|"leafIndex";
}

export interface _libernet_MerkleMultiProof_Node_Child__Output {
  'hash'?: (_libernet_Scalar__Output);
  'nodeIndex'?: (number);
  'leafIndex'?: (number);
}

export interface _libernet_MerkleMultiProof_Node {
  'hash'?: (_libernet_Scalar | null);
  'child'?: (_libernet_MerkleMultiProof_Node_Child)[];
}

export interface _libernet_MerkleMultiProof_Node__Output {
  'hash'?: (_libernet_Scalar__Output);
  'child'?: (_libernet_MerkleMultiProof_Node_Child__Output)[];
}

export interface MerkleMultiProof {
  'blockDescriptor'?: (_libernet_BlockDescriptor | null);
  'node'?: (_libernet_MerkleMultiProof_Node)[];
  'value'?: (_google_protobuf_Any)[];
}

export interface MerkleMultiProof__Output {
  'blockDescriptor'?: (_libernet_BlockDescriptor__Output);
  'node'?: (_libernet_MerkleMultiProof_Node__Output)[];
  'value'?: (_google_protobuf_Any__Output)[];
}
