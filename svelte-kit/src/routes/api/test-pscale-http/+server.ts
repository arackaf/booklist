import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

import { neon, neonConfig } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { books } from "$data/drizzle-schema";
import { eq, sql } from "drizzle-orm";

const { PSCALE_PROD_HOST, PSCALE_PROD_PORT, PSCALE_PROD_DATABASE_NAME, PSCALE_PROD_USERNAME, PSCALE_PROD_PW } = env;

const DATABASE_URL = `postgresql://${PSCALE_PROD_USERNAME}:${PSCALE_PROD_PW}@${PSCALE_PROD_HOST}:${PSCALE_PROD_PORT}/${PSCALE_PROD_DATABASE_NAME}`;

const db = drizzle(DATABASE_URL + "?sslmode=verify-full");

// This MUST be set for PlanetScale Postgres connections
neonConfig.fetchEndpoint = host => `https://${PSCALE_PROD_HOST}/sql`;

export async function GET() {
  const neonSql = neon(DATABASE_URL);
  const id = 2323;
  const id2 = 2326;

  const dbHttp = drizzleNeonHttp({ client: neonSql });

  const bookHttp = await dbHttp.select().from(books).where(eq(books.id, id));
  console.log({ bookHttp: bookHttp[0].title });

  // const bookNonHttp = await db.select().from(books).where(eq(books.id, id));
  // console.log({ bookNonHttp });

  // const books = await dbHttp.execute(sql`SELECT * FROM books WHERE id = ${id} LIMIT 10`);
  // console.log("A");
  // const books = await dbHttp.execute(sql`
  // BEGIN;

  // UPDATE books SET title = 'S' WHERE id = ${id};
  // UPDATE books SET title = 'D' WHERE id = ${id2};

  // COMMIT;`);
  // console.log({ books });

  try {
    // db.transaction(async tx => {
    //   const book = await tx.select().from(books).where(eq(books.id, id));
    //   await tx
    //     .update(books)
    //     .set({ title: book[0].title + " A" })
    //     .where(eq(books.id, id));
    //   const bookUpdated = await tx.select().from(books).where(eq(books.id, id));
    //   const book2 = await tx.select().from(books).where(eq(books.id, id2));
    //   await tx
    //     .update(books)
    //     .set({ title: book2[0].title + " " + bookUpdated[0].title })
    //     .where(eq(books.id, id2));
    //   console.log("DONE");
    // });
  } catch (error) {
    console.error({ error });
  }

  // try {
  //   const books = await sql`SELECT * FROM books WHERE id = ${id} LIMIT 10`;
  //   console.log({ books });
  // } catch (error) {
  //   console.error({ error });
  // }

  // try {
  //   sql.transaction(tx => {
  //     const books = tx`SELECT * FROM books WHERE id = ${id} LIMIT 10`;

  //     return [books];
  //   });
  // } catch (error) {}

  return json({
    message: "Hello World"
  });
}
