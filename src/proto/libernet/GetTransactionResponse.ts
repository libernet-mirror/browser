// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';

export interface GetTransactionResponse {
  'transactionProof'?: (_libernet_MerkleProof | null);
}

export interface GetTransactionResponse__Output {
  'transactionProof'?: (_libernet_MerkleProof__Output);
}
