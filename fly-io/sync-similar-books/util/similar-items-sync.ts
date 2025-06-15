import { desc, isNull, InferSelectModel, not, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle-schema";
import { similarBooks } from "../drizzle/drizzle-schema";
import { ProcessImagesResponse } from "./process-images";

type SimilarBook = InferSelectModel<typeof similarBooks>;

export async function getSimilarBooksWithoutImages(db: NodePgDatabase<typeof schema>, count: number = 50): Promise<SimilarBook[]> {
  return db
    .select()
    .from(similarBooks)
    .where(not(isNull(similarBooks.unprocessedImage)))
    .orderBy(desc(similarBooks.id))
    .limit(count);
}

export async function updateSimilarBookImages(db: NodePgDatabase<typeof schema>, bookId: number, imageData: ProcessImagesResponse) {
  const updates: Partial<InferSelectModel<typeof schema.similarBooks>> = {};
  if (imageData.smallImage) {
    updates.smallImage = imageData.smallImage;
    updates.smallImagePreview = imageData.smallImagePreview;
  }
  if (imageData.mobileImage) {
    updates.mobileImage = imageData.mobileImage;
    updates.mobileImagePreview = imageData.mobileImagePreview;
  }
  updates.unprocessedImage = null;

  await db.update(schema.similarBooks).set(updates).where(eq(schema.similarBooks.id, bookId));
}
