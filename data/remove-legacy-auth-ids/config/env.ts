import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

export const ENV = {
  FLY_DB: process.env.FLY_DB,
  DYNAMO_TABLE: process.env.DYNAMO_TABLE,
  AMAZON_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY,
  AMAZON_SECRET_KEY: process.env.AMAZON_SECRET_KEY
} as const;
