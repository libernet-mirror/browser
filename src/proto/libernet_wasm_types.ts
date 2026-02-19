import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ValueType as _libernet_wasm_ValueType, ValueType__Output as _libernet_wasm_ValueType__Output } from './libernet/wasm/ValueType';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  libernet: {
    wasm: {
      PlainType: EnumTypeDefinition
      RefType: EnumTypeDefinition
      ValueType: MessageTypeDefinition<_libernet_wasm_ValueType, _libernet_wasm_ValueType__Output>
    }
  }
}

