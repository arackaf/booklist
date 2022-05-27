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
  base: "",
  build: {
    manifest: true
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
          getCache({ pattern: /^https:\/\/d193qjyckdxivp.cloudfront.net\/bookCovers/i, name: "images" }),
          getCache({ pattern: /.*\.(eot|woff|woff2|ttf)$/, name: "fonts" }),
          getCache({ pattern: /.*\.svg$/, name: "svg" })
        ]
      }
    })
  ],
  server: {
    port: 3002,
    proxy: {
      "/graphql": "http://localhost:3001",
      "/auth": "http://localhost:3001",
      "/graphql-ios": "http://localhost:3001",
      "/login-ios": "http://localhost:3001"
    }
    //hmr: false,
  }
});
