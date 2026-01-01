import dotenv from "dotenv";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}

dotenv.config({ path: ".env.local", quiet: true });

export const ENV = {
  DYNAMO_TABLE: process.env.DYNAMO_TABLE!,
  PG: process.env.PG!,
  AWS_ACCESS_KEY: process.env.AMAZON_ACCESS_KEY!,
  AWS_SECRET_KEY: process.env.AMAZON_SECRET_KEY!
} as const;
