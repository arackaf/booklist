import pg from "pg";

import { env } from "$env/dynamic/private";

import type { PgDatabase } from "drizzle-orm/pg-core";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./drizzle-schema";

import { building } from "$app/environment";

export let db: PgDatabase<any, any>;

if (building) {
  db = drizzlePg.mock({ schema });
} else {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: env.FLY_DB
  });

  db = drizzlePg({ schema, client: pool });
}

export type SubjectEditFields = {
  name: string;
  path: string | null;
  parentId: number | null;
  originalParentId: string | null;
  textColor: string;
  backgroundColor: string;
};

export const executeDrizzle = async <T>(description: string, command: Promise<T>): Promise<T> => {
  const start = +new Date();

  const result = await command;

  const end = +new Date();
  console.log(description, "latency:", end - start);

  return result;
};
