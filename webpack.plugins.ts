import type { Configuration } from "webpack";

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export const plugins: NonNullable<Configuration["plugins"]> = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new CopyPlugin({
    patterns: [
      {
        from: "proto/*.proto",
        to: "../",
      },
    ],
  }),
];
