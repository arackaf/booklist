import DAO from "./dao";
import { ObjectId } from "mongodb";

class SubjectDAO extends DAO {
  constructor(userId) {
    super();
    this.userId = userId;
  }
  async deleteSubject(_id) {
    let db = await super.open();
    let subjectsToDelete = (await db
      .collection("subjects")
      .find({ $or: [{ _id: ObjectId(_id) }, { path: { $regex: `.*,${_id},` } }], userId: this.userId })
      .toArray()).map(o => o._id);

    let subjectsToDeleteString = subjectsToDelete.map(_id => "" + _id);

    if (!subjectsToDelete.length) return;

    await db
      .collection("books")
      .update(
        { userId: this.userId, subjects: { $in: subjectsToDeleteString } },
        { $pull: { subjects: { $in: subjectsToDeleteString } } },
        { upsert: false, multi: true }
      );

    await db.collection("subjects").remove({ _id: { $in: subjectsToDelete } });

    return { subjectsDeleted: subjectsToDeleteString };
  }

  async loadSubjects(userId) {
    let db = await super.open();

    let userIdToUse = userId || this.userId;

    try {
      let subjects = await db
        .collection("subjects")
        .find({ userId: userIdToUse })
        .sort({ name: 1 })
        .toArray();

      return { subjects };
    } finally {
      super.dispose(db);
    }
  }
}

export default SubjectDAO;
