var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
var SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
var path = require("path");
const isProd = process.env.NODE_ENV == "production";

const getCache = ({ name, pattern, expires, maxEntries }) => ({
  urlPattern: pattern,
  handler: "cacheFirst",
  options: {
    cache: {
      maxEntries: maxEntries || 500,
      name: name,
      maxAgeSeconds: expires || 60 * 60 * 24 * 365 * 2 //2 years
    },
    successResponses: /0|[123].*/
  }
});

module.exports = {
  entry: {
    main: "./reactStartup.ts"
  },
  output: {
    filename: "[name]-bundle.js",
    chunkFilename: "[name]-chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "react-redux/dist/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      jscolor: "util/jscolor.js"
    },
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["react"],
              plugins: ["transform-class-properties", "transform-object-rest-spread"]
            }
          },
          "ts-loader"
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react"],
          plugins: ["transform-class-properties", "transform-object-rest-spread"]
        }
      }
    ]
  },
  optimization: {
    //minimize: false
  },
  plugins: [
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    isProd ? new MinifyPlugin() : null,
    new SWPrecacheWebpackPlugin({
      mergeStaticsConfig: true,
      filename: "service-worker.js",
      importScripts: ["../sw-manual.js?v=6"],
      staticFileGlobs: [
        "static/bootstrap/css/bootstrap-booklist-build.css",
        "static/fontawesome/css/font-awesome-booklist-build.css",
        "static/fontawesome/fonts/fontawesome-webfont.woff2",
        "static/main-icon2.png",
        "util/babelHelpers.min.js",
        "offline.htm"
      ],
      ignoreUrlParametersMatching: /./,
      stripPrefixMulti: {
        "static/": "react-redux/static/",
        "util/": "react-redux/util/",
        "offline.htm": "react-redux/offline.htm"
      },
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?query=.+ALL_BOOKS_V_/, name: "book-search-graphql", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/images-na.ssl-images-amazon.com/, name: "amazon-images1" }),
        getCache({ pattern: /^https:\/\/ecx.images-amazon.com/, name: "amazon-images2" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
        getCache({ pattern: /book\/loadDetails/, name: "book-details" })
      ]
    })
  ].filter(p => p)
};
