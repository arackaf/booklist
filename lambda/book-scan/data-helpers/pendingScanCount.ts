import { db, getGetPacket } from "../../util/dynamoHelpers";
import { getUserScanStatusKey } from "../scan-helpers";

export const getPendingCount = async (userId, consistentRead = false) => {
  const scanStatusKey = getUserScanStatusKey(userId);
  const status = await db.get(getGetPacket(scanStatusKey, scanStatusKey, { ConsistentRead: consistentRead }));
  return status?.pendingCount ?? 0;
};
