const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  target: "node",
  mode: "production",
  externals: ["aws-sdk"],
  optimization: {
    minimize: false
  }
};
