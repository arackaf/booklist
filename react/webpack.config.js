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
      "react-autosuggest$": "app/components/ui/react-autosuggest-styled.tsx",
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
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-nullish-coalescing-operator"
          ]
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
    new HtmlWebpackPlugin({ template: "default.htm" }),
    new MiniCssExtractPlugin({ filename: isProd ? "[name]-[contenthash].css" : "[name].css" }),
    new GenerateSW({
      ignoreURLParametersMatching: [/./],
      exclude: [/\.(ttf|eot|svg|woff)$/],
      navigateFallback: "react/dist/index.html",
      navigateFallbackDenylist: [/\/(activate|graphql|graphql-public)\b/],
      runtimeCaching: [
        getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
        getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" })
      ],
      importScripts: ["/react/service-worker/sw-index-bundle.js"]
    }),
    new Dotenv(isProd ? { systemvars: true } : { path: "./.env.dev" }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      //exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      //include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      //allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      //cwd: process.cwd(),
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
