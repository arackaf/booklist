const graphqlPlugin = require("./rollupGraphqlPlugin");
const minify = require("rollup-plugin-babel-minify");
const path = require("path");

module.exports = {
  input: "./src/index.js",
  output: {
    format: "iife",
    file: "./sw-index-bundle.js"
  },
  plugins: [/*minify({}),*/ graphqlPlugin({ path: path.resolve(__dirname, "../extracted_queries.json") })]
};
