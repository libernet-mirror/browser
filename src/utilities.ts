import path from "node:path";

import { app } from "electron";

import { loadSync as loadProtoSync } from "@grpc/proto-loader";
import protobuf from "protobufjs";

import type { Any as AnyProto } from "./proto/google/protobuf/Any";
import type { Timestamp as TimestampProto } from "./proto/google/protobuf/Timestamp";
import type { PointG1 } from "./proto/libernet/PointG1";
import type { PointG2 } from "./proto/libernet/PointG2";
import type { Scalar } from "./proto/libernet/Scalar";

import { PROTO_TYPE_NAME_PREFIX } from "./constants";

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

function decodePoint(
  point: { compressedBytes?: string | Buffer | Uint8Array },
  length: number,
): string {
  const buffer = point.compressedBytes;
  if (!buffer) {
    throw new Error("invalid point");
  }
  if (typeof buffer === "string") {
    throw new Error("unsupported format");
  }
  const bytes = Array.from(buffer);
  if (bytes.length !== length) {
    throw new Error("invalid point format");
  }
  return (
    "0x" +
    bytes
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
}

function encodePoint(
  hex: string,
  length: number,
): { compressedBytes: Uint8Array } {
  const match = /^0[Xx]([0-9A-Fa-f]+)$/.exec(hex);
  if (!match) {
    throw new Error(`invalid hex format: "${hex}"`);
  }
  const digits = match[1];
  if (digits.length !== length * 2) {
    throw new Error(`invalid point: "${hex}"`);
  }
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const chars = digits.substring(i * 2, (i + 1) * 2);
    bytes[i] = parseInt(chars, 16);
  }
  return { compressedBytes: bytes };
}

export function decodePointG1(point: PointG1): string {
  return decodePoint(point, 48);
}

export function encodePointG1(hex: string): PointG1 {
  return encodePoint(hex, 48);
}

export function decodePointG2(point: PointG2): string {
  return decodePoint(point, 96);
}

export function encodePointG2(hex: string): PointG2 {
  return encodePoint(hex, 96);
}

export function decodeScalar(scalar: Scalar): string {
  const buffer = scalar.value;
  if (!buffer) {
    throw new Error("invalid scalar format");
  }
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

export function encodeScalar(hex: string): Scalar {
  const match = /^0[Xx]([0-9A-Fa-f]+)$/.exec(hex);
  if (!match) {
    throw new Error(`invalid hex format: "${hex}"`);
  }
  const digits = match[1];
  if (digits.length > 64) {
    throw new Error(`too many digits: "${hex}"`);
  }
  const body = digits.padStart(64, "0");
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    const chars = body.substring((31 - i) * 2, (32 - i) * 2);
    bytes[i] = parseInt(chars, 16);
  }
  return { value: bytes };
}

export function decodeBigInt(scalar: Scalar): bigint {
  const buffer = scalar.value;
  if (typeof buffer === "string") {
    throw new Error("unsupported format");
  }
  return Array.from(buffer).reduceRight((a, b) => a * 256n + BigInt(b), 0n);
}

export function encodeBigInt(value: bigint): Scalar {
  if (value < 0n) {
    throw new Error("underflow");
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = Number(value % 256n);
    value /= 256n;
  }
  if (value != 0n) {
    throw new Error("overflow");
  }
  return { value: bytes };
}

export function decodeTimestamp(proto: TimestampProto): Date {
  const seconds = parseInt("" + proto.seconds, 10);
  const millis = seconds * 1000 + Math.floor((proto.nanos ?? 0) / 1_000_000);
  return new Date(millis);
}

function getPackageDefintionPath(): string {
  return path.join(app.getAppPath(), ".webpack", "proto", "libernet.proto");
}

export const libernetPackageDefinition = loadProtoSync(
  getPackageDefintionPath(),
);

const protoDefinitionRoot = protobuf.loadSync(getPackageDefintionPath());

function getMessageType(typeName: string): protobuf.Type {
  const type = protoDefinitionRoot.lookupType(typeName);
  if (!type) {
    throw new Error(`unknown type name: ${JSON.stringify(typeName)}`);
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
    type_url: `${PROTO_TYPE_NAME_PREFIX}/${typeName}`,
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
  if (!type_url.startsWith(PROTO_TYPE_NAME_PREFIX + "/")) {
    throw new Error(`invalid type_url: ${JSON.stringify(type_url)}`);
  }
  const typeName = type_url.slice(PROTO_TYPE_NAME_PREFIX.length + 1);
  const messageType = getMessageType(typeName);
  const bytes = normalizeBytes(value);
  return messageType.decode(bytes) as unknown as T;
}

function encodeVarInt(buffer: number[], value: number): void {
  while (value > 0x7f) {
    buffer.push(0x80 | (value & 0x7f));
    value >>>= 7;
  }
  buffer.push(value & 0x7f);
}

export function encodeAnyCanonical(any: AnyProto): Uint8Array {
  const { type_url, value } = any as {
    type_url: string;
    value: Buffer | Uint8Array | string;
  };
  const typeUrlBytes = Buffer.from(type_url, "utf8");
  const valueBytes = normalizeBytes(value);

  const bytes: number[] = [];

  bytes.push(10);
  encodeVarInt(bytes, typeUrlBytes.length);
  for (const b of typeUrlBytes) {
    bytes.push(b);
  }

  bytes.push(18);
  encodeVarInt(bytes, valueBytes.length);
  for (const b of valueBytes) {
    bytes.push(b);
  }

  return new Uint8Array(bytes);
}

export function encodeMessageCanonical<T>(
  message: T,
  typeName: string,
): { any: AnyProto; bytes: Uint8Array } {
  const any = packAny<T>(message, typeName);
  const bytes = encodeAnyCanonical(any);
  return { any, bytes };
}
