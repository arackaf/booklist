import { MongoClient, ObjectId } from "mongodb";
import { getDbConnection } from "./dbUtils";

let masterId = process.env.DEMO_REPLICATION_MASTER;
let slaveId = process.env.DEMO_REPLICATION_SLAVE;

async function sync() {
  let { client, db } = await getDbConnection();

  try {
    await db.collection("books").deleteMany({ userId: slaveId });
    await db.collection("subjects").deleteMany({ userId: slaveId });
    await db.collection("tags").deleteMany({ userId: slaveId });

    let newSubjects = await db
      .collection("subjects")
      .find({ userId: masterId })
      .toArray();

    let newTags = await db
      .collection("tags")
      .find({ userId: masterId })
      .toArray();

    let newBooks = await db
      .collection("books")
      .find({ userId: masterId })
      .toArray();

    let subjectMap = new Map([]);
    let tagsMap = new Map([]);

    for (let s of newSubjects) {
      let oldId = s._id;
      delete s._id;
      s.userId = slaveId;
      await db.collection("subjects").insertOne(s);
      subjectMap.set("" + oldId, "" + s._id);
    }

    for (let t of newTags) {
      let oldId = t._id;
      delete t._id;
      t.userId = slaveId;
      await db.collection("tags").insertOne(t);
      tagsMap.set("" + oldId, "" + t._id);
    }

    let booksToAdd = [];
    for (let b of newBooks) {
      delete b._id;
      b.userId = slaveId;
      b.subjects = b.subjects.map(id => subjectMap.get(id)).filter(id => id);
      b.tags = (b.tags || []).map(id => tagsMap.get(id)).filter(id => id);
      booksToAdd.push(b);
    }
    await db.collection("books").insertMany(booksToAdd);
  } catch (er) {
    console.log("ERROR", er);
  } finally {
    try {
      client.close();
    } catch (e) {}
  }
}

sync();
