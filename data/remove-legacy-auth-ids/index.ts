import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });

console.log(process.env.FLY_DB);
