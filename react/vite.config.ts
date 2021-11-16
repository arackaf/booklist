import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

import { dotEnvReplacement } from "./vite-plugins/dotenv-replace";

export default defineConfig({
  // resolve: {
  //   alias: {
  //     //topFile2: path.resolve("./topFile2.ts"),
  //     //app: path.resolve("./app")
  //   }
  // },
  plugins: [react(), dotEnvReplacement()]
});
