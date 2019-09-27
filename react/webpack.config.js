const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { GenerateSW } = require("workbox-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV == "production";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserPlugin = require("terser-webpack-plugin");

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
    publicPath: "/react/dist/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "react-autosuggest$": "app/components/react-autosuggest-styled.tsx",
      jscolor: "util/jscolor.js"
    },
    modules: [path.resolve("./"), path.resolve("./node_modules")]
  },
  mode: isProd ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
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
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [MiniCssExtractPlugin.loader, { loader: "css-loader", options: { modules: true, exportOnlyLocals: false } }, "sass-loader"]
          },
          {
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          }
        ]
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
    new HtmlWebpackPlugin({ template: "default.htm" }),
    new MiniCssExtractPlugin({ filename: isProd ? "[name]-[contenthash].css" : "[name].css" }),
    new GenerateSW({
      ignoreURLParametersMatching: [/./],
      exclude: [/\.(ttf|eot|svg|woff)$/],
      navigateFallback: "react/dist/index.html",
      navigateFallbackBlacklist: [/\/activate\b/],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:1/, name: "short-cache", expires: 60 * 5 }), //5 minutes
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:5/, name: "medium-cache", expires: 60 * 60 * 24 }), //1 day
        getCache({ pattern: /^https:\/\/mylibrary\.io\/graphql\?.+cache%22:9/, name: "max-cache" }),
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
        getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" })
      ],
      importScripts: ["react/sw-manual/sw-index-bundle.js"]
    })
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
