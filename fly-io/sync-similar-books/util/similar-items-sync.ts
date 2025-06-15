import { desc, isNull, InferSelectModel, not } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle-schema";
import { similarBooks } from "../drizzle/drizzle-schema";

type SimilarBook = InferSelectModel<typeof similarBooks>;

export async function getSimilarBooksWithoutImages(db: NodePgDatabase<typeof schema>, count: number = 50): Promise<SimilarBook[]> {
  return db
    .select()
    .from(similarBooks)
    .where(not(isNull(similarBooks.unprocessedImage)))
    .orderBy(desc(similarBooks.id))
    .limit(count);
}
