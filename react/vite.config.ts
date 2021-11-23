import { defineConfig } from "vite";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import path from "path";

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
      filename: "service-worker.js",
      workbox: {
        importScripts: ["sw-index-bundle.js"],
        runtimeCaching: [
          getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
          getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" }),
          getCache({ pattern: /.*\.(eot|woff|woff2|ttf)$/, name: "fonts" }),
          getCache({ pattern: /.*\.svg$/, name: "svg" })
        ]
      }
    })
  ],
  server: {
    //hmr: false,
    proxy: {
      "/graphql": "http://localhost:3001",
      "/auth/login": "http://localhost:3001",
      "/auth/logout": "http://localhost:3001",
      "/auth/createUser": "http://localhost:3001",
      "/auth/resetPassword": "http://localhost:3001"
    }
  }
});
