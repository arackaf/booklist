import { getPendingCount, getStatusCountUpdate } from "../util/data-helpers";
import { getScanItemKey } from "../util/key-helpers";
import { sendWsMessageToUser } from "../util/ws-helpers";

import { db, getPutPacket } from "../util/dynamoHelpers";

export const handler = async event => {
  try {
    const { userId = "", isbn } = event;
    const [pk, sk] = getScanItemKey();

    await db.transactWrite({
      TransactItems: [
        {
          Put: getPutPacket({ pk, sk, isbn, userId })
        },
        {
          Update: getStatusCountUpdate(userId, 1)
        }
      ]
    });

    const pendingCount = await getPendingCount(userId, true);
    await sendWsMessageToUser(userId, { type: "bookQueued", pendingCount });

    return { success: true, pendingCount };
  } catch (err) {
    console.log("ERROR", err);

    return { success: false, err };
  }
};
