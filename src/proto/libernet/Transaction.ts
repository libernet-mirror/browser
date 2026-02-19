// Original file: proto/libernet.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { ProgramModule as _libernet_wasm_ProgramModule, ProgramModule__Output as _libernet_wasm_ProgramModule__Output } from '../libernet/wasm/ProgramModule';
import type { Long } from '@grpc/proto-loader';

export interface _libernet_Transaction_BlockReward {
  'recipient'?: (_libernet_Scalar | null);
  'amount'?: (_libernet_Scalar | null);
}

export interface _libernet_Transaction_BlockReward__Output {
  'recipient'?: (_libernet_Scalar__Output);
  'amount'?: (_libernet_Scalar__Output);
}

export interface _libernet_Transaction_CreateProgram {
  'programModule'?: (_libernet_wasm_ProgramModule | null);
}

export interface _libernet_Transaction_CreateProgram__Output {
  'programModule'?: (_libernet_wasm_ProgramModule__Output);
}

export interface _libernet_Transaction_Payload {
  'chainId'?: (number | string | Long);
  'nonce'?: (number | string | Long);
  'blockReward'?: (_libernet_Transaction_BlockReward | null);
  'sendCoins'?: (_libernet_Transaction_SendCoins | null);
  'createProgram'?: (_libernet_Transaction_CreateProgram | null);
  'transaction'?: "blockReward"|"sendCoins"|"createProgram";
}

export interface _libernet_Transaction_Payload__Output {
  'chainId'?: (Long);
  'nonce'?: (Long);
  'blockReward'?: (_libernet_Transaction_BlockReward__Output);
  'sendCoins'?: (_libernet_Transaction_SendCoins__Output);
  'createProgram'?: (_libernet_Transaction_CreateProgram__Output);
}

export interface _libernet_Transaction_SendCoins {
  'recipient'?: (_libernet_Scalar | null);
  'amount'?: (_libernet_Scalar | null);
}

export interface _libernet_Transaction_SendCoins__Output {
  'recipient'?: (_libernet_Scalar__Output);
  'amount'?: (_libernet_Scalar__Output);
}

export interface Transaction {
  'payload'?: (_google_protobuf_Any | null);
  'signature'?: (_libernet_Signature | null);
}

export interface Transaction__Output {
  'payload'?: (_google_protobuf_Any__Output);
  'signature'?: (_libernet_Signature__Output);
}
