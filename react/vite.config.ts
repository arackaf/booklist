import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";
import graphqlPlugin from "./vite-plugins/graphql-plugin";

export default defineConfig({
  resolve: {
    alias: {
      reactStartup: path.resolve("./reactStartup.ts"),
      util: path.resolve("./util")
    }
  },
  plugins: [dotEnvReplacement(), react(), graphqlPlugin({ path: path.resolve(__dirname, "./extracted_queries.json") })]
});
