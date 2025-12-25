import { getPendingCount } from "../util/data-helpers";
import { sendWsMessageToUser } from "../util/ws-helpers";

import { db, getPutPacket } from "../util/dynamoHelpers";
import { bookScans } from "../drizzle/drizzle-schema";
import { initializePostgres } from "../util/pg-helper";

export const handler = async event => {
  try {
    const { userId = "", isbn } = event;

    const db = await initializePostgres();
    await db.insert(bookScans).values({ userId, isbn, status: "PENDING" });

    const pendingCount = await getPendingCount(userId);
    await sendWsMessageToUser(userId, { type: "bookQueued", pendingCount });

    return { success: true, pendingCount };
  } catch (err) {
    console.log("ERROR", err);

    return { success: false, err };
  }
};
