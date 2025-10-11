import path from "node:path";

import { app } from "electron";

import { Crypto } from "@peculiar/webcrypto";
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";

import {
  credentials as grpcCredentials,
  loadPackageDefinition,
  type GrpcObject,
  type ServiceClientConstructor,
} from "@grpc/grpc-js";

import { loadSync as loadProtoSync } from "@grpc/proto-loader";

import type { Account } from "../crypto-bindings/crypto";

const BOOTSTRAP_NODE_ADDRESS = "localhost:4443";

const crypto = new Crypto();
pkijs.setEngine(
  "NodeEngine",
  new pkijs.CryptoEngine({
    name: "NodeEngine",
    crypto,
    subtle: crypto.subtle,
  }),
);

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

  private static _decodePem(pem: string): Buffer {
    return Buffer.from(
      pem
        .replace(/-----BEGIN [A-Z ]+-----/, "")
        .replace(/-----END [A-Z ]+-----/, "")
        .replace(/\s+/g, ""),
      "base64",
    );
  }

  private static _encodePem(b64: string, label: string): string {
    const formatted = b64.match(/.{1,64}/g)?.join("\n");
    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
  }

  private static async _generateCertificate(account: Account): Promise<{
    privateKey: string;
    certificate: string;
  }> {
    const keypair = await crypto.subtle.generateKey("Ed25519", true, [
      "sign",
      "verify",
    ]);

    const pkcs8 = await crypto.subtle.exportKey("pkcs8", keypair.privateKey);
    const pkcs8Base64 = Buffer.from(pkcs8).toString("base64");
    const privateKeyPem = Libernet._encodePem(pkcs8Base64, "PRIVATE KEY");

    const certificate = new pkijs.Certificate();
    certificate.version = 2;
    certificate.serialNumber = new asn1js.Integer({
      value: Math.floor(Date.now() / 1000),
    });

    certificate.issuer.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: "2.5.4.3",
        value: new asn1js.PrintableString({ value: account.address() }),
      }),
    );

    certificate.subject.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: "2.5.4.3",
        value: new asn1js.PrintableString({ value: account.address() }),
      }),
    );

    const now = new Date();
    certificate.notBefore.value = now;
    certificate.notAfter.value = now;
    certificate.notAfter.value.setFullYear(
      certificate.notBefore.value.getFullYear() + 1,
    );

    await certificate.subjectPublicKeyInfo.importKey(keypair.publicKey);
    await certificate.sign(keypair.privateKey, "SHA3");

    const der = certificate.toSchema(true).toBER(false);
    const b64 = Buffer.from(der).toString("base64");
    const certificatePem = Libernet._encodePem(b64, "CERTIFICATE");

    return { privateKey: privateKeyPem, certificate: certificatePem };
  }

  private constructor(
    public readonly account: Account,
    privateKeyPem: string,
    certificatePem: string,
  ) {
    this._client = new (libernet["NodeServiceV1"] as ServiceClientConstructor)(
      BOOTSTRAP_NODE_ADDRESS,
      grpcCredentials.createSsl(
        null,
        Buffer.from(privateKeyPem, "ascii"),
        Buffer.from(certificatePem, "ascii"),
      ),
    );
  }

  public static async create(account: Account): Promise<Libernet> {
    const { privateKey, certificate } =
      await Libernet._generateCertificate(account);
    return new Libernet(account, privateKey, certificate);
  }

  public async getBalance(address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._client.getAccount(
        {
          blockHash: null,
          accountAddress: address,
        },
        (error, response) => {
          if (error) {
            reject(error);
          } else {
            console.dir(response);
          }
        },
      );
    });
  }
}
