require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const mongoClientPromise = MongoClient.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true });
const mongoDbPromise = mongoClientPromise.then(client => client.db(process.env.DB_NAME));

let masterId = process.env.DEMO_REPLICATION_MASTER;
let slaveId = process.env.DEMO_REPLICATION_SLAVE;

async function sync() {
  let client = await mongoClientPromise;
  let db = await mongoDbPromise;

  await db.collection("books").deleteMany({ userId: slaveId });
  await db.collection("subjects").deleteMany({ userId: slaveId });

  let newSubjects = await db
    .collection("subjects")
    .find({ userId: masterId })
    .toArray();

  let newBooks = await db
    .collection("books")
    .find({ userId: masterId })
    .toArray();

  let subjectMap = new Map([]);

  for (let s of newSubjects) {
    let oldId = s._id;
    delete s._id;
    s.userId = slaveId;
    await db.collection("subjects").insertOne(s);
    subjectMap.set("" + oldId, "" + s._id);
  }

  let booksToAdd = [];
  for (let b of newBooks) {
    delete b._id;
    b.userId = slaveId;
    b.subjects = b.subjects.map(id => subjectMap.get(id)).filter(id => id);
    booksToAdd.push(b);
  }
  await db.collection("books").insertMany(booksToAdd);

  try {
    client.close();
  } catch (er) {}
}

sync();
