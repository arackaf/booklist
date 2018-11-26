const fs = require("fs");
const path = require("path");

const rollup = require("rollup");
const { uglify } = require("rollup-plugin-uglify");
const minify = require("rollup-plugin-babel-minify");
const graphqlPlugin = require("./rollupGraphqlPlugin");

rollup
  .rollup({
    input: "./index.js",
    plugins: [
      //minify({})
      graphqlPlugin({ path: path.resolve(__dirname, "../extracted_queries.json") })
    ]
  })
  .then(lib => lib.write({ format: "iife", file: "./rollup.js" }));
