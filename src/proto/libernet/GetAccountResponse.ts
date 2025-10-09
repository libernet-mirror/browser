// Original file: proto/libernet.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';

export interface GetAccountResponse {
  'payload'?: (_google_protobuf_Any | null);
  'signature'?: (_libernet_Signature | null);
}

export interface GetAccountResponse__Output {
  'payload': (_google_protobuf_Any__Output | null);
  'signature': (_libernet_Signature__Output | null);
}
