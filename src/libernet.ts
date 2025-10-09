import path from "node:path";

import { app } from "electron";

import {
  credentials as grpcCredentials,
  loadPackageDefinition,
  type GrpcObject,
  type ServiceClientConstructor,
} from "@grpc/grpc-js";

import { loadSync as loadProtoSync } from "@grpc/proto-loader";

import type { Account } from "../crypto-bindings/crypto";

const BOOTSTRAP_NODE_ADDRESS = "localhost:4443";

function getPackageDefintionPath(): string {
  return path.join(
    app.isPackaged ? path.dirname(app.getPath("exe")) : app.getAppPath(),
    "proto",
    "libernet.proto",
  );
}

const packageDefinition = loadProtoSync(getPackageDefintionPath(), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const libernet = loadPackageDefinition(packageDefinition)
  .libernet as GrpcObject;

export class Libernet {
  private readonly _client;

  public constructor(public readonly account: Account) {
    this._client = new (libernet["NodeServiceV1"] as ServiceClientConstructor)(
      BOOTSTRAP_NODE_ADDRESS,
      grpcCredentials.createSsl(null),
    );
  }

  public async getBalance(address: string): Promise<string> {
    const response = await this._client.getAccount({
      blockHash: null,
      accountAddress: address,
    });
    // TODO
    throw new Error("not implemented");
  }
}
