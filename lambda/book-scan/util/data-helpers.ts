import { and, asc, count, eq, inArray, or } from "drizzle-orm";
import { bookScans } from "../drizzle/drizzle-schema";

import { initializePostgres } from "./pg-helper";

export const getPendingCount = async userId => {
  const db = await initializePostgres();

  const pendingCount = await db
    .select({ count: count() })
    .from(bookScans)
    .where(and(eq(bookScans.status, "PENDING"), eq(bookScans.userId, userId)));

  return pendingCount[0].count;
};

export type LookupSlotsFree = {
  free0: boolean;
  free1: boolean;
};

const allFree: LookupSlotsFree = {
  free0: true,
  free1: true
};

export type ScanItem = {
  id: number;
  userId: string;
  isbn: string;
};

export const getScanItemBatch = async (): Promise<ScanItem[]> => {
  const db = await initializePostgres();

  const result = await db.transaction(async tx => {
    const result: ScanItem[] = await tx.select().from(bookScans).where(eq(bookScans.status, "PENDING")).orderBy(asc(bookScans.dateAdded)).limit(10);

    await tx
      .update(bookScans)
      .set({ status: "RUNNING" })
      .where(
        inArray(
          bookScans.id,
          result.map(item => item.id)
        )
      );

    return result;
  });

  return result;
};
