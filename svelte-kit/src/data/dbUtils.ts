import { Client, type Transaction, type ExecutedQuery, type Connection } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "$env/dynamic/private";
const { MYSQL_CONNECTION_STRING, MYSQL_RDS_CONNECTION_STRING, FLY_DB } = env;

import * as schema from "./drizzle-schema";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
import type { SQL } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

import pg from "pg";

import { drizzle as drizzleMySql } from "drizzle-orm/mysql2";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import { building } from "$app/environment";

export let mySqlConnectionFactory = null as any;
export let dbMySql: ReturnType<typeof drizzleMySql> = null as any;
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

type ExtractTypeFromMySqlColumn<T extends MySqlColumn> =
  T extends MySqlColumn<infer U> ? (U extends { notNull: true } ? U["data"] : U["data"] | null) : never;

type ExtractSqlType<T> = T extends MySqlColumn ? ExtractTypeFromMySqlColumn<T> : T extends SQL.Aliased<infer V> ? V : never;
export type InferSelection<T> = {
  [K in keyof T]: ExtractSqlType<T[K]>;
};

export type TransactionItem = (tx: Transaction, previous: null | ExecutedQuery) => Promise<ExecutedQuery | ExecutedQuery[]>;

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
