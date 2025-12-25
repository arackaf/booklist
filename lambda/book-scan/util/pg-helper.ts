import pg from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { getSecrets } from "./getSecrets";

import * as schema from "../drizzle/drizzle-schema";

export async function initializePostgres() {
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

  return drizzlePg({ schema, client: pool });
}
