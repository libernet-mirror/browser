import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BlockType as _libernet_wasm_BlockType, BlockType__Output as _libernet_wasm_BlockType__Output } from './libernet/wasm/BlockType';
import type { BreakTargets as _libernet_wasm_BreakTargets, BreakTargets__Output as _libernet_wasm_BreakTargets__Output } from './libernet/wasm/BreakTargets';
import type { CallIndirectOp as _libernet_wasm_CallIndirectOp, CallIndirectOp__Output as _libernet_wasm_CallIndirectOp__Output } from './libernet/wasm/CallIndirectOp';
import type { CatchAllElements as _libernet_wasm_CatchAllElements, CatchAllElements__Output as _libernet_wasm_CatchAllElements__Output } from './libernet/wasm/CatchAllElements';
import type { CatchAllRef as _libernet_wasm_CatchAllRef, CatchAllRef__Output as _libernet_wasm_CatchAllRef__Output } from './libernet/wasm/CatchAllRef';
import type { CatchElement as _libernet_wasm_CatchElement, CatchElement__Output as _libernet_wasm_CatchElement__Output } from './libernet/wasm/CatchElement';
import type { CatchOne as _libernet_wasm_CatchOne, CatchOne__Output as _libernet_wasm_CatchOne__Output } from './libernet/wasm/CatchOne';
import type { CatchOneRef as _libernet_wasm_CatchOneRef, CatchOneRef__Output as _libernet_wasm_CatchOneRef__Output } from './libernet/wasm/CatchOneRef';
import type { MemArg as _libernet_wasm_MemArg, MemArg__Output as _libernet_wasm_MemArg__Output } from './libernet/wasm/MemArg';
import type { MemoryCopyOp as _libernet_wasm_MemoryCopyOp, MemoryCopyOp__Output as _libernet_wasm_MemoryCopyOp__Output } from './libernet/wasm/MemoryCopyOp';
import type { MemoryInitOp as _libernet_wasm_MemoryInitOp, MemoryInitOp__Output as _libernet_wasm_MemoryInitOp__Output } from './libernet/wasm/MemoryInitOp';
import type { Operator as _libernet_wasm_Operator, Operator__Output as _libernet_wasm_Operator__Output } from './libernet/wasm/Operator';
import type { TableCopyOp as _libernet_wasm_TableCopyOp, TableCopyOp__Output as _libernet_wasm_TableCopyOp__Output } from './libernet/wasm/TableCopyOp';
import type { TableInitOp as _libernet_wasm_TableInitOp, TableInitOp__Output as _libernet_wasm_TableInitOp__Output } from './libernet/wasm/TableInitOp';
import type { ThrowOp as _libernet_wasm_ThrowOp, ThrowOp__Output as _libernet_wasm_ThrowOp__Output } from './libernet/wasm/ThrowOp';
import type { TryTableOp as _libernet_wasm_TryTableOp, TryTableOp__Output as _libernet_wasm_TryTableOp__Output } from './libernet/wasm/TryTableOp';
import type { ValueType as _libernet_wasm_ValueType, ValueType__Output as _libernet_wasm_ValueType__Output } from './libernet/wasm/ValueType';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  libernet: {
    wasm: {
      BlockType: MessageTypeDefinition<_libernet_wasm_BlockType, _libernet_wasm_BlockType__Output>
      BreakTargets: MessageTypeDefinition<_libernet_wasm_BreakTargets, _libernet_wasm_BreakTargets__Output>
      CallIndirectOp: MessageTypeDefinition<_libernet_wasm_CallIndirectOp, _libernet_wasm_CallIndirectOp__Output>
      CatchAllElements: MessageTypeDefinition<_libernet_wasm_CatchAllElements, _libernet_wasm_CatchAllElements__Output>
      CatchAllRef: MessageTypeDefinition<_libernet_wasm_CatchAllRef, _libernet_wasm_CatchAllRef__Output>
      CatchElement: MessageTypeDefinition<_libernet_wasm_CatchElement, _libernet_wasm_CatchElement__Output>
      CatchOne: MessageTypeDefinition<_libernet_wasm_CatchOne, _libernet_wasm_CatchOne__Output>
      CatchOneRef: MessageTypeDefinition<_libernet_wasm_CatchOneRef, _libernet_wasm_CatchOneRef__Output>
      MemArg: MessageTypeDefinition<_libernet_wasm_MemArg, _libernet_wasm_MemArg__Output>
      MemoryCopyOp: MessageTypeDefinition<_libernet_wasm_MemoryCopyOp, _libernet_wasm_MemoryCopyOp__Output>
      MemoryInitOp: MessageTypeDefinition<_libernet_wasm_MemoryInitOp, _libernet_wasm_MemoryInitOp__Output>
      OpCode: EnumTypeDefinition
      Operator: MessageTypeDefinition<_libernet_wasm_Operator, _libernet_wasm_Operator__Output>
      PlainType: EnumTypeDefinition
      RefType: EnumTypeDefinition
      TableCopyOp: MessageTypeDefinition<_libernet_wasm_TableCopyOp, _libernet_wasm_TableCopyOp__Output>
      TableInitOp: MessageTypeDefinition<_libernet_wasm_TableInitOp, _libernet_wasm_TableInitOp__Output>
      ThrowOp: MessageTypeDefinition<_libernet_wasm_ThrowOp, _libernet_wasm_ThrowOp__Output>
      TryTableOp: MessageTypeDefinition<_libernet_wasm_TryTableOp, _libernet_wasm_TryTableOp__Output>
      ValueType: MessageTypeDefinition<_libernet_wasm_ValueType, _libernet_wasm_ValueType__Output>
    }
  }
}

