import path from "node:path";

import { app } from "electron";

import { loadSync as loadProtoSync } from "@grpc/proto-loader";
import protobuf from "protobufjs";

import type { Any as AnyProto } from "./proto/google/protobuf/Any";
import type { Timestamp as TimestampProto } from "./proto/google/protobuf/Timestamp";

export function derToPem(der: Buffer, label: string): string {
  const base64 = der.toString("base64");
  const formatted = base64.replace(/(.{64})/g, "$1\n");
  return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----\n`;
}

export function encodeLong(value: number, unsigned = false): protobuf.Long {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`cannot convert unsafe number to Long: ${value}`);
  }
  if (value < 0 && unsigned) {
    throw new Error(
      `cannot convert negative number to unsigned Long: ${value}`,
    );
  }
  let low: number;
  let high: number;
  if (unsigned) {
    low = value >>> 0;
    high = Math.floor(value / 2 ** 32);
  } else {
    low = value & 0xffffffff;
    high = Math.floor(value / 2 ** 32);
  }
  return { low, high, unsigned };
}

export function decodeLong(
  value: number | bigint | string | protobuf.Long,
): number {
  switch (typeof value) {
    case "number":
      return value;
    case "bigint":
      if (
        value < BigInt(Number.MIN_SAFE_INTEGER) ||
        value > BigInt(Number.MAX_SAFE_INTEGER)
      ) {
        throw new Error(`Unsafe bigint: ${value.toString()}`);
      }
      return Number(value).valueOf();
    case "string":
      return parseInt(value, 10);
    case "object": {
      const { low, high, unsigned } = value;
      const result = unsigned
        ? (high >>> 0) * 2 ** 32 + (low >>> 0)
        : high * 2 ** 32 + (low >>> 0);
      if (!Number.isSafeInteger(result)) {
        throw new Error(
          `Unsafe Long value: high=${high}, low=${low}, unsigned=${unsigned}`,
        );
      }
      return result;
    }
    default:
      console.dir(value);
      console.dir(typeof value);
      throw new Error("invalid integer format");
  }
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
);

const protoDefinitionRoot = protobuf.loadSync(getPackageDefintionPath());

function getMessageType(typeName: string): protobuf.Type {
  const type = protoDefinitionRoot.lookupType(typeName);
  if (!type) {
    throw new Error(`unknown type name: ${typeName}`);
  }
  return type;
}

export function packAny<T>(proto: T, typeName: string): AnyProto {
  const messageType = getMessageType(typeName);
  const error = messageType.verify(proto);
  if (error) {
    throw new Error(error);
  }
  return {
    type_url: `type.libernet.org/${typeName}`,
    value: messageType.encode(proto).finish(),
  };
}

function normalizeBytes(value: Buffer | Uint8Array | string): Uint8Array {
  if (typeof value === "string") {
    return Uint8Array.from(Buffer.from(value, "base64"));
  }
  if (Buffer.isBuffer(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  return value;
}

export function unpackAny<T>(any: AnyProto): T {
  const { type_url, value } = any as {
    type_url: string;
    value: Buffer | Uint8Array | string;
  };
  const typeName = type_url.split("/").pop();
  if (!typeName) {
    throw new Error(`invalid type_url: ${type_url}`);
  }
  const messageType = getMessageType(typeName);
  const bytes = normalizeBytes(value);
  return messageType.decode(bytes) as unknown as T;
}
