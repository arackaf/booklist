import pg from "pg";
import { drizzle as drizzlePg, NodePgDatabase } from "drizzle-orm/node-postgres";
import { getSecrets } from "./getSecrets";

import * as schema from "../drizzle/drizzle-schema";

let db: PostgresDb;

export async function initializePostgres() {
  if (db) {
    return db;
  }

  const secrets = await getSecrets();
  const POSTGRES_CONNECTION_STRING = secrets["pscale-pg-connection"];

  const { Pool } = pg;

  const pool = new Pool({
    connectionString: POSTGRES_CONNECTION_STRING
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    return;
  });

  db = drizzlePg({ schema, client: pool });
  return db;
}

export type PostgresDb = Awaited<NodePgDatabase<typeof schema>>;
