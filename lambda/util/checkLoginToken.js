import { MongoClient, ObjectID } from "mongodb";
import getConnection from "./getDbConnection";

const client = getConnection();

export default async function checkLoginToken(userId, loginToken) {
  const db = await client;
  if (process.env.STAGE == "dev") {
    return true;
  }

  try {
    const loggedInUser = await db.collection("users").findOne({ _id: ObjectID(userId), loginToken });

    return !!loggedInUser;
  } catch (er) {
    return false;
  }
}
