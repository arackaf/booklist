const path = require("path");
const graphqlPlugin = require("./rollupGraphqlPlugin");
const minify = require("rollup-plugin-babel-minify");
const babel = require("rollup-plugin-babel");
const typescript = require("rollup-plugin-typescript");

module.exports = {
  input: "./src/index.ts",
  output: {
    format: "iife",
    file: "./sw-index-bundle.js"
  },
  plugins: [/*minify({}),*/ graphqlPlugin({ path: path.resolve(__dirname, "../extracted_queries.json") }), typescript()]
};
