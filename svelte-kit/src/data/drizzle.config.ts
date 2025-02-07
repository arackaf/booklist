import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./drizzle-schema.ts"],
  dbCredentials: {
    database: "my-library",
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "aNLNhqFr7T8gfjJ",
    ssl: false
  }
});
