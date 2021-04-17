const path = require("path");

module.exports = {
  entry: "./handler.js",
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "handler.js"
  },
  target: "node",
  mode: "production",
  externals: ["aws-sdk", "mongodb-client-encryption"],
  optimization: {
    minimize: false
  },
  module: {
    parser: {
      javascript: {
        commonjsMagicComments: true
      }
    }
  }
};
