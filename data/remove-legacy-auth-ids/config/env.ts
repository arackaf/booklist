import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

export const ENV = {
  FLY_DB: process.env.FLY_DB
} as const;
