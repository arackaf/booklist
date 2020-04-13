const isProd = true;
const path = require("path");

module.exports = {
  entry: {
    main: "./index.js"
  },
  target: "node",
  output: {
    filename: "index-bundle.js",
    path: __dirname
  },
  resolve: {
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: []
  },
  externals: ["aws-sdk"],
  output: { libraryTarget: "commonjs2" },
  plugins: [
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
  ].filter(p => p),
  stats: {
    all: false,
    assets: true,
    modules: true,
    maxModules: 10,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true,
    warningsFilter: warning => !/mini-css-extract-plugin.*conflicting order between/i.test(warning)
  }
};
