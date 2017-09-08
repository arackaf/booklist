import DAO from "./dao";
import { ObjectId } from "mongodb";

class TagDAO extends DAO {
  constructor(userId) {
    super();
    this.userId = userId;
  }
  async deleteTag(_id) {
    let db = await super.open();

    await db.collection("books").update({ userId: this.userId, tags: { $in: [_id] } }, { $pull: { tags: _id } }, { upsert: false, multi: true });

    await db.collection("tags").remove({ _id: ObjectId(_id), userId: this.userId });
  }
  async loadTags(userId) {
    let db = await super.open();

    let userIdToUse = userId || this.userId;

    try {
      let tags = await Promise.resolve(
        db
          .collection("tags")
          .find({ userId: userIdToUse })
          .sort({ name: 1 })
          .toArray()
      );
      return { tags };
    } finally {
      super.dispose(db);
    }
  }
  async updateTagInfo(_id, name, backgroundColor, textColor) {
    let db = await super.open();

    try {
      if (!_id) {
        let newPath = null;
        let newTag = { name, backgroundColor, textColor, path: newPath, userId: this.userId };
        await db.collection("tags").insert(newTag);
        return { tag: newTag };
      }

      await db.collection("tags").update({ _id: ObjectId(_id), userId: this.userId }, { $set: { name, backgroundColor, textColor } });

      return { tag: { _id, name, backgroundColor, textColor } };
    } finally {
      super.dispose(db);
    }
  }
}

export default TagDAO;
