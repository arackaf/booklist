import { defineConfig } from "vite";

import path from "path";
import graphqlPlugin from "./vite-plugins/graphql-plugin";

export default defineConfig({
  build: {
    outDir: "./public",
    lib: {
      entry: "./service-worker/src/index.ts",
      formats: ["cjs"],
      fileName: x => "sw-index-bundle.js"
    }
  },
  plugins: [graphqlPlugin({ path: path.resolve(__dirname, "./extracted_queries.json") })]
});
