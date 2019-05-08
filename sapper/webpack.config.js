const webpack = require("webpack");
const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const extensions = [".mjs", ".js", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssConfig = {
  test: /\.css$/,
  oneOf: [
    {
      test: /\.module\.css$/,
      use: [MiniCssExtractPlugin.loader, { loader: "css-loader", options: { modules: true, exportOnlyLocals: false } }]
    },
    {
      use: [MiniCssExtractPlugin.loader, "css-loader"]
    }
  ]
};

module.exports = {
  client: {
    entry: config.client.entry(),
    output: config.client.output(),
    resolve: { extensions, mainFields },
    module: {
      rules: [
        cssConfig,
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              hotReload: false // pending https://github.com/sveltejs/svelte/issues/2377
            }
          }
        }
      ]
    },
    mode,
    plugins: [
      new MiniCssExtractPlugin({ filename: dev ? "[name].css" : "[name]-[contenthash].css" }),
      // pending https://github.com/sveltejs/svelte/issues/2377
      // dev && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      })
    ].filter(Boolean),
    devtool: dev && "inline-source-map"
  },

  server: {
    entry: config.server.entry(),
    output: config.server.output(),
    target: "node",
    resolve: { extensions, mainFields },
    externals: Object.keys(pkg.dependencies).concat("encoding"),
    module: {
      rules: [
        cssConfig,
        {
          test: /\.(svelte|html)$/,
          use: {
            loader: "svelte-loader",
            options: {
              css: false,
              generate: "ssr",
              dev
            }
          }
        }
      ]
    },
    mode: process.env.NODE_ENV,
    plugins: [new MiniCssExtractPlugin({ filename: dev ? "[name].css" : "[name]-[contenthash].css" })],
    performance: {
      hints: false // it doesn't matter if server.js is large
    }
  },

  serviceworker: {
    entry: config.serviceworker.entry(),
    output: config.serviceworker.output(),
    mode: process.env.NODE_ENV
  }
};
