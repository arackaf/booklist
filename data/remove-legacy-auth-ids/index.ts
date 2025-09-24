import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

declare const process: {
  env: Record<string, string>;
};

console.log(process.env.FLY_DB);
