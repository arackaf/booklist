const path = require("path");

module.exports = {
  entry: "./handler.js",
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js',
  },
  target: "node",
  mode: "production",
  optimization: {
    //minimize: false,
  },
  externals: ["aws-sdk"],
};
