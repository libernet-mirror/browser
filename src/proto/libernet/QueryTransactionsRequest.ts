// Original file: proto/libernet.proto

import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/libernet.proto

export const _libernet_QueryTransactionsRequest_SortOrder = {
  TRANSACTION_SORT_ORDER_DESCENDING: 0,
  TRANSACTION_SORT_ORDER_ASCENDING: 1,
} as const;

export type _libernet_QueryTransactionsRequest_SortOrder =
  | 'TRANSACTION_SORT_ORDER_DESCENDING'
  | 0
  | 'TRANSACTION_SORT_ORDER_ASCENDING'
  | 1

export type _libernet_QueryTransactionsRequest_SortOrder__Output = typeof _libernet_QueryTransactionsRequest_SortOrder[keyof typeof _libernet_QueryTransactionsRequest_SortOrder]

export interface QueryTransactionsRequest {
  'fromFilter'?: (_libernet_Scalar | null);
  'toFilter'?: (_libernet_Scalar | null);
  'startBlockHash'?: (_libernet_Scalar | null);
  'startBlockNumber'?: (number | string | Long);
  'endBlockHash'?: (_libernet_Scalar | null);
  'endBlockNumber'?: (number | string | Long);
  'sortOrder'?: (_libernet_QueryTransactionsRequest_SortOrder);
  'maxCount'?: (number);
  'startBlockFilter'?: "startBlockHash"|"startBlockNumber";
  'endBlockFilter'?: "endBlockHash"|"endBlockNumber";
}

export interface QueryTransactionsRequest__Output {
  'fromFilter'?: (_libernet_Scalar__Output);
  'toFilter'?: (_libernet_Scalar__Output);
  'startBlockHash'?: (_libernet_Scalar__Output);
  'startBlockNumber'?: (Long);
  'endBlockHash'?: (_libernet_Scalar__Output);
  'endBlockNumber'?: (Long);
  'sortOrder'?: (_libernet_QueryTransactionsRequest_SortOrder__Output);
  'maxCount'?: (number);
}
