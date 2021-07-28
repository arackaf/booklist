import { db, getDeletePacket, getPutPacket, getUpdatePacket, TABLE_NAME } from "../../util/dynamoHelpers";
import { getBookLookupsFree, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getCurrentLookupFullKey, getUserScanStatusKey } from "./key-helpers";

type BookLookupPacket = {
  pk: string;
  sk: string;
  scanItems: ScanItem[];
};

export const runBookLookupIfAble = async () => {
  const lookupsFree = await getBookLookupsFree();
  console.log("BOOK LOOKUP STATUS", JSON.stringify(lookupsFree));

  if (!lookupsFree.free0 && !lookupsFree.free1) {
    return;
  }

  if (lookupsFree.free0) {
    await setupLookup(0);
  }
  if (lookupsFree.free1) {
    await setupLookup(1);
  }
};

export const setupLookup = async lookupIdx => {
  const [pk, sk] = getCurrentLookupFullKey(lookupIdx);
  const scanItems: ScanItem[] = await getScanItemBatch();

  if (!scanItems.length) {
    console.log("No scan items remaining");
    return;
  }

  await db.transactWrite({
    TransactItems: [
      ...scanItems.map(({ pk, sk }) => ({
        Delete: {
          Key: { pk, sk },
          TableName: TABLE_NAME
        }
      })),
      {
        Put: getPutPacket({
          pk,
          sk,
          scanItems
        })
      }
    ]
  });
};

export const doLookup = async (scanPacket: BookLookupPacket) => {
  const scanItems: ScanItem[] = scanPacket.scanItems;

  const userUpdateMap = scanItems.reduce((hash, { userId }) => {
    if (!hash.hasOwnProperty(userId)) {
      hash[userId] = 0;
    }
    hash[userId]--;
    return hash;
  }, {});

  await db.transactWrite({
    TransactItems: [
      {
        Delete: getDeletePacket({ pk: scanPacket.pk, sk: scanPacket.sk })
      },
      ...Object.entries(userUpdateMap).map(([userId, amount]) => {
        return {
          Update: getStatusCountUpdate(userId, amount)
        };
      })
    ]
  });
};
