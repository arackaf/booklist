import { ObjectId } from "mongodb";

class SubjectDAO {
  constructor(userId) {
    this.userId = userId;
  }
  async updateSubjectInfo(db, _id, name, backgroundColor, textColor, newParent) {
    if (!_id) {
      let newPath = null;
      if (newParent) {
        let existingParent = await db.collection("subjects").findOne({ _id: ObjectId(newParent), userId: this.userId });
        if (!existingParent) return;

        newPath = (existingParent.path || ",") + ("" + existingParent._id) + ",";
      }
      let newSubject = { name, backgroundColor, textColor, path: newPath, userId: this.userId };
      await db.collection("subjects").insert(newSubject);
      return { affectedSubjects: [newSubject] };
    }

    let existing = await db.collection("subjects").findOne({ _id: ObjectId(_id), userId: this.userId });
    if (!existing) return;

    await db.collection("subjects").update({ _id: ObjectId(_id) }, { $set: { name, backgroundColor, textColor } });

    let existingParent;
    if (existing.path == null) {
      existingParent = null;
    } else {
      let pieces = existing.path.split(",");
      existingParent = pieces[pieces.length - 2];
    }

    if (existingParent != newParent) {
      var affectedSubjects = await this.updateSubjectParent(db, _id, newParent);
    }
    return { affectedSubjects: affectedSubjects || [Object.assign(existing, { name, backgroundColor, textColor })] };
  }
  async updateSubjectParent(db, _id, newParent) {
    //security checks - make sure you own the subject, and also the new parent (if applicable)
    if (!newParent) {
      let existingSubject = await db.collection("subjects").findOne({ _id: ObjectId(_id), userId: this.userId });
      if (existingSubject == null) return;
    } else {
      let existingSubjectAndParent = await db
        .collection("subjects")
        .find({ _id: { $in: [ObjectId(_id), ObjectId(newParent)] }, userId: this.userId })
        .toArray();
      if (existingSubjectAndParent.length !== 2) return;
    }

    let newParentObj = await (newParent ? db.collection("subjects").findOne({ _id: ObjectId(newParent) }) : null),
      newParentPath = newParentObj ? (newParentObj.path || ",") + `${newParentObj._id},` : null,
      newDescendantPathPiece = `${newParentPath || ","}${_id},`;

    await db.collection("subjects").update({ _id: ObjectId(_id) }, { $set: { path: newParentPath } });
    let descendantsToUpdate = await db
      .collection("subjects")
      .find({ path: { $regex: `.*,${_id},` } })
      .toArray();

    await Promise.all(
      descendantsToUpdate.map(s =>
        db.collection("subjects").update({ _id: s._id }, { $set: { path: s.path.replace(new RegExp(`.*,${_id},`), newDescendantPathPiece) } })
      )
    );

    let results = await db
      .collection("subjects")
      .find({ $or: [{ path: { $regex: `.*,${_id},` } }, { _id: ObjectId(_id) }] })
      .toArray();

    results.forEach(s => (s._id = s._id + ""));
    return results;
  }
  async deleteSubject(db, _id) {
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
    return subjectsToDeleteString;
  }
}

export default {
  Mutation: {
    async updateSubject(root, args, context, ast) {
      let db = await root.db;
      let dao = new SubjectDAO(context.user.id);
      let { affectedSubjects } = await dao.updateSubjectInfo(db, args._id, args.name, args.backgroundColor, args.textColor, args.parentId);
      return affectedSubjects;
    },
    async deleteSubject(root, args, context, ast) {
      let db = await root.db;
      let dao = new SubjectDAO(context.user.id);
      return dao.deleteSubject(db, args._id);
    }
  }
};
