import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import prettier from "rollup-plugin-prettier";
import nodeResolve from "@rollup/plugin-node-resolve";

import { version } from "./package.json";

const PRETTY = !!process.env.PRETTY;

const banner = `/**
 * react-loader-router v${version}
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */`;

/** @type {import("rollup").RollupOptions[]} */
function reactLoaderRoute() {
  let SOURCE_DIR = "src";
  let OUTPUT_DIR = "build/node_modules/react-loader-router";

  let reactLoaderRouteCJS = {
    input: `${SOURCE_DIR}/index.tsx`,
    output: {
      sourcemap: !PRETTY,
      banner: banner,
      dir: OUTPUT_DIR,
      format: "cjs",
      preserveModules: true,
      exports: "auto"
    },
    external: ["react", "react-router-dom"],
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [
          ["@babel/preset-env", { loose: true }],
          "@babel/preset-react",
          "@babel/preset-typescript"
        ],
        plugins: ["babel-plugin-dev-expression"],
        extensions: [".ts", ".tsx"]
      }),
      nodeResolve({ extensions: [".ts", ".tsx"] }),
      copy({
        targets: [
          { src: "package.json", dest: OUTPUT_DIR },
          { src: "README.md", dest: OUTPUT_DIR }
        ],
        verbose: true
      })
    ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
  };
  let reactLoaderRouteESM = {
    input: `${SOURCE_DIR}/index.tsx`,
    output: {
      sourcemap: !PRETTY,
      banner: banner,
      dir: `${OUTPUT_DIR}/esm`,
      format: "esm",
      preserveModules: true
    },
    external: ["react", "react-router-dom"],
    plugins: [
      babel({
        exclude: /node_modules/,
        presets: [
          ["@babel/preset-env", { loose: true }],
          "@babel/preset-react",
          "@babel/preset-typescript"
        ],
        plugins: ["babel-plugin-dev-expression"],
        extensions: [".ts", ".tsx"]
      }),
      nodeResolve({ extensions: [".ts", ".tsx"] }),
      copy({
        targets: [
          { src: "package.json", dest: OUTPUT_DIR },
          { src: "README.md", dest: OUTPUT_DIR }
        ],
        verbose: true
      })
    ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
  };
  return [reactLoaderRouteCJS, reactLoaderRouteESM];
}

export default function rollup() {
  return reactLoaderRoute();
}
