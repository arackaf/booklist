const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
    filename: isProd ? "[name]-bundle-[contenthash].js" : "[name]-bundle.js",
    chunkFilename: isProd ? "[name]-chunk-[contenthash].js" : "[name]-chunk.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/react-redux/dist/"
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
              plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-syntax-dynamic-import"]
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
          plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-syntax-dynamic-import"]
        }
      },
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
  plugins: [
    new HtmlWebpackPlugin({ template: "default.htm" }),
    new GenerateSW({
      clientsClaim: true,
      navigateFallback: "react-redux/dist/index.html",
      globDirectory: ".",
      globPatterns: [
        "static/bootstrap/css/bootstrap-booklist-build.css",
        "static/fontawesome/css/font-awesome-booklist-build.css",
        "static/main-icon2.png",
        "offline.htm",
        "node_modules/simple-react-bootstrap/simple-react-bootstrap-styles.css",
        "node_modules/@reach/dialog/styles.css"
      ],
      globIgnores: [],
      modifyUrlPrefix: {
        "static/": "react-redux/static/",
        "util/": "react-redux/util/",
        "offline.htm": "react-redux/offline.htm",
        "node_modules/": "react-redux/node_modules/"
      },
      ignoreUrlParametersMatching: [/./],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?query=.+bookSearchVersion/, name: "book-search-graphql", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?query=.+isBookDetails/, name: "book-details" }),
        getCache({ pattern: /^https:\/\/images-na.ssl-images-amazon.com/, name: "amazon-images1" }),
        getCache({ pattern: /^https:\/\/ecx.images-amazon.com/, name: "amazon-images2" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
        getCache({ pattern: /fontawesome\/webfonts/, name: "fontawesome-fonts" })
      ],
      importScripts: ["react-redux/sw-manual.js"]
    }),
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    isProd ? new MinifyPlugin() : null
  ].filter(p => p)
};
