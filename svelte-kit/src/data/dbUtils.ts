import pg from "pg";

import type { PgDatabase } from "drizzle-orm/pg-core";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./drizzle-schema";

export let db: PgDatabase<any, any>;

type InitializeProps = {
  useMockDb?: boolean;
  connectionString: string;
};
export function initialize(props: InitializeProps) {
  const { useMockDb, connectionString } = props;

  if (useMockDb) {
    db = drizzlePg.mock({ schema });
  } else {
    const { Pool } = pg;

    const pool = new Pool({
      connectionString: connectionString
    });

    pool.on("error", (err, client) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });

    db = drizzlePg({ schema, client: pool });
  }
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
