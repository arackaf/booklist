import { and, count, eq, or } from "drizzle-orm";
import { bookScans } from "../drizzle/drizzle-schema";
import { db, getQueryPacket, getUpdatePacket } from "./dynamoHelpers";
import { getScanItemPk, getUserScanStatusKey } from "./key-helpers";
import { initializePostgres } from "./pg-helper";

export const getPendingCount = async userId => {
  const db = await initializePostgres();

  const pendingCount = await db
    .select({ count: count() })
    .from(bookScans)
    .where(and(eq(bookScans.status, "PENDING"), eq(bookScans.userId, userId)));

  return pendingCount[0].count;
};

export const getStatusCountUpdate = (userId, amount) => {
  const key = getUserScanStatusKey(userId);

  return getUpdatePacket(key, key, {
    UpdateExpression: "ADD #pendingCount :amount",
    ExpressionAttributeValues: { ":amount": amount },
    ExpressionAttributeNames: { "#pendingCount": "pendingCount" }
  });
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
  pk;
  sk;
  userId;
  isbn;
};

export const getScanItemBatch = async () => {
  const result = (await db.query(
    getQueryPacket(` pk = :pk `, {
      ExpressionAttributeValues: { ":pk": getScanItemPk() },
      Limit: 10,
      ConsistentRead: true
    })
  )) as ScanItem[];

  return result;
};
