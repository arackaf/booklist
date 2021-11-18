import { defineConfig } from "vite";

import path from "path";
import graphqlPlugin from "./vite-plugins/graphql-plugin";

export default defineConfig({
  build: {
    outDir: "./public",
    lib: {
      entry: "./service-worker/src/index.ts",
      formats: ["cjs"],
      fileName: () => "sw-index-bundle.js"
    },
    watch: { skipWrite: false }
  },
  plugins: [graphqlPlugin({ path: "./extracted_queries.json" })]
});
