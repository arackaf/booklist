import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";

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
  plugins: [dotEnvReplacement(), react(), graphqlPlugin({ path: path.resolve(__dirname, "./extracted_queries.json") })],
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
