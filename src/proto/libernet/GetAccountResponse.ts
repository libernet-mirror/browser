// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';

export interface GetAccountResponse {
  'accountProof'?: (_libernet_MerkleProof | null);
}

export interface GetAccountResponse__Output {
  'accountProof'?: (_libernet_MerkleProof__Output);
}
