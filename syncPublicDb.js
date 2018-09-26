require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const connectPrimary = () => {
  return MongoClient.connect(
    process.env.MONGO_CONNECTION,
    { useNewUrlParser: true }
  ).then(client => [client, client.db(process.env.DB_NAME)]);
};

const connectPublic = () => {
  return MongoClient.connect(
    process.env.MONGO_PUBLIC,
    { useNewUrlParser: true }
  ).then(client => [client, client.db(process.env.DB_NAME_PUBLIC)]);
};

let masterId = process.env.DEMO_REPLICATION_MASTER;

async function sync() {
  let [clientPublic, dbPublic] = await connectPublic();
  let [clientPrimary, dbPrimary] = await connectPrimary();

  await Promise.all([
    dbPublic.collection("books").deleteMany({}),
    dbPublic.collection("tags").deleteMany({}),
    dbPublic.collection("subjects").deleteMany({}),
    dbPublic.collection("amazonReference").deleteMany({}),
    dbPublic.collection("users").deleteMany({}),
    dbPublic.collection("labelColors").deleteMany({})
  ]);

  let [users, books, subjects, tags, labelColors, amazonReference] = await Promise.all([
    dbPrimary
      .collection("users")
      .find({ _id: ObjectId(masterId) })
      .toArray(),
    dbPrimary
      .collection("books")
      .find({ userId: masterId })
      .toArray(),
    dbPrimary
      .collection("subjects")
      .find({ userId: masterId })
      .toArray(),
    dbPrimary
      .collection("tags")
      .find({ userId: masterId })
      .toArray(),
    dbPrimary
      .collection("labelColors")
      .find({})
      .toArray(),
    dbPrimary
      .collection("amazonReference")
      .find({})
      .toArray()
  ]);

  Object.assign(users[0], { token: "", activationToken: "", password: "" });

  await Promise.all([
    dbPublic.collection("users").insertMany(users),
    dbPublic.collection("books").insertMany(books),
    dbPublic.collection("subjects").insertMany(subjects),
    dbPublic.collection("tags").insertMany(tags),
    dbPublic.collection("labelColors").insertMany(labelColors),
    dbPublic.collection("amazonReference").insertMany(amazonReference)
  ]);
  clientPrimary.close();
  clientPublic.close();
}

sync();
