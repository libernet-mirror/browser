// Original file: proto/libernet.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { Long } from '@grpc/proto-loader';

export interface _libernet_Transaction_CreateProgram {
  'bytecode'?: (Buffer | Uint8Array | string);
}

export interface _libernet_Transaction_CreateProgram__Output {
  'bytecode': (Buffer);
}

export interface _libernet_Transaction_Payload {
  'chain_id'?: (number | string | Long);
  'nonce'?: (number | string | Long);
  'send_coins'?: (_libernet_Transaction_SendCoins | null);
  'create_program'?: (_libernet_Transaction_CreateProgram | null);
  'transaction'?: "send_coins"|"create_program";
}

export interface _libernet_Transaction_Payload__Output {
  'chain_id': (string);
  'nonce': (string);
  'send_coins'?: (_libernet_Transaction_SendCoins__Output | null);
  'create_program'?: (_libernet_Transaction_CreateProgram__Output | null);
  'transaction'?: "send_coins"|"create_program";
}

export interface _libernet_Transaction_SendCoins {
  'recipient'?: (_libernet_Scalar | null);
  'amount'?: (_libernet_Scalar | null);
}

export interface _libernet_Transaction_SendCoins__Output {
  'recipient': (_libernet_Scalar__Output | null);
  'amount': (_libernet_Scalar__Output | null);
}

export interface Transaction {
  'payload'?: (_google_protobuf_Any | null);
  'signature'?: (_libernet_Signature | null);
}

export interface Transaction__Output {
  'payload': (_google_protobuf_Any__Output | null);
  'signature': (_libernet_Signature__Output | null);
}
