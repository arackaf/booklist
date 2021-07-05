import { db, dynamo, getPutPacket, TABLE_NAME } from "./node/dataAccess/dynamoHelpers";
import { getDbAndClient } from "./node/dataAccess/connect";

const pause = () => new Promise(res => setTimeout(res, 100));

export const getUpdatePacket = (pk, sk, rest) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

(async function () {
  let res = await dynamo
    .scan({
      TableName: "My_Library_live"
    })
    .promise();

  console.log(res.Items.length, res.LastEvaluatedKey);

  for (const userMaybe of res.Items) {
    if (!userMaybe.pk.startsWith("User#")) {
      console.log("Skipping", userMaybe.pk);
      continue;
    }
    try {
      const { pk, sk } = userMaybe;
      await db.update(
        getUpdatePacket(pk, sk, {
          UpdateExpression: "set gsiUserLookupPk = :userId",
          ExpressionAttributeValues: { ":userId": userMaybe.userId }
        })
      );
      console.log(userMaybe.pk, "UPDATED");
    } catch (er) {
      console.log("fail", er);
    }

    await pause();
  }
})();
