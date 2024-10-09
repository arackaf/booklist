import { Client, type Transaction, type ExecutedQuery, type Connection } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "$env/dynamic/private";
const { MYSQL_CONNECTION_STRING, MYSQL_RDS_CONNECTION_STRING } = env;

import * as schema from "./drizzle-schema";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
import type { SQL } from "drizzle-orm";

import { drizzle as drizzleMySql } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

console.log("\n\n--------------------------------------------\n\n");
console.log("Connection string", MYSQL_RDS_CONNECTION_STRING);
console.log("Connection string process.env", process.env);
console.log("Connection string process.env.MYSQL_RDS_CONNECTION_STRING", process.env.MYSQL_RDS_CONNECTION_STRING);
console.log("\n\n--------------------------------------------\n\n");
const rdsConnection = await mysql.createConnection({
  uri: MYSQL_RDS_CONNECTION_STRING
});

export const mySqlConnectionFactory = new Client({
  url: MYSQL_CONNECTION_STRING
});

//export const db = drizzle(mySqlConnectionFactory, { schema });
export const db = drizzleMySql(rdsConnection, { schema, mode: "default" });

type ExtractTypeFromMySqlColumn<T extends MySqlColumn> =
  T extends MySqlColumn<infer U> ? (U extends { notNull: true } ? U["data"] : U["data"] | null) : never;

type ExtractSqlType<T> = T extends MySqlColumn ? ExtractTypeFromMySqlColumn<T> : T extends SQL.Aliased<infer V> ? V : never;
export type InferSelection<T> = {
  [K in keyof T]: ExtractSqlType<T[K]>;
};

export type TransactionItem = (tx: Transaction, previous: null | ExecutedQuery) => Promise<ExecutedQuery | ExecutedQuery[]>;

export const executeSQLRaw = async (description: string, sql: string, args: any[] = []): ReturnType<Connection["execute"]> => {
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

export const runTransaction = async (description: string, ...ops: TransactionItem[]): ReturnType<Connection["transaction"]> => {
  const start = +new Date();
  const conn = mySqlConnectionFactory.connection();

  const result = await conn.transaction(async tx => {
    const transactionItems: ExecutedQuery[] = [];
    for (const op of ops) {
      const result = await op(tx, transactionItems.length ? (transactionItems.at(-1) as ExecutedQuery) : null);

      if (Array.isArray(result)) {
        transactionItems.push(...result);
      } else {
        transactionItems.push(result);
      }
    }

    return transactionItems;
  });
  const end = +new Date();
  console.log("Transaction:", description, end - start);

  return result;
};

export type SubjectEditFields = {
  name: string;
  path: string | null;
  parentId: number | null;
  originalParentId: string | null;
  textColor: string;
  backgroundColor: string;
};

export const getInsertLists = (lists: any[]) => Array.from({ length: lists.length }, () => "(?)").join(", ");

export const executeDrizzle = async <T>(description: string, command: Promise<T>): Promise<T> => {
  const start = +new Date();

  const result = await command;

  const end = +new Date();
  console.log(description, "latency:", end - start);

  return result;
};
