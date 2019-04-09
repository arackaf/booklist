import { MongoClient, ObjectId } from "mongodb";

const dbName = process.env.IS_PUBLIC ? process.env.DB_NAME_PUBLIC : process.env.DB_NAME;
const connString = process.env.IS_PUBLIC ? process.env.MONGO_PUBLIC : process.env.MONGO_CONNECTION;

export async function getDbConnection() {
  let client = await MongoClient.connect(connString, { useNewUrlParser: true });
  let db = await client.db(dbName);

  return { client, db };
}
