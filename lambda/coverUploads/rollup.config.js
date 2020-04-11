import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

import json from "@rollup/plugin-json";

module.exports = {
  input: "./index.js",
  output: {
    name: "main",
    format: "cjs",
    file: "./index-bundle.js"
  },
  external: [
    "fs",
    "util",
    "stream",
    "events",
    "crypto",
    "http",
    "https",
    "domain",
    "os",
    "path",
    "dgram",
    "buffer",
    "url",
    "querystring",
    "child_process",
    "timers",
    "string_decoder"
  ],

  plugins: [commonjs(), resolve({ preferBuiltins: true }), terser({}), json()]
};
