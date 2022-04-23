const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const CircularDependencyPlugin = require("circular-dependency-plugin");

const getCache = ({ name, pattern, expires, maxEntries }) => ({
  urlPattern: pattern,
  handler: "CacheFirst",
  options: {
    matchOptions: {
      ignoreVary: true
    },
    cacheName: name,
    expiration: {
      maxEntries: maxEntries || 500,
      maxAgeSeconds: expires || 60 * 60 * 24 * 365 * 2 //2 years
    },
    cacheableResponse: {
      statuses: [200]
    }
  }
});

module.exports = {
  entry: {
    main: "./svelteStartup.ts"
  },
  output: {
    filename: isProd ? "[name]-bundle-[contenthash].js" : "[name]-bundle.js",
    chunkFilename: isProd ? "[name]-chunk-[contenthash].js" : "[name]-chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ""
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".svelte"],
    alias: {
      jscolor: "util/jscolor.js"
    },
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "svelte-loader",
            options: {
              emitCss: true,
              preprocess: require("svelte-preprocess")({})
            }
          }
        ]
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: {
          loader: "generic-persistgql/loader",
          options: {
            path: path.resolve(__dirname, "extracted_queries.json")
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: isProd ? [new TerserPlugin()] : []
    //minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "default.htm", chunks: ["main"], filename: "index.html" }),

    new MiniCssExtractPlugin({ filename: isProd ? "[name]-[contenthash].css" : "[name].css" }),
    new GenerateSW({
      ignoreURLParametersMatching: [/./],
      exclude: [/\.(ttf|eot|svg|woff)$/],
      navigateFallback: "svelte/dist/index.html",
      navigateFallbackDenylist: [/\/(activate|graphql|graphql-public)\b/],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:1/, name: "short-cache", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:5/, name: "medium-cache", expires: 60 * 60 * 24 }), //1 day
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:9/, name: "max-cache" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
        getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" })
      ],
      importScripts: ["/react/service-worker/sw-index-bundle.js"]
    }),
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    new Dotenv(isProd ? { systemvars: true } : { path: "./.env.dev" }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /node_modules/,
      // include specific files based on a RegExp
      //include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false
      // set the current working directory for displaying module paths
      //cwd: process.cwd(),
    })
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
