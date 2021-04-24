const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./handler.js",
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "handler.js"
  },
  target: "node",
  mode: "production",
  externals: ["aws-sdk", "mongodb-client-encryption", "saslprep"],
  optimization: {
    //minimize: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "../node_modules/saslprep", to: "node_modules/saslprep" },
        { from: "../node_modules/sparse-bitfield", to: "node_modules/sparse-bitfield" },
        { from: "../node_modules/memory-pager", to: "node_modules/memory-pager" }
      ]
    })
  ]
};
