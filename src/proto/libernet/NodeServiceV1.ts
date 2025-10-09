// Original file: proto/libernet.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BroadcastBlockRequest as _libernet_BroadcastBlockRequest, BroadcastBlockRequest__Output as _libernet_BroadcastBlockRequest__Output } from '../libernet/BroadcastBlockRequest';
import type { BroadcastBlockResponse as _libernet_BroadcastBlockResponse, BroadcastBlockResponse__Output as _libernet_BroadcastBlockResponse__Output } from '../libernet/BroadcastBlockResponse';
import type { BroadcastTransactionRequest as _libernet_BroadcastTransactionRequest, BroadcastTransactionRequest__Output as _libernet_BroadcastTransactionRequest__Output } from '../libernet/BroadcastTransactionRequest';
import type { BroadcastTransactionResponse as _libernet_BroadcastTransactionResponse, BroadcastTransactionResponse__Output as _libernet_BroadcastTransactionResponse__Output } from '../libernet/BroadcastTransactionResponse';
import type { GetAccountRequest as _libernet_GetAccountRequest, GetAccountRequest__Output as _libernet_GetAccountRequest__Output } from '../libernet/GetAccountRequest';
import type { GetAccountResponse as _libernet_GetAccountResponse, GetAccountResponse__Output as _libernet_GetAccountResponse__Output } from '../libernet/GetAccountResponse';
import type { GetBlockRequest as _libernet_GetBlockRequest, GetBlockRequest__Output as _libernet_GetBlockRequest__Output } from '../libernet/GetBlockRequest';
import type { GetBlockResponse as _libernet_GetBlockResponse, GetBlockResponse__Output as _libernet_GetBlockResponse__Output } from '../libernet/GetBlockResponse';
import type { GetIdentityRequest as _libernet_GetIdentityRequest, GetIdentityRequest__Output as _libernet_GetIdentityRequest__Output } from '../libernet/GetIdentityRequest';
import type { GetTopologyRequest as _libernet_GetTopologyRequest, GetTopologyRequest__Output as _libernet_GetTopologyRequest__Output } from '../libernet/GetTopologyRequest';
import type { GetTransactionRequest as _libernet_GetTransactionRequest, GetTransactionRequest__Output as _libernet_GetTransactionRequest__Output } from '../libernet/GetTransactionRequest';
import type { GetTransactionResponse as _libernet_GetTransactionResponse, GetTransactionResponse__Output as _libernet_GetTransactionResponse__Output } from '../libernet/GetTransactionResponse';
import type { NetworkTopology as _libernet_NetworkTopology, NetworkTopology__Output as _libernet_NetworkTopology__Output } from '../libernet/NetworkTopology';
import type { NodeIdentity as _libernet_NodeIdentity, NodeIdentity__Output as _libernet_NodeIdentity__Output } from '../libernet/NodeIdentity';

export interface NodeServiceV1Client extends grpc.Client {
  BroadcastNewBlock(argument: _libernet_BroadcastBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  BroadcastNewBlock(argument: _libernet_BroadcastBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  BroadcastNewBlock(argument: _libernet_BroadcastBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  BroadcastNewBlock(argument: _libernet_BroadcastBlockRequest, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  broadcastNewBlock(argument: _libernet_BroadcastBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  broadcastNewBlock(argument: _libernet_BroadcastBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  broadcastNewBlock(argument: _libernet_BroadcastBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  broadcastNewBlock(argument: _libernet_BroadcastBlockRequest, callback: grpc.requestCallback<_libernet_BroadcastBlockResponse__Output>): grpc.ClientUnaryCall;
  
  BroadcastTransaction(argument: _libernet_BroadcastTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  BroadcastTransaction(argument: _libernet_BroadcastTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  BroadcastTransaction(argument: _libernet_BroadcastTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  BroadcastTransaction(argument: _libernet_BroadcastTransactionRequest, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  broadcastTransaction(argument: _libernet_BroadcastTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  broadcastTransaction(argument: _libernet_BroadcastTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  broadcastTransaction(argument: _libernet_BroadcastTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  broadcastTransaction(argument: _libernet_BroadcastTransactionRequest, callback: grpc.requestCallback<_libernet_BroadcastTransactionResponse__Output>): grpc.ClientUnaryCall;
  
  GetAccount(argument: _libernet_GetAccountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  GetAccount(argument: _libernet_GetAccountRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  GetAccount(argument: _libernet_GetAccountRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  GetAccount(argument: _libernet_GetAccountRequest, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  getAccount(argument: _libernet_GetAccountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  getAccount(argument: _libernet_GetAccountRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  getAccount(argument: _libernet_GetAccountRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  getAccount(argument: _libernet_GetAccountRequest, callback: grpc.requestCallback<_libernet_GetAccountResponse__Output>): grpc.ClientUnaryCall;
  
  GetBlock(argument: _libernet_GetBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  GetBlock(argument: _libernet_GetBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  GetBlock(argument: _libernet_GetBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  GetBlock(argument: _libernet_GetBlockRequest, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  getBlock(argument: _libernet_GetBlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  getBlock(argument: _libernet_GetBlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  getBlock(argument: _libernet_GetBlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  getBlock(argument: _libernet_GetBlockRequest, callback: grpc.requestCallback<_libernet_GetBlockResponse__Output>): grpc.ClientUnaryCall;
  
  GetIdentity(argument: _libernet_GetIdentityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  GetIdentity(argument: _libernet_GetIdentityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  GetIdentity(argument: _libernet_GetIdentityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  GetIdentity(argument: _libernet_GetIdentityRequest, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  getIdentity(argument: _libernet_GetIdentityRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  getIdentity(argument: _libernet_GetIdentityRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  getIdentity(argument: _libernet_GetIdentityRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  getIdentity(argument: _libernet_GetIdentityRequest, callback: grpc.requestCallback<_libernet_NodeIdentity__Output>): grpc.ClientUnaryCall;
  
  GetTopology(argument: _libernet_GetTopologyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  GetTopology(argument: _libernet_GetTopologyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  GetTopology(argument: _libernet_GetTopologyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  GetTopology(argument: _libernet_GetTopologyRequest, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  getTopology(argument: _libernet_GetTopologyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  getTopology(argument: _libernet_GetTopologyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  getTopology(argument: _libernet_GetTopologyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  getTopology(argument: _libernet_GetTopologyRequest, callback: grpc.requestCallback<_libernet_NetworkTopology__Output>): grpc.ClientUnaryCall;
  
  GetTransaction(argument: _libernet_GetTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  GetTransaction(argument: _libernet_GetTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  GetTransaction(argument: _libernet_GetTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  GetTransaction(argument: _libernet_GetTransactionRequest, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  getTransaction(argument: _libernet_GetTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  getTransaction(argument: _libernet_GetTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  getTransaction(argument: _libernet_GetTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  getTransaction(argument: _libernet_GetTransactionRequest, callback: grpc.requestCallback<_libernet_GetTransactionResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface NodeServiceV1Handlers extends grpc.UntypedServiceImplementation {
  BroadcastNewBlock: grpc.handleUnaryCall<_libernet_BroadcastBlockRequest__Output, _libernet_BroadcastBlockResponse>;
  
  BroadcastTransaction: grpc.handleUnaryCall<_libernet_BroadcastTransactionRequest__Output, _libernet_BroadcastTransactionResponse>;
  
  GetAccount: grpc.handleUnaryCall<_libernet_GetAccountRequest__Output, _libernet_GetAccountResponse>;
  
  GetBlock: grpc.handleUnaryCall<_libernet_GetBlockRequest__Output, _libernet_GetBlockResponse>;
  
  GetIdentity: grpc.handleUnaryCall<_libernet_GetIdentityRequest__Output, _libernet_NodeIdentity>;
  
  GetTopology: grpc.handleUnaryCall<_libernet_GetTopologyRequest__Output, _libernet_NetworkTopology>;
  
  GetTransaction: grpc.handleUnaryCall<_libernet_GetTransactionRequest__Output, _libernet_GetTransactionResponse>;
  
}

export interface NodeServiceV1Definition extends grpc.ServiceDefinition {
  BroadcastNewBlock: MethodDefinition<_libernet_BroadcastBlockRequest, _libernet_BroadcastBlockResponse, _libernet_BroadcastBlockRequest__Output, _libernet_BroadcastBlockResponse__Output>
  BroadcastTransaction: MethodDefinition<_libernet_BroadcastTransactionRequest, _libernet_BroadcastTransactionResponse, _libernet_BroadcastTransactionRequest__Output, _libernet_BroadcastTransactionResponse__Output>
  GetAccount: MethodDefinition<_libernet_GetAccountRequest, _libernet_GetAccountResponse, _libernet_GetAccountRequest__Output, _libernet_GetAccountResponse__Output>
  GetBlock: MethodDefinition<_libernet_GetBlockRequest, _libernet_GetBlockResponse, _libernet_GetBlockRequest__Output, _libernet_GetBlockResponse__Output>
  GetIdentity: MethodDefinition<_libernet_GetIdentityRequest, _libernet_NodeIdentity, _libernet_GetIdentityRequest__Output, _libernet_NodeIdentity__Output>
  GetTopology: MethodDefinition<_libernet_GetTopologyRequest, _libernet_NetworkTopology, _libernet_GetTopologyRequest__Output, _libernet_NetworkTopology__Output>
  GetTransaction: MethodDefinition<_libernet_GetTransactionRequest, _libernet_GetTransactionResponse, _libernet_GetTransactionRequest__Output, _libernet_GetTransactionResponse__Output>
}
