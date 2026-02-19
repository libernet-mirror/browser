// Original file: proto/libernet_wasm_operators.proto

import type { OpCode as _libernet_wasm_OpCode, OpCode__Output as _libernet_wasm_OpCode__Output } from '../../libernet/wasm/OpCode';
import type { BlockType as _libernet_wasm_BlockType, BlockType__Output as _libernet_wasm_BlockType__Output } from '../../libernet/wasm/BlockType';
import type { BreakTargets as _libernet_wasm_BreakTargets, BreakTargets__Output as _libernet_wasm_BreakTargets__Output } from '../../libernet/wasm/BreakTargets';
import type { CallIndirectOp as _libernet_wasm_CallIndirectOp, CallIndirectOp__Output as _libernet_wasm_CallIndirectOp__Output } from '../../libernet/wasm/CallIndirectOp';
import type { MemArg as _libernet_wasm_MemArg, MemArg__Output as _libernet_wasm_MemArg__Output } from '../../libernet/wasm/MemArg';
import type { MemoryInitOp as _libernet_wasm_MemoryInitOp, MemoryInitOp__Output as _libernet_wasm_MemoryInitOp__Output } from '../../libernet/wasm/MemoryInitOp';
import type { MemoryCopyOp as _libernet_wasm_MemoryCopyOp, MemoryCopyOp__Output as _libernet_wasm_MemoryCopyOp__Output } from '../../libernet/wasm/MemoryCopyOp';
import type { TableInitOp as _libernet_wasm_TableInitOp, TableInitOp__Output as _libernet_wasm_TableInitOp__Output } from '../../libernet/wasm/TableInitOp';
import type { TableCopyOp as _libernet_wasm_TableCopyOp, TableCopyOp__Output as _libernet_wasm_TableCopyOp__Output } from '../../libernet/wasm/TableCopyOp';
import type { TryTableOp as _libernet_wasm_TryTableOp, TryTableOp__Output as _libernet_wasm_TryTableOp__Output } from '../../libernet/wasm/TryTableOp';
import type { ThrowOp as _libernet_wasm_ThrowOp, ThrowOp__Output as _libernet_wasm_ThrowOp__Output } from '../../libernet/wasm/ThrowOp';
import type { Long } from '@grpc/proto-loader';

export interface Operator {
  'opcode'?: (_libernet_wasm_OpCode);
  'blockType'?: (_libernet_wasm_BlockType | null);
  'relativeDepth'?: (number);
  'targets'?: (_libernet_wasm_BreakTargets | null);
  'functionIndex'?: (number);
  'callIndirect'?: (_libernet_wasm_CallIndirectOp | null);
  'localIndex'?: (number);
  'globalIndex'?: (number);
  'memarg'?: (_libernet_wasm_MemArg | null);
  'mem'?: (number);
  'i32Value'?: (number);
  'i64Value'?: (number | string | Long);
  'f32Value'?: (number);
  'f64Value'?: (number | string | Long);
  'memoryInit'?: (_libernet_wasm_MemoryInitOp | null);
  'dataIndex'?: (number);
  'memoryCopy'?: (_libernet_wasm_MemoryCopyOp | null);
  'tableInit'?: (_libernet_wasm_TableInitOp | null);
  'elementIndex'?: (number);
  'tableCopy'?: (_libernet_wasm_TableCopyOp | null);
  'tryTable'?: (_libernet_wasm_TryTableOp | null);
  'throwOp'?: (_libernet_wasm_ThrowOp | null);
  'tagIndex'?: (number);
  'operator'?: "blockType"|"relativeDepth"|"targets"|"functionIndex"|"callIndirect"|"localIndex"|"globalIndex"|"memarg"|"mem"|"i32Value"|"i64Value"|"f32Value"|"f64Value"|"memoryInit"|"dataIndex"|"memoryCopy"|"tableInit"|"elementIndex"|"tableCopy"|"tryTable"|"throwOp"|"tagIndex";
}

export interface Operator__Output {
  'opcode'?: (_libernet_wasm_OpCode__Output);
  'blockType'?: (_libernet_wasm_BlockType__Output);
  'relativeDepth'?: (number);
  'targets'?: (_libernet_wasm_BreakTargets__Output);
  'functionIndex'?: (number);
  'callIndirect'?: (_libernet_wasm_CallIndirectOp__Output);
  'localIndex'?: (number);
  'globalIndex'?: (number);
  'memarg'?: (_libernet_wasm_MemArg__Output);
  'mem'?: (number);
  'i32Value'?: (number);
  'i64Value'?: (Long);
  'f32Value'?: (number);
  'f64Value'?: (Long);
  'memoryInit'?: (_libernet_wasm_MemoryInitOp__Output);
  'dataIndex'?: (number);
  'memoryCopy'?: (_libernet_wasm_MemoryCopyOp__Output);
  'tableInit'?: (_libernet_wasm_TableInitOp__Output);
  'elementIndex'?: (number);
  'tableCopy'?: (_libernet_wasm_TableCopyOp__Output);
  'tryTable'?: (_libernet_wasm_TryTableOp__Output);
  'throwOp'?: (_libernet_wasm_ThrowOp__Output);
  'tagIndex'?: (number);
}
