import { defineConfig } from "vite";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const getCache = ({ name, pattern }: any) => ({
  urlPattern: pattern,
  handler: "CacheFirst" as const,
  options: {
    matchOptions: {
      ignoreVary: true
    },
    cacheName: name,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 365 * 2 //2 years
    },
    cacheableResponse: {
      statuses: [200]
    }
  }
});

export default defineConfig({
  base: isProduction ? process.env.REACT_CDN : "",
  build: {
    manifest: true
  },
  resolve: {
    alias: {
      reactStartup: path.resolve("./reactStartup.ts"),
      jscolor: path.resolve("./util/jscolor.js"),
      app: path.resolve("./app"),
      css: path.resolve("./css"),
      graphQL: path.resolve("./graphQL"),
      modules: path.resolve("./modules"),
      util: path.resolve("./util")
    }
  },
  plugins: [
    dotEnvReplacement(),
    react(),
    graphqlPlugin({ path: "./extracted_queries.json" }),
    VitePWA({
      base: "/",
      filename: "service-worker.js",
      workbox: {
        importScripts: ["sw-index-bundle.js"],
        runtimeCaching: [
          getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
          getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" }),
          getCache({ pattern: /.*\.(eot|woff|woff2|ttf)$/, name: "fonts" }),
          getCache({ pattern: /.*\.svg$/, name: "svg" })
        ],
        modifyURLPrefix: { "assets/": (isProduction ? process.env.REACT_CDN : "") + "/assets/" }
      }
    })
  ],
  server: {
    port: 3002,
    proxy: {
      "/graphql": "http://localhost:3001",
      "/auth": "http://localhost:3001"
    }
    //hmr: false,
  }
});
