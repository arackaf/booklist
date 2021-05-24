const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const slsw = require("serverless-webpack");

const ConditionalPlugin = (condition, plugin) => ({
  apply: compiler => {
    let fileName = Object.keys(compiler.options.entry)[0].split("/").pop();

    if (condition(fileName)) {
      plugin.apply(compiler);
    }
  }
});

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
  externals: ["aws-sdk", "mongodb-client-encryption", "saslprep"],
  optimization: {
    //minimize: false
  },
  plugins: [
    ConditionalPlugin(
      fileName => fileName != "ws-connection",
      new CopyPlugin({
        patterns: [
          { from: "../node_modules/saslprep", to: "node_modules/saslprep" },
          { from: "../node_modules/sparse-bitfield", to: "node_modules/sparse-bitfield" },
          { from: "../node_modules/memory-pager", to: "node_modules/memory-pager" }
        ]
      })
    )
  ]
};
