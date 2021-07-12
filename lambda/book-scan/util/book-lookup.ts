import { db, getPutPacket, TABLE_NAME } from "../../util/dynamoHelpers";
import { getBookLookupsFree, getScanItemBatch, ScanItem } from "./data-helpers";
import { getCurrentLookupFullKey } from "./key-helpers";

export const runBookLookupIfAble = async () => {
  const lookupsFree = await getBookLookupsFree();
  console.log("BOOK LOOKUP STATUS", JSON.stringify(lookupsFree));

  if (!lookupsFree.free0 && !lookupsFree.free1) {
    return;
  }

  if (lookupsFree.free0) {
    await doLookup(0);
  }
  if (lookupsFree.free1) {
    await doLookup(1);
  }
};

export const doLookup = async lookupIdx => {
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
