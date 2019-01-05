const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
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
    //minimize: false
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "default.htm" }),
    new MiniCssExtractPlugin({ filename: isProd ? "[name]-[contenthash].css" : "[name].css" }),
    new GenerateSW({
      ignoreUrlParametersMatching: [/./],
      exclude: [/\.(ttf|eot|svg|woff)$/],
      navigateFallback: "react-redux/dist/index.html",
      navigateFallbackBlacklist: [/\/activate\b/],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:1/, name: "short-cache", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:5/, name: "medium-cache", expires: 60 * 60 * 24 }), //1 day
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:9/, name: "max-cache" }),
        getCache({ pattern: /react-redux\/static\//, name: "local-static" }),
        getCache({ pattern: /^https:\/\/images-na.ssl-images-amazon.com/, name: "amazon-images1" }),
        getCache({ pattern: /^https:\/\/ecx.images-amazon.com/, name: "amazon-images2" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" })
      ],
      importScripts: ["react-redux/sw-manual/sw-index-bundle.js"]
    }),
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    isProd ? new MinifyPlugin() : null
  ].filter(p => p)
};
