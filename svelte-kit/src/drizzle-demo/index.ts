import {
  and,
  desc,
  eq,
  exists,
  gt,
  inArray,
  like,
  lt,
  lte,
  or,
  sql,
  type SQLWrapper,
} from "drizzle-orm";

import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { MYSQL_CONNECTION_STRING_live } from "$env/static/private";

import {
  books,
  subjects,
  booksSubjects,
} from "../data/drizzle-schema";
import * as schema from "../data/drizzle-schema";

export const mySqlConnectionFactory = new Client({
  url: MYSQL_CONNECTION_STRING_live,
});

export const db = drizzle(mySqlConnectionFactory, { schema });

const userId = "573d1b97120426ef0078aa92";

export async function junk() {
  const author = "Stephen Jay Gould";

  const result = await db
    .select()
    .from(books)
    .where(
      and(
        eq(books.userId, userId),
        or(lt(books.pages, 150), like(books.authors, `%${author}%`)),
      ),
    )
    .orderBy(desc(books.id))
    .limit(10);

  // searchBooks({ author: "gould" });
  searchBooks({ subjects: [385, 1330] });

  //console.log({ result });
  //console.log(result.toSQL());

  // const result = await db
  //   .select()
  //   .from(books)
  //   .orderBy(desc(books.id))
  //   .limit(1);

  // result[0];
}

type SearchPacket = Partial<{
  title: string;
  author: string;
  maxPages: number;
  subjects?: number[];
}>;
async function searchBooks(args: SearchPacket) {
  const searchConditions: SQLWrapper[] = [];
  if (args.title) {
    searchConditions.push(like(books.title, `%${args.title}%`));
  }
  if (args.author) {
    searchConditions.push(
      sql`LOWER(${books.authors}->>"$") LIKE ${`%${args.author.toLowerCase()}%`}`,
    );
  }
  if (args.maxPages) {
    searchConditions.push(lte(books.pages, args.maxPages));
  }
  if (args.subjects?.length) {
    searchConditions.push(
      exists(
        db
          .select({ _: sql`1` })
          .from(booksSubjects)
          .where(
            and(
              eq(books.id, booksSubjects.book),
              inArray(booksSubjects.subject, args.subjects),
            ),
          ),
      ),
    );
  }

  const result = await db
    .select()
    .from(books)
    .where(and(eq(books.userId, userId), ...searchConditions))
    .orderBy(desc(books.id))
    .limit(10);
}

/*

  const result2 = await db
    .select({ id: books.id })
    .from(books)
    .orderBy(desc(books.id))
    .limit(1);

  console.log({ result });

*/
