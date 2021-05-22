import { MongoClient, ObjectID } from "mongodb";
import getConnection from "./getDbConnection";

const client = getConnection();

export default async function checkLoginToken(userId, loginToken) {
  if (process.env.STAGE == "dev" || process.env.stage == "dev") {
    return true;
  }

  const db = await client;
  try {
    const loggedInUser = await db.collection("users").findOne({ _id: ObjectID(userId), loginToken });

    return !!loggedInUser;
  } catch (er) {
    return false;
  }
}
