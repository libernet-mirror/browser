// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';

export interface GetTransactionResponse {
  'transaction_proof'?: (_libernet_MerkleProof | null);
}

export interface GetTransactionResponse__Output {
  'transaction_proof': (_libernet_MerkleProof__Output | null);
}
