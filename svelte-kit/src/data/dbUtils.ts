import { Client, type Connection } from "@planetscale/database";
import { env } from "$env/dynamic/private";
const { MYSQL_CONNECTION_STRING } = env;

import * as schema from "./drizzle-schema";

import type { PgDatabase } from "drizzle-orm/pg-core";

import pg from "pg";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import { building } from "$app/environment";

export let mySqlConnectionFactory = null as any;
export let db: PgDatabase<any, any>;

if (building) {
  db = drizzlePg.mock({ schema });
} else {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: env.FLY_DB
  });

  db = drizzlePg({ schema, client: pool });

  mySqlConnectionFactory = new Client({
    url: MYSQL_CONNECTION_STRING
  });
}

const executeSQLRaw = async (description: string, sql: string, args: any[] = []): ReturnType<Connection["execute"]> => {
  const start = +new Date();
  const conn = mySqlConnectionFactory.connection();

  const result = await conn.execute(sql, args);

  const end = +new Date();
  console.log(description, "latency:", end - start, "query time:", result.time.toFixed(1));

  return result;
};

export const executeQuery = async <T = unknown>(description: string, sql: string, args: any[] = []): Promise<T[]> => {
  const resultRaw = await executeSQLRaw("Query: " + description, sql, args);
  return resultRaw.rows as T[];
};

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
