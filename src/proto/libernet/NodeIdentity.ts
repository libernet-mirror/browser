// Original file: proto/libernet.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../google/protobuf/Any';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from '../libernet/Signature';
import type { ProtocolVersion as _libernet_ProtocolVersion, ProtocolVersion__Output as _libernet_ProtocolVersion__Output } from '../libernet/ProtocolVersion';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from '../libernet/Scalar';
import type { GeographicalLocation as _libernet_GeographicalLocation, GeographicalLocation__Output as _libernet_GeographicalLocation__Output } from '../libernet/GeographicalLocation';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface _libernet_NodeIdentity_Payload {
  'protocol_version'?: (_libernet_ProtocolVersion | null);
  'chain_id'?: (number | string | Long);
  'account_address'?: (_libernet_Scalar | null);
  'location'?: (_libernet_GeographicalLocation | null);
  'network_address'?: (string);
  'grpc_port'?: (number);
  'http_port'?: (number);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface _libernet_NodeIdentity_Payload__Output {
  'protocol_version': (_libernet_ProtocolVersion__Output | null);
  'chain_id': (string);
  'account_address': (_libernet_Scalar__Output | null);
  'location': (_libernet_GeographicalLocation__Output | null);
  'network_address': (string);
  'grpc_port': (number);
  'http_port': (number);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}

export interface NodeIdentity {
  'payload'?: (_google_protobuf_Any | null);
  'signature'?: (_libernet_Signature | null);
}

export interface NodeIdentity__Output {
  'payload': (_google_protobuf_Any__Output | null);
  'signature': (_libernet_Signature__Output | null);
}
