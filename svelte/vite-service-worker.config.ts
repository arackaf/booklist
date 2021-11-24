import { defineConfig } from "vite";

import graphqlPlugin from "./vite-plugins/graphql-plugin";

export default defineConfig({
  build: {
    outDir: "./public",
    lib: {
      entry: "./service-worker/src/index.ts",
      formats: ["cjs"],
      fileName: () => "sw-index-bundle.js"
    }
  },
  plugins: [graphqlPlugin({ path: "./extracted_queries.json" })]
});
