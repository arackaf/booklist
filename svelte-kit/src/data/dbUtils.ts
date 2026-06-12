import pg from "pg";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

export const getDbObject = (connectionString: string) => {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: connectionString
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  return drizzlePg({ client: pool });
};

export type DB = ReturnType<typeof getDbObject>;

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
