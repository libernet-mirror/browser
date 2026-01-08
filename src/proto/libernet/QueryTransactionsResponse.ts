// Original file: proto/libernet.proto

import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from '../libernet/MerkleProof';
import type { MerkleMultiProof as _libernet_MerkleMultiProof, MerkleMultiProof__Output as _libernet_MerkleMultiProof__Output } from '../libernet/MerkleMultiProof';

export interface _libernet_QueryTransactionsResponse_IndividualProofs {
  'individualProof'?: (_libernet_MerkleProof)[];
}

export interface _libernet_QueryTransactionsResponse_IndividualProofs__Output {
  'individualProof'?: (_libernet_MerkleProof__Output)[];
}

export interface _libernet_QueryTransactionsResponse_MultiProofs {
  'multiProofs'?: (_libernet_MerkleMultiProof)[];
}

export interface _libernet_QueryTransactionsResponse_MultiProofs__Output {
  'multiProofs'?: (_libernet_MerkleMultiProof__Output)[];
}

export interface QueryTransactionsResponse {
  'individualProofs'?: (_libernet_QueryTransactionsResponse_IndividualProofs | null);
  'multiProofs'?: (_libernet_QueryTransactionsResponse_MultiProofs | null);
  'transactionProofs'?: "individualProofs"|"multiProofs";
}

export interface QueryTransactionsResponse__Output {
  'individualProofs'?: (_libernet_QueryTransactionsResponse_IndividualProofs__Output);
  'multiProofs'?: (_libernet_QueryTransactionsResponse_MultiProofs__Output);
}
