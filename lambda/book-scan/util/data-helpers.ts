import { db, getGetPacket, getQueryPacket, getUpdatePacket } from "./dynamoHelpers";
import { getScanItemPk, getUserScanStatusKey } from "./key-helpers";

export const getPendingCount = async (userId, consistentRead = false) => {
  const scanStatusKey = getUserScanStatusKey(userId);
  const status = await db.get(getGetPacket(scanStatusKey, scanStatusKey, { ConsistentRead: consistentRead }));
  return status?.pendingCount ?? 0;
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
