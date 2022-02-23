import { defineConfig } from "vite";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
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
  base: isProduction ? process.env.SVELTE_CDN : "",
  resolve: {
    alias: {
      "graphql-typings": path.resolve("./graphql-typings.ts"),
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
    svelte({ onwarn() {} }),
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
        modifyURLPrefix: { "assets/": (isProduction ? process.env.SVELTE_CDN : "") + "/assets/" }
      }
    })
  ],
  server: {
    port: 3003,
    //hmr: false,
    proxy: {
      "/graphql": "http://svelte.lvh.me:3001"
    }
  }
});