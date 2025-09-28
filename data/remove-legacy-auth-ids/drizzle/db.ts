import "../config/env.js"; // Initialize dotenv before anything else
import pg from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./drizzle-schema.js";
import { ENV } from "../config/env.js";

console.log({ CONN: ENV.FLY_DB });

const POSTGRES_CONNECTION_STRING = ENV.FLY_DB;

const { Pool } = pg;

const pool = new Pool({
  connectionString: POSTGRES_CONNECTION_STRING
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const db = drizzlePg({ schema, client: pool });
const dispose = () => {
  pool.end();
};

export { db as postgresDb, dispose };
export { pool };
