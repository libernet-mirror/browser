import { useState } from "react";

import { type ProtocolVersion } from "../data";

import { libernet } from "./Libernet";
import { Logo } from "./Logo";
import { useAsyncEffect } from "./Utilities";

export const Page = () => {
  const [browserVersion, setBrowserVersion] = useState<ProtocolVersion | null>(
    null,
  );
  const [nodeVersion, setNodeVersion] = useState<ProtocolVersion | null>(null);
  const [protocolVersion, setProtocolVersion] =
    useState<ProtocolVersion | null>(null);
  useAsyncEffect(async () => {
    const [browserVersion, nodeVersion, protocolVersion] = await Promise.all([
      libernet().getBrowserVersion(),
      libernet().getNodeJSVersion(),
      libernet().getProtocolVersion(),
    ]);
    setBrowserVersion(browserVersion);
    setNodeVersion(nodeVersion);
    setProtocolVersion(protocolVersion);
  }, []);
  return (
    <div className="mx-auto prose mt-5 max-w-xl min-w-md lg:prose-lg">
      <h1 className="align-bottom">
        <span className="mr-4 inline-block">
          <Logo width={50} height={50} />
        </span>
        LiberBrowser
      </h1>
      <p>
        Released under the{" "}
        <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">
          Apache license 2.0.
        </a>
      </p>
      <p>
        Copyright 2025 the Libernet Team.{" "}
        <a href="https://libernet.xyz/">https://libernet.xyz/</a>
      </p>
      <p>
        Source available on GitHub:{" "}
        <a href="https://github.com/libernet-mirror/browser" target="_blank">
          https://github.com/libernet-mirror/browser
        </a>
      </p>
      <table>
        <tbody>
          <tr>
            <td>Browser version</td>
            <td>
              {browserVersion && (
                <kbd>
                  {browserVersion.major}.{browserVersion.minor}.
                  {browserVersion.build}
                </kbd>
              )}
            </td>
          </tr>
          <tr>
            <td>Node.js version</td>
            <td>
              {nodeVersion && (
                <kbd>
                  {nodeVersion.major}.{nodeVersion.minor}.{nodeVersion.build}
                </kbd>
              )}
            </td>
          </tr>
          <tr>
            <td>Libernet protocol version</td>
            <td>
              {protocolVersion && (
                <kbd>
                  {protocolVersion.major}.{protocolVersion.minor}.
                  {protocolVersion.build}
                </kbd>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
