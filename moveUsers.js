import { db, dynamo, getPutPacket, TABLE_NAME } from "./node/dataAccess/dynamoHelpers";
import connect from "./node/dataAccess/connect";

const pause = () => new Promise(res => setTimeout(res, 200));

const toDynamoUser = user => {
  const key = `User#${user.email}`;
  const { email, password, isPublic, publicName, publicBooksHeader, admin } = user;
  return {
    pk: key,
    sk: key,
    userId: user._id + "",
    email,
    password,
    isPublic,
    publicName,
    publicBooksHeader,
    admin
  };
};

(async function () {
  let mongoDb = await connect();
  let users = await mongoDb.collection("users").find({}).sort({ _id: 1 }).toArray();

  console.log(users.length);

  for (const user of users) {
    try {
      await db.put(getPutPacket(toDynamoUser(user)));
    } catch (er) {
      console.log("fail", er);
    }
    console.log(user.email, "written");
    await pause();
  }
})();
