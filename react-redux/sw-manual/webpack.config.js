const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const isProd = false || process.env.NODE_ENV == "production";

module.exports = {
  entry: {
    main: "./index.js"
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname),
    library: "lib"
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: {
          loader: "generic-persistgraphql/loader",
          options: {
            path: path.resolve(__dirname, "extracted_queries.json")
          }
        }
      }
    ]
  },
  optimization: {
    //minimize: false
  },
  plugins: [isProd ? new MinifyPlugin() : null].filter(p => p)
};
