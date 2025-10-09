import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { AccountInfo as _libernet_AccountInfo, AccountInfo__Output as _libernet_AccountInfo__Output } from './libernet/AccountInfo';
import type { BlockDescriptor as _libernet_BlockDescriptor, BlockDescriptor__Output as _libernet_BlockDescriptor__Output } from './libernet/BlockDescriptor';
import type { BoundTransaction as _libernet_BoundTransaction, BoundTransaction__Output as _libernet_BoundTransaction__Output } from './libernet/BoundTransaction';
import type { BroadcastBlockRequest as _libernet_BroadcastBlockRequest, BroadcastBlockRequest__Output as _libernet_BroadcastBlockRequest__Output } from './libernet/BroadcastBlockRequest';
import type { BroadcastBlockResponse as _libernet_BroadcastBlockResponse, BroadcastBlockResponse__Output as _libernet_BroadcastBlockResponse__Output } from './libernet/BroadcastBlockResponse';
import type { BroadcastTransactionRequest as _libernet_BroadcastTransactionRequest, BroadcastTransactionRequest__Output as _libernet_BroadcastTransactionRequest__Output } from './libernet/BroadcastTransactionRequest';
import type { BroadcastTransactionResponse as _libernet_BroadcastTransactionResponse, BroadcastTransactionResponse__Output as _libernet_BroadcastTransactionResponse__Output } from './libernet/BroadcastTransactionResponse';
import type { GeographicalLocation as _libernet_GeographicalLocation, GeographicalLocation__Output as _libernet_GeographicalLocation__Output } from './libernet/GeographicalLocation';
import type { GetAccountRequest as _libernet_GetAccountRequest, GetAccountRequest__Output as _libernet_GetAccountRequest__Output } from './libernet/GetAccountRequest';
import type { GetAccountResponse as _libernet_GetAccountResponse, GetAccountResponse__Output as _libernet_GetAccountResponse__Output } from './libernet/GetAccountResponse';
import type { GetBlockRequest as _libernet_GetBlockRequest, GetBlockRequest__Output as _libernet_GetBlockRequest__Output } from './libernet/GetBlockRequest';
import type { GetBlockResponse as _libernet_GetBlockResponse, GetBlockResponse__Output as _libernet_GetBlockResponse__Output } from './libernet/GetBlockResponse';
import type { GetIdentityRequest as _libernet_GetIdentityRequest, GetIdentityRequest__Output as _libernet_GetIdentityRequest__Output } from './libernet/GetIdentityRequest';
import type { GetTopologyRequest as _libernet_GetTopologyRequest, GetTopologyRequest__Output as _libernet_GetTopologyRequest__Output } from './libernet/GetTopologyRequest';
import type { GetTransactionRequest as _libernet_GetTransactionRequest, GetTransactionRequest__Output as _libernet_GetTransactionRequest__Output } from './libernet/GetTransactionRequest';
import type { GetTransactionResponse as _libernet_GetTransactionResponse, GetTransactionResponse__Output as _libernet_GetTransactionResponse__Output } from './libernet/GetTransactionResponse';
import type { MerkleProof as _libernet_MerkleProof, MerkleProof__Output as _libernet_MerkleProof__Output } from './libernet/MerkleProof';
import type { NetworkTopology as _libernet_NetworkTopology, NetworkTopology__Output as _libernet_NetworkTopology__Output } from './libernet/NetworkTopology';
import type { NodeIdentity as _libernet_NodeIdentity, NodeIdentity__Output as _libernet_NodeIdentity__Output } from './libernet/NodeIdentity';
import type { NodeServiceV1Client as _libernet_NodeServiceV1Client, NodeServiceV1Definition as _libernet_NodeServiceV1Definition } from './libernet/NodeServiceV1';
import type { PointG1 as _libernet_PointG1, PointG1__Output as _libernet_PointG1__Output } from './libernet/PointG1';
import type { PointG2 as _libernet_PointG2, PointG2__Output as _libernet_PointG2__Output } from './libernet/PointG2';
import type { ProtocolVersion as _libernet_ProtocolVersion, ProtocolVersion__Output as _libernet_ProtocolVersion__Output } from './libernet/ProtocolVersion';
import type { Scalar as _libernet_Scalar, Scalar__Output as _libernet_Scalar__Output } from './libernet/Scalar';
import type { Signature as _libernet_Signature, Signature__Output as _libernet_Signature__Output } from './libernet/Signature';
import type { Transaction as _libernet_Transaction, Transaction__Output as _libernet_Transaction__Output } from './libernet/Transaction';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Any: MessageTypeDefinition<_google_protobuf_Any, _google_protobuf_Any__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
  libernet: {
    AccountInfo: MessageTypeDefinition<_libernet_AccountInfo, _libernet_AccountInfo__Output>
    BlockDescriptor: MessageTypeDefinition<_libernet_BlockDescriptor, _libernet_BlockDescriptor__Output>
    BoundTransaction: MessageTypeDefinition<_libernet_BoundTransaction, _libernet_BoundTransaction__Output>
    BroadcastBlockRequest: MessageTypeDefinition<_libernet_BroadcastBlockRequest, _libernet_BroadcastBlockRequest__Output>
    BroadcastBlockResponse: MessageTypeDefinition<_libernet_BroadcastBlockResponse, _libernet_BroadcastBlockResponse__Output>
    BroadcastTransactionRequest: MessageTypeDefinition<_libernet_BroadcastTransactionRequest, _libernet_BroadcastTransactionRequest__Output>
    BroadcastTransactionResponse: MessageTypeDefinition<_libernet_BroadcastTransactionResponse, _libernet_BroadcastTransactionResponse__Output>
    GeographicalLocation: MessageTypeDefinition<_libernet_GeographicalLocation, _libernet_GeographicalLocation__Output>
    GetAccountRequest: MessageTypeDefinition<_libernet_GetAccountRequest, _libernet_GetAccountRequest__Output>
    GetAccountResponse: MessageTypeDefinition<_libernet_GetAccountResponse, _libernet_GetAccountResponse__Output>
    GetBlockRequest: MessageTypeDefinition<_libernet_GetBlockRequest, _libernet_GetBlockRequest__Output>
    GetBlockResponse: MessageTypeDefinition<_libernet_GetBlockResponse, _libernet_GetBlockResponse__Output>
    GetIdentityRequest: MessageTypeDefinition<_libernet_GetIdentityRequest, _libernet_GetIdentityRequest__Output>
    GetTopologyRequest: MessageTypeDefinition<_libernet_GetTopologyRequest, _libernet_GetTopologyRequest__Output>
    GetTransactionRequest: MessageTypeDefinition<_libernet_GetTransactionRequest, _libernet_GetTransactionRequest__Output>
    GetTransactionResponse: MessageTypeDefinition<_libernet_GetTransactionResponse, _libernet_GetTransactionResponse__Output>
    MerkleProof: MessageTypeDefinition<_libernet_MerkleProof, _libernet_MerkleProof__Output>
    NetworkTopology: MessageTypeDefinition<_libernet_NetworkTopology, _libernet_NetworkTopology__Output>
    NodeIdentity: MessageTypeDefinition<_libernet_NodeIdentity, _libernet_NodeIdentity__Output>
    NodeServiceV1: SubtypeConstructor<typeof grpc.Client, _libernet_NodeServiceV1Client> & { service: _libernet_NodeServiceV1Definition }
    PointG1: MessageTypeDefinition<_libernet_PointG1, _libernet_PointG1__Output>
    PointG2: MessageTypeDefinition<_libernet_PointG2, _libernet_PointG2__Output>
    ProtocolVersion: MessageTypeDefinition<_libernet_ProtocolVersion, _libernet_ProtocolVersion__Output>
    Scalar: MessageTypeDefinition<_libernet_Scalar, _libernet_Scalar__Output>
    Signature: MessageTypeDefinition<_libernet_Signature, _libernet_Signature__Output>
    Transaction: MessageTypeDefinition<_libernet_Transaction, _libernet_Transaction__Output>
  }
}

