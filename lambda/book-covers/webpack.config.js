const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const slsw = require("serverless-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack")
  },
  target: "node",
  mode: "production",
  externals: ["aws-sdk", "mongodb-client-encryption", "saslprep"],
  optimization: {
    //minimize: false
  }
  //plugins: [new BundleAnalyzerPlugin()]
};
