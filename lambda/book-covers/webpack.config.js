const isProd = true;
const path = require("path");

module.exports = {
  entry: {
    handler: "./handler-dev.js"
  },
  target: "node",
  output: {
    filename: "./handler.js",
    path: __dirname,
    libraryTarget: "commonjs2" 
  },
  resolve: {
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: []
  },
  externals: ["aws-sdk"],
};
