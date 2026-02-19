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
import type { CodeSection as _libernet_wasm_CodeSection, CodeSection__Output as _libernet_wasm_CodeSection__Output } from './libernet/wasm/CodeSection';
import type { CodeSectionEntry as _libernet_wasm_CodeSectionEntry, CodeSectionEntry__Output as _libernet_wasm_CodeSectionEntry__Output } from './libernet/wasm/CodeSectionEntry';
import type { Data as _libernet_wasm_Data, Data__Output as _libernet_wasm_Data__Output } from './libernet/wasm/Data';
import type { DataKind as _libernet_wasm_DataKind, DataKind__Output as _libernet_wasm_DataKind__Output } from './libernet/wasm/DataKind';
import type { DataSection as _libernet_wasm_DataSection, DataSection__Output as _libernet_wasm_DataSection__Output } from './libernet/wasm/DataSection';
import type { Element as _libernet_wasm_Element, Element__Output as _libernet_wasm_Element__Output } from './libernet/wasm/Element';
import type { ElementExpressions as _libernet_wasm_ElementExpressions, ElementExpressions__Output as _libernet_wasm_ElementExpressions__Output } from './libernet/wasm/ElementExpressions';
import type { ElementFunctions as _libernet_wasm_ElementFunctions, ElementFunctions__Output as _libernet_wasm_ElementFunctions__Output } from './libernet/wasm/ElementFunctions';
import type { ElementKind as _libernet_wasm_ElementKind, ElementKind__Output as _libernet_wasm_ElementKind__Output } from './libernet/wasm/ElementKind';
import type { ElementSection as _libernet_wasm_ElementSection, ElementSection__Output as _libernet_wasm_ElementSection__Output } from './libernet/wasm/ElementSection';
import type { Export as _libernet_wasm_Export, Export__Output as _libernet_wasm_Export__Output } from './libernet/wasm/Export';
import type { ExportSection as _libernet_wasm_ExportSection, ExportSection__Output as _libernet_wasm_ExportSection__Output } from './libernet/wasm/ExportSection';
import type { Expression as _libernet_wasm_Expression, Expression__Output as _libernet_wasm_Expression__Output } from './libernet/wasm/Expression';
import type { FuncType as _libernet_wasm_FuncType, FuncType__Output as _libernet_wasm_FuncType__Output } from './libernet/wasm/FuncType';
import type { FunctionSection as _libernet_wasm_FunctionSection, FunctionSection__Output as _libernet_wasm_FunctionSection__Output } from './libernet/wasm/FunctionSection';
import type { Global as _libernet_wasm_Global, Global__Output as _libernet_wasm_Global__Output } from './libernet/wasm/Global';
import type { GlobalSection as _libernet_wasm_GlobalSection, GlobalSection__Output as _libernet_wasm_GlobalSection__Output } from './libernet/wasm/GlobalSection';
import type { GlobalType as _libernet_wasm_GlobalType, GlobalType__Output as _libernet_wasm_GlobalType__Output } from './libernet/wasm/GlobalType';
import type { ImportSection as _libernet_wasm_ImportSection, ImportSection__Output as _libernet_wasm_ImportSection__Output } from './libernet/wasm/ImportSection';
import type { Locals as _libernet_wasm_Locals, Locals__Output as _libernet_wasm_Locals__Output } from './libernet/wasm/Locals';
import type { MemArg as _libernet_wasm_MemArg, MemArg__Output as _libernet_wasm_MemArg__Output } from './libernet/wasm/MemArg';
import type { MemoryCopyOp as _libernet_wasm_MemoryCopyOp, MemoryCopyOp__Output as _libernet_wasm_MemoryCopyOp__Output } from './libernet/wasm/MemoryCopyOp';
import type { MemoryInitOp as _libernet_wasm_MemoryInitOp, MemoryInitOp__Output as _libernet_wasm_MemoryInitOp__Output } from './libernet/wasm/MemoryInitOp';
import type { MemorySection as _libernet_wasm_MemorySection, MemorySection__Output as _libernet_wasm_MemorySection__Output } from './libernet/wasm/MemorySection';
import type { MemoryType as _libernet_wasm_MemoryType, MemoryType__Output as _libernet_wasm_MemoryType__Output } from './libernet/wasm/MemoryType';
import type { Operator as _libernet_wasm_Operator, Operator__Output as _libernet_wasm_Operator__Output } from './libernet/wasm/Operator';
import type { ProgramModule as _libernet_wasm_ProgramModule, ProgramModule__Output as _libernet_wasm_ProgramModule__Output } from './libernet/wasm/ProgramModule';
import type { SubType as _libernet_wasm_SubType, SubType__Output as _libernet_wasm_SubType__Output } from './libernet/wasm/SubType';
import type { TableCopyOp as _libernet_wasm_TableCopyOp, TableCopyOp__Output as _libernet_wasm_TableCopyOp__Output } from './libernet/wasm/TableCopyOp';
import type { TableInitOp as _libernet_wasm_TableInitOp, TableInitOp__Output as _libernet_wasm_TableInitOp__Output } from './libernet/wasm/TableInitOp';
import type { TableSection as _libernet_wasm_TableSection, TableSection__Output as _libernet_wasm_TableSection__Output } from './libernet/wasm/TableSection';
import type { TableType as _libernet_wasm_TableType, TableType__Output as _libernet_wasm_TableType__Output } from './libernet/wasm/TableType';
import type { TagSection as _libernet_wasm_TagSection, TagSection__Output as _libernet_wasm_TagSection__Output } from './libernet/wasm/TagSection';
import type { TagType as _libernet_wasm_TagType, TagType__Output as _libernet_wasm_TagType__Output } from './libernet/wasm/TagType';
import type { ThrowOp as _libernet_wasm_ThrowOp, ThrowOp__Output as _libernet_wasm_ThrowOp__Output } from './libernet/wasm/ThrowOp';
import type { TryTableOp as _libernet_wasm_TryTableOp, TryTableOp__Output as _libernet_wasm_TryTableOp__Output } from './libernet/wasm/TryTableOp';
import type { TypeRefFunc as _libernet_wasm_TypeRefFunc, TypeRefFunc__Output as _libernet_wasm_TypeRefFunc__Output } from './libernet/wasm/TypeRefFunc';
import type { TypeSection as _libernet_wasm_TypeSection, TypeSection__Output as _libernet_wasm_TypeSection__Output } from './libernet/wasm/TypeSection';
import type { ValueType as _libernet_wasm_ValueType, ValueType__Output as _libernet_wasm_ValueType__Output } from './libernet/wasm/ValueType';
import type { Version as _libernet_wasm_Version, Version__Output as _libernet_wasm_Version__Output } from './libernet/wasm/Version';

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
      CodeSection: MessageTypeDefinition<_libernet_wasm_CodeSection, _libernet_wasm_CodeSection__Output>
      CodeSectionEntry: MessageTypeDefinition<_libernet_wasm_CodeSectionEntry, _libernet_wasm_CodeSectionEntry__Output>
      Data: MessageTypeDefinition<_libernet_wasm_Data, _libernet_wasm_Data__Output>
      DataKind: MessageTypeDefinition<_libernet_wasm_DataKind, _libernet_wasm_DataKind__Output>
      DataKindType: EnumTypeDefinition
      DataSection: MessageTypeDefinition<_libernet_wasm_DataSection, _libernet_wasm_DataSection__Output>
      Element: MessageTypeDefinition<_libernet_wasm_Element, _libernet_wasm_Element__Output>
      ElementExpressions: MessageTypeDefinition<_libernet_wasm_ElementExpressions, _libernet_wasm_ElementExpressions__Output>
      ElementFunctions: MessageTypeDefinition<_libernet_wasm_ElementFunctions, _libernet_wasm_ElementFunctions__Output>
      ElementKind: MessageTypeDefinition<_libernet_wasm_ElementKind, _libernet_wasm_ElementKind__Output>
      ElementKindType: EnumTypeDefinition
      ElementSection: MessageTypeDefinition<_libernet_wasm_ElementSection, _libernet_wasm_ElementSection__Output>
      Encoding: EnumTypeDefinition
      Export: MessageTypeDefinition<_libernet_wasm_Export, _libernet_wasm_Export__Output>
      ExportSection: MessageTypeDefinition<_libernet_wasm_ExportSection, _libernet_wasm_ExportSection__Output>
      Expression: MessageTypeDefinition<_libernet_wasm_Expression, _libernet_wasm_Expression__Output>
      ExternalKind: EnumTypeDefinition
      FuncType: MessageTypeDefinition<_libernet_wasm_FuncType, _libernet_wasm_FuncType__Output>
      FunctionSection: MessageTypeDefinition<_libernet_wasm_FunctionSection, _libernet_wasm_FunctionSection__Output>
      Global: MessageTypeDefinition<_libernet_wasm_Global, _libernet_wasm_Global__Output>
      GlobalSection: MessageTypeDefinition<_libernet_wasm_GlobalSection, _libernet_wasm_GlobalSection__Output>
      GlobalType: MessageTypeDefinition<_libernet_wasm_GlobalType, _libernet_wasm_GlobalType__Output>
      ImportSection: MessageTypeDefinition<_libernet_wasm_ImportSection, _libernet_wasm_ImportSection__Output>
      Locals: MessageTypeDefinition<_libernet_wasm_Locals, _libernet_wasm_Locals__Output>
      MemArg: MessageTypeDefinition<_libernet_wasm_MemArg, _libernet_wasm_MemArg__Output>
      MemoryCopyOp: MessageTypeDefinition<_libernet_wasm_MemoryCopyOp, _libernet_wasm_MemoryCopyOp__Output>
      MemoryInitOp: MessageTypeDefinition<_libernet_wasm_MemoryInitOp, _libernet_wasm_MemoryInitOp__Output>
      MemorySection: MessageTypeDefinition<_libernet_wasm_MemorySection, _libernet_wasm_MemorySection__Output>
      MemoryType: MessageTypeDefinition<_libernet_wasm_MemoryType, _libernet_wasm_MemoryType__Output>
      OpCode: EnumTypeDefinition
      Operator: MessageTypeDefinition<_libernet_wasm_Operator, _libernet_wasm_Operator__Output>
      PlainType: EnumTypeDefinition
      ProgramModule: MessageTypeDefinition<_libernet_wasm_ProgramModule, _libernet_wasm_ProgramModule__Output>
      RefType: EnumTypeDefinition
      SubType: MessageTypeDefinition<_libernet_wasm_SubType, _libernet_wasm_SubType__Output>
      TableCopyOp: MessageTypeDefinition<_libernet_wasm_TableCopyOp, _libernet_wasm_TableCopyOp__Output>
      TableInitOp: MessageTypeDefinition<_libernet_wasm_TableInitOp, _libernet_wasm_TableInitOp__Output>
      TableSection: MessageTypeDefinition<_libernet_wasm_TableSection, _libernet_wasm_TableSection__Output>
      TableType: MessageTypeDefinition<_libernet_wasm_TableType, _libernet_wasm_TableType__Output>
      TagKind: EnumTypeDefinition
      TagSection: MessageTypeDefinition<_libernet_wasm_TagSection, _libernet_wasm_TagSection__Output>
      TagType: MessageTypeDefinition<_libernet_wasm_TagType, _libernet_wasm_TagType__Output>
      ThrowOp: MessageTypeDefinition<_libernet_wasm_ThrowOp, _libernet_wasm_ThrowOp__Output>
      TryTableOp: MessageTypeDefinition<_libernet_wasm_TryTableOp, _libernet_wasm_TryTableOp__Output>
      TypeRefFunc: MessageTypeDefinition<_libernet_wasm_TypeRefFunc, _libernet_wasm_TypeRefFunc__Output>
      TypeSection: MessageTypeDefinition<_libernet_wasm_TypeSection, _libernet_wasm_TypeSection__Output>
      ValueType: MessageTypeDefinition<_libernet_wasm_ValueType, _libernet_wasm_ValueType__Output>
      Version: MessageTypeDefinition<_libernet_wasm_Version, _libernet_wasm_Version__Output>
    }
  }
}

