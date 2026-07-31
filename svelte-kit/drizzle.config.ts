/// <reference types="node" />

import { defineConfig } from "drizzle-kit";

const connectionString = process.env.PSCALE_URL_PROD!;

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString
  },
  out: "./src/drizzle"
});
