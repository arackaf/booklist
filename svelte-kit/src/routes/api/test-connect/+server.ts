import { json } from "@sveltejs/kit";

import pg from "pg";
import { env } from "$env/dynamic/private";

const { Pool } = pg;

export async function GET() {
  const start = +new Date();

  const pool = new Pool({
    connectionString: env.FLY_DB
  });

  const db = await pool.connect();
  const end = +new Date();

  const latency = end - start;

  const queryStart = +new Date();
  const res = await db.query("SELECT title FROM books ORDER BY id ASC LIMIT 1");
  const queryEnd = +new Date();
  const rows = res.rows;

  db.release();
  pool.end();

  return json({
    connectionLatency: latency,
    queryLatency: queryEnd - queryStart,
    rows
  });
}
