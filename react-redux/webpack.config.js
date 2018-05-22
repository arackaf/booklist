var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");
var path = require("path");
const isProd = process.env.NODE_ENV == "production";

const { GenerateSW } = require("workbox-webpack-plugin");

const getCache = ({ name, pattern, expires, maxEntries }) => ({
  urlPattern: pattern,
  handler: "cacheFirst",
  options: {
    cacheName: name,
    expiration: {
      maxEntries: maxEntries || 500,
      maxAgeSeconds: expires || 60 * 60 * 24 * 365 * 2 //2 years
    },
    cacheableResponse: {
      statuses: [0, 200]
    }
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
              presets: ["@babel/preset-react"],
              plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread"]
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
          presets: ["@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread"]
        }
      }
    ]
  },
  optimization: {
    //minimize: false
  },
  plugins: [
    new GenerateSW({
      globDirectory: ".",
      globPatterns: [
        "static/bootstrap/css/bootstrap-booklist-build.css",
        "static/fontawesome/css/font-awesome-booklist-build.css",
        "static/fontawesome/fonts/fontawesome-webfont.woff2",
        "static/main-icon2.png",
        "offline.htm",
        "node_modules/simple-react-bootstrap/simple-react-bootstrap-styles.css"
      ],
      globIgnores: [],
      modifyUrlPrefix: {
        "static/": "react-redux/static/",
        "util/": "react-redux/util/",
        "offline.htm": "react-redux/offline.htm",
        "node_modules/": "react-redux/node_modules"
      },
      ignoreUrlParametersMatching: [/./],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?query=.+ALL_BOOKS_V_/, name: "book-search-graphql", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?query=.+GetBookDetails/, name: "book-details" }),
        getCache({ pattern: /^https:\/\/images-na.ssl-images-amazon.com/, name: "amazon-images1" }),
        getCache({ pattern: /^https:\/\/ecx.images-amazon.com/, name: "amazon-images2" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" })
      ]
    }),
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    isProd ? new MinifyPlugin() : null
  ].filter(p => p)
};
