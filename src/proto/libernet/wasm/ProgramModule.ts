// Original file: proto/libernet_wasm.proto

import type { Version as _libernet_wasm_Version, Version__Output as _libernet_wasm_Version__Output } from '../../libernet/wasm/Version';
import type { TypeSection as _libernet_wasm_TypeSection, TypeSection__Output as _libernet_wasm_TypeSection__Output } from '../../libernet/wasm/TypeSection';
import type { ImportSection as _libernet_wasm_ImportSection, ImportSection__Output as _libernet_wasm_ImportSection__Output } from '../../libernet/wasm/ImportSection';
import type { FunctionSection as _libernet_wasm_FunctionSection, FunctionSection__Output as _libernet_wasm_FunctionSection__Output } from '../../libernet/wasm/FunctionSection';
import type { TableSection as _libernet_wasm_TableSection, TableSection__Output as _libernet_wasm_TableSection__Output } from '../../libernet/wasm/TableSection';
import type { MemorySection as _libernet_wasm_MemorySection, MemorySection__Output as _libernet_wasm_MemorySection__Output } from '../../libernet/wasm/MemorySection';
import type { TagSection as _libernet_wasm_TagSection, TagSection__Output as _libernet_wasm_TagSection__Output } from '../../libernet/wasm/TagSection';
import type { GlobalSection as _libernet_wasm_GlobalSection, GlobalSection__Output as _libernet_wasm_GlobalSection__Output } from '../../libernet/wasm/GlobalSection';
import type { ExportSection as _libernet_wasm_ExportSection, ExportSection__Output as _libernet_wasm_ExportSection__Output } from '../../libernet/wasm/ExportSection';
import type { ElementSection as _libernet_wasm_ElementSection, ElementSection__Output as _libernet_wasm_ElementSection__Output } from '../../libernet/wasm/ElementSection';
import type { CodeSection as _libernet_wasm_CodeSection, CodeSection__Output as _libernet_wasm_CodeSection__Output } from '../../libernet/wasm/CodeSection';
import type { DataSection as _libernet_wasm_DataSection, DataSection__Output as _libernet_wasm_DataSection__Output } from '../../libernet/wasm/DataSection';

export interface ProgramModule {
  'protocolVersion'?: (number);
  'version'?: (_libernet_wasm_Version | null);
  'typeSection'?: (_libernet_wasm_TypeSection | null);
  'importSection'?: (_libernet_wasm_ImportSection | null);
  'functionSection'?: (_libernet_wasm_FunctionSection | null);
  'tableSection'?: (_libernet_wasm_TableSection | null);
  'memorySection'?: (_libernet_wasm_MemorySection | null);
  'tagSection'?: (_libernet_wasm_TagSection | null);
  'globalSection'?: (_libernet_wasm_GlobalSection | null);
  'exportSection'?: (_libernet_wasm_ExportSection | null);
  'elementSection'?: (_libernet_wasm_ElementSection | null);
  'codeSection'?: (_libernet_wasm_CodeSection | null);
  'dataSection'?: (_libernet_wasm_DataSection | null);
}

export interface ProgramModule__Output {
  'protocolVersion'?: (number);
  'version'?: (_libernet_wasm_Version__Output);
  'typeSection'?: (_libernet_wasm_TypeSection__Output);
  'importSection'?: (_libernet_wasm_ImportSection__Output);
  'functionSection'?: (_libernet_wasm_FunctionSection__Output);
  'tableSection'?: (_libernet_wasm_TableSection__Output);
  'memorySection'?: (_libernet_wasm_MemorySection__Output);
  'tagSection'?: (_libernet_wasm_TagSection__Output);
  'globalSection'?: (_libernet_wasm_GlobalSection__Output);
  'exportSection'?: (_libernet_wasm_ExportSection__Output);
  'elementSection'?: (_libernet_wasm_ElementSection__Output);
  'codeSection'?: (_libernet_wasm_CodeSection__Output);
  'dataSection'?: (_libernet_wasm_DataSection__Output);
}
