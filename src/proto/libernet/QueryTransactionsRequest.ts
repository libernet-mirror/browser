// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/libernet.proto

export const _libernet_QueryTransactionsRequest_SortOrder = {
  TRANSACTION_SORT_ORDER_DESCENDING: 'TRANSACTION_SORT_ORDER_DESCENDING',
  TRANSACTION_SORT_ORDER_ASCENDING: 'TRANSACTION_SORT_ORDER_ASCENDING',
} as const;

export type _libernet_QueryTransactionsRequest_SortOrder =
  | 'TRANSACTION_SORT_ORDER_DESCENDING'
  | 0
  | 'TRANSACTION_SORT_ORDER_ASCENDING'
  | 1

export type _libernet_QueryTransactionsRequest_SortOrder__Output = typeof _libernet_QueryTransactionsRequest_SortOrder[keyof typeof _libernet_QueryTransactionsRequest_SortOrder]

export interface QueryTransactionsRequest {
  'from_filter'?: (_libernet_Scalar | null);
  'to_filter'?: (_libernet_Scalar | null);
  'start_block_hash'?: (_libernet_Scalar | null);
  'start_block_number'?: (number | string | Long);
  'end_block_hash'?: (_libernet_Scalar | null);
  'end_block_number'?: (number | string | Long);
  'sort_order'?: (_libernet_QueryTransactionsRequest_SortOrder);
  'max_count'?: (number);
  'start_block_filter'?: "start_block_hash"|"start_block_number";
  'end_block_filter'?: "end_block_hash"|"end_block_number";
}

export interface QueryTransactionsRequest__Output {
  'from_filter': (_libernet_Scalar__Output | null);
  'to_filter': (_libernet_Scalar__Output | null);
  'start_block_hash'?: (_libernet_Scalar__Output | null);
  'start_block_number'?: (string);
  'end_block_hash'?: (_libernet_Scalar__Output | null);
  'end_block_number'?: (string);
  'sort_order': (_libernet_QueryTransactionsRequest_SortOrder__Output);
  'max_count': (number);
  'start_block_filter'?: "start_block_hash"|"start_block_number";
  'end_block_filter'?: "end_block_hash"|"end_block_number";
}
