import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";
import { generateSW } from "rollup-plugin-workbox";
import { VitePWA } from "vite-plugin-pwa";

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
      jscolor: path.resolve(__dirname, "./util/jscolor.js"),
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
    graphqlPlugin({ path: path.resolve(__dirname, "./extracted_queries.json") }),
    VitePWA({
      workbox: {
        importScripts: ["foo-bar.js"]
      }
    })
    // generateSW({
    //   swDest: "dist/assets/service-worker.js",
    //   globDirectory: "dist/assets",
    //   //ignoreURLParametersMatching: [/./],
    //   navigateFallback: "index.html",
    //   additionalManifestEntries: ["index.html"],
    //   navigateFallbackDenylist: [/\/(activate|graphql|graphql-public)\b/],
    //   runtimeCaching: [
    //     getCache({ pattern: /^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, name: "local-images1" }),
    //     getCache({ pattern: /^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, name: "local-images2" })
    //   ],
    //   importScripts: ["sw-index-bundle.js"]
    // })
  ],
  server: {
    proxy: {
      "/graphql": "http://localhost:3001",
      "/auth/login": "http://localhost:3001",
      "/auth/logout": "http://localhost:3001",
      "/auth/createUser": "http://localhost:3001",
      "/auth/resetPassword": "http://localhost:3001"
    }
  }
});
