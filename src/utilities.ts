import path from "node:path";

import { app } from "electron";

import { type GrpcObject, loadPackageDefinition } from "@grpc/grpc-js";
import {
  type MessageTypeDefinition,
  loadSync as loadProtoSync,
} from "@grpc/proto-loader";

import type { Any as AnyProto } from "./proto/google/protobuf/Any";
import type { Timestamp as TimestampProto } from "./proto/google/protobuf/Timestamp";

export function derToPem(der: Buffer, label: string): string {
  const base64 = der.toString("base64");
  const formatted = base64.replace(/(.{64})/g, "$1\n");
  return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----\n`;
}

export function toScalar(n: number): string {
  return "0x" + n.toString(16).toLowerCase().padStart(64, "0");
}

export function decodeScalar(buffer: string | Buffer | Uint8Array): string {
  if (typeof buffer === "string") {
    throw new Error("unsupported format");
  }
  const bytes = Array.from(buffer);
  const padded =
    bytes.length < 32
      ? [...new Array(32 - bytes.length).fill(0), ...bytes]
      : bytes.slice(0, 32);
  return (
    "0x" +
    padded
      .reverse()
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
      .padStart(64, "0")
  );
}

export function encodeScalar(hex: string): number[] {
  const match = /^0[Xx]([0-9A-Fa-f]{1,64})$/.exec(hex);
  if (!match) {
    throw new Error(`invalid format for hash "${hex}"`);
  }
  const body = match[1].padStart(64, "0");
  const bytes = [];
  for (let i = 0; i < 32; i++) {
    const chars = body.substring((31 - i) * 2, (32 - i) * 2);
    bytes.push(parseInt(chars, 16));
  }
  return bytes;
}

export function decodeBigInt(buffer: string | Buffer | Uint8Array): bigint {
  if (typeof buffer === "string") {
    throw new Error("unsupported format");
  }
  return Array.from(buffer).reduceRight((a, b) => a * 256n + BigInt(b), 0n);
}

export function encodeBigInt(value: bigint): number[] {
  if (value < 0n) {
    throw new Error("underflow");
  }
  const bytes: number[] = [];
  for (let i = 0; i < 32; i++) {
    bytes.push(Number(value % 256n));
    value /= 256n;
  }
  if (value != 0n) {
    throw new Error("overflow");
  }
  return bytes;
}

export function decodeTimestamp(proto: TimestampProto): Date {
  const seconds = parseInt("" + proto.seconds, 10);
  const millis = seconds * 1000 + Math.floor((proto.nanos ?? 0) / 1_000_000);
  return new Date(millis);
}

function getPackageDefintionPath(): string {
  return path.join(
    app.isPackaged ? path.dirname(app.getPath("exe")) : app.getAppPath(),
    "proto",
    "libernet.proto",
  );
}

export const libernetPackageDefinition = loadProtoSync(
  getPackageDefintionPath(),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const grpcObject = loadPackageDefinition(libernetPackageDefinition);

export function unpackAny<T>(any: AnyProto): T {
  const { type_url, value } = any as {
    type_url: string;
    value: Buffer | Uint8Array | string;
  };

  const typeName = type_url.split("/").pop();
  if (!typeName) {
    throw new Error(`invalid type_url: ${type_url}`);
  }

  const messageType = (function fetch(
    parent: GrpcObject,
    components: string[],
  ): MessageTypeDefinition<T, T> {
    if (components.length > 1) {
      return fetch(parent[components[0]] as GrpcObject, components.slice(1));
    } else {
      return parent[components[0]] as MessageTypeDefinition<T, T>;
    }
  })(grpcObject, typeName.split("."));

  if (!messageType) {
    throw new Error(`unknown Any type: ${type_url}`);
  }

  return messageType.deserialize(value as Buffer);
}
