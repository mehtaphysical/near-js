import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    external: [
      "near-api-js/lib/providers/json-rpc-provider",
      "near-api-js/lib/transaction",
      "near-api-js/lib/signer",
    ],
    plugins: [resolve(), cjs(), json(), typescript()],
  },
];
