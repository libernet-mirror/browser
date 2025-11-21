// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';

export interface GetAccountResponse {
  'account_proof'?: (_libernet_MerkleProof | null);
}

export interface GetAccountResponse__Output {
  'account_proof': (_libernet_MerkleProof__Output | null);
}
