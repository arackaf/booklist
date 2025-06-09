import pg from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle-schema";

const POSTGRES_CONNECTION_STRING = process.env.FLY_DB;

export function initializePostgres() {
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

  return { db, dispose };
}
