// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';
import type { MerkleMultiProof as _libernet_MerkleMultiProof, MerkleMultiProof__Output as _libernet_MerkleMultiProof__Output } from '../libernet/MerkleMultiProof';

export interface _libernet_QueryTransactionsResponse_IndividualProofs {
  'individual_proof'?: (_libernet_MerkleProof)[];
}

export interface _libernet_QueryTransactionsResponse_IndividualProofs__Output {
  'individual_proof': (_libernet_MerkleProof__Output)[];
}

export interface _libernet_QueryTransactionsResponse_MultiProofs {
  'multi_proofs'?: (_libernet_MerkleMultiProof)[];
}

export interface _libernet_QueryTransactionsResponse_MultiProofs__Output {
  'multi_proofs': (_libernet_MerkleMultiProof__Output)[];
}

export interface QueryTransactionsResponse {
  'individual_proofs'?: (_libernet_QueryTransactionsResponse_IndividualProofs | null);
  'multi_proofs'?: (_libernet_QueryTransactionsResponse_MultiProofs | null);
  'transaction_proofs'?: "individual_proofs"|"multi_proofs";
}

export interface QueryTransactionsResponse__Output {
  'individual_proofs'?: (_libernet_QueryTransactionsResponse_IndividualProofs__Output | null);
  'multi_proofs'?: (_libernet_QueryTransactionsResponse_MultiProofs__Output | null);
  'transaction_proofs'?: "individual_proofs"|"multi_proofs";
}
