/* eslint-disable @typescript-eslint/no-empty-function */

import * as fs from "node:fs/promises";
import * as net from "node:net";
import * as tls from "node:tls";

import type { Account } from "../crypto-bindings/crypto";
import { derToPem } from "./utilities";

export class Proxy {
  private _server: net.Server | null = null;
  private _localSocket: net.Socket | null = null;
  private _tlsSocket: tls.TLSSocket | null = null;

  private constructor(
    private readonly _account: Account,
    private readonly _path: string,
    private readonly _remoteHost: string,
    private readonly _remotePort: number,
  ) {}

  private async _start(): Promise<void> {
    try {
      await fs.unlink(this._path);
    } catch {
      // ignore
    }

    this._server = net.createServer(async (localSocket) => {
      if (this._localSocket) {
        return;
      }

      localSocket.pause();
      localSocket.on("error", (error) => {
        console.error("Local UDS socket error:", error);
      });
      this._localSocket = localSocket;

      this._server.close();
      try {
        await fs.unlink(this._path);
      } catch {
        // ignore
      }

      const privateKey = this._account.export_ecdsa_private_key_pem();
      const notBefore = Date.now() - 1000 * 3600 * 24;
      const notAfter = Date.now() + 1000 * 3600 * 24 * 365;
      const certificate = this._account.generate_ecdsa_certificate_pem(
        BigInt(notBefore),
        BigInt(notAfter),
      );

      this._tlsSocket = tls.connect({
        host: this._remoteHost,
        port: this._remotePort,
        key: privateKey,
        cert: certificate,
        rejectUnauthorized: false,
      });

      this._tlsSocket.once("secureConnect", () => {
        try {
          const peerCertificate = this._tlsSocket.getPeerCertificate(true);
          const remote = this._account.verify_ssl_certificate(
            derToPem(peerCertificate.raw, "CERTIFICATE"),
            BigInt(Date.now()),
          );
          console.log(`connected to: ${remote.address()}`);

          this._localSocket.resume();
          this._localSocket.pipe(this._tlsSocket);
          this._tlsSocket.pipe(this._localSocket);
        } catch {
          try {
            this._tlsSocket.destroy();
          } catch {
            // ignore
          }
          try {
            this._localSocket.destroy();
          } catch {
            // ignore
          }
        }
      });

      this._tlsSocket.on("error", (error) => {
        console.error("TLS socket error:", error);
        this._localSocket.destroy();
      });
    });

    await new Promise<void>((resolve, reject) => {
      this._server.on("error", (error) => reject(error));
      this._server.listen(this._path, () => resolve());
    });

    fs.chmod(this._path, 0o700).catch(() => {});
  }

  public static async create(
    account: Account,
    path: string,
    target: string,
  ): Promise<Proxy> {
    const match = /^(.+):(\d+)$/.exec(target);
    if (!match) {
      throw new Error(
        `invalid node address: "${target}" (must be in the form "host:port")`,
      );
    }
    const remoteHost = match[1];
    const remotePort = parseInt(match[2], 10);
    const proxy = new Proxy(account, path, remoteHost, remotePort);
    await proxy._start();
    return proxy;
  }

  private _closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public async destroy() {
    if (this._server) {
      await this._closeServer().catch(() => {});
      await fs.unlink(this._path).catch(() => {});
    }
    if (this._tlsSocket) {
      this._tlsSocket.destroy();
    }
    if (this._localSocket) {
      this._localSocket.destroy();
    }
  }
}
