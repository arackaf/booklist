import { ObjectId } from "mongodb";
import DAO from "./dao";

class PendingBookEntryDAO extends DAO {
  constructor(userId) {
    super();
    this.userId = userId;
  }
  async getLatest(count) {
    let db = await super.open();
    try {
      return await db
        .collection("pendingEntries")
        .find({})
        .sort({ _id: 1 })
        .limit(count)
        .toArray();
    } finally {
      super.dispose(db);
    }
  }
  async add(item) {
    let db = await super.open();
    try {
      await db.collection("pendingEntries").insertOne(item);
    } finally {
      super.dispose(db);
    }
  }
  async remove(_id) {
    let db = await super.open();
    try {
      await db.collection("pendingEntries").deleteOne({ _id: ObjectId(_id) });
    } finally {
      super.dispose(db);
    }
  }
  async getPendingForUser(userId) {
    let db = await super.open();
    try {
      return await db
        .collection("pendingEntries")
        .find({ userId: userId })
        .count();
    } finally {
      super.dispose(db);
    }
  }
}

export default PendingBookEntryDAO;
