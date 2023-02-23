const { MongoClient } = require("mongodb");

const dotenv = require("dotenv");
dotenv.config();

const userIdToSkip = process.env.REPLICANT_USER;

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_LIVE);
  const db = await client.db(process.env.DB_NAME);

  try {
    const books = await db.collection("books").find({}).toArray();
    console.log({ books });
  } catch (er) {
    console.log(er);
  } finally {
    client.close();
  }
}

run();
