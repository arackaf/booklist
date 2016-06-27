import DAO from './dao';
import { ObjectId } from 'mongodb';

class SubjectDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async deleteSubject(_id){
        let db = await super.open();
        let subjectToDelete = await db.collection('subjects').findOne({ _id: ObjectId(_id), userId: this.userId });

        if (!subjectToDelete) return;

        let booksToUpdate = (await db.collection('books').find({ subjects: _id, userId: this.userId }, {_id: 1}).toArray()).map(o => o._id);

        await db.collection('books').update(
            { _id: { $in: booksToUpdate } },
            { $pull: { subjects: _id } }, { upsert: false, multi: true }
        );

        await db.collection('subjects').remove({ _id: ObjectId(_id) });

        return { booksUpdated: booksToUpdate.map(String) };
    }
    async updateSubjectInfo(_id, newName, newParent){
        let db = await super.open();

        try{
            if (!_id){
                let newPath = null;
                if (newParent){
                    let existingParent = await db.collection('subjects').findOne({ _id: ObjectId(newParent) });
                    newPath = (existingParent.path || ',') + ('' + existingParent._id) + ',';
                }
                let newSubject = { name: newName, path: newPath, userId: this.userId };
                await db.collection('subjects').insert(newSubject);
                return { affectedSubjects: [newSubject] };
            }

            let existing = await db.collection('subjects').findOne({ _id: ObjectId(_id) });
            await db.collection('subjects').update({ _id: ObjectId(_id) }, { $set: { name: newName } });

            let existingParent;
            if (existing.path == null){
                existingParent = null;
            } else {
                let pieces = existing.path.split(',');
                existingParent = pieces[pieces.length - 2];
            }

            if (existingParent != newParent) {
                var affectedSubjects = await this.updateSubjectParent(_id, newParent);
            }
            return { affectedSubjects: affectedSubjects || [Object.assign(existing, { name: newName })] };
        } finally{
            super.dispose(db);
        }
    }
    async updateSubjectParent(_id, newParent){
        let db = await super.open();

        try{
            //security checks - make sure you own the subject, and also the new parent (if applicable)
            if (newParent == null){
                let existingSubject = await db.collection('subjects').findOne({ _id: ObjectId(_id), userId: this.userId });
                if (existingSubject == null) return;
            } else {
                let existingSubjectAndParent = await db.collection('subjects').find({ _id: { $in: [ObjectId(_id), ObjectId(newParent)] }, userId: this.userId }).toArray();
                if (existingSubjectAndParent.length !== 2) return;
            }

            let newParentObj = await (newParent ? db.collection('subjects').findOne({ _id: ObjectId(newParent) }) : null),
                newParentPath = newParentObj ? (newParentObj.path || ',') + `${newParentObj._id},` : null,
                newDescendantPathPiece = `${newParentPath || ','}${_id},`;

            await db.collection('subjects').update({ _id: ObjectId(_id) }, { $set: { path: newParentPath } });
            let descendantsToUpdate = await db.collection('subjects').find({ path: { $regex: `.*,${_id},` } }).toArray();

            await Promise.all(descendantsToUpdate.map(s =>
                db.collection('subjects').update({ _id: s._id }, { $set: { path: s.path.replace(new RegExp(`.*,${_id},`), newDescendantPathPiece) } })
            ));

            return await db.collection('subjects').find({ $or: [{ path: { $regex: `.*,${_id},` } }, { _id: ObjectId(_id) }] }).toArray();
        } finally {
            super.dispose(db);
        }
    }
    async loadSubjects(){
        let db = await super.open();
        try {
            let [subjects, labelColors] = await Promise.all([
                db.collection('subjects').find({ userId: this.userId }).toArray(),
                db.collection('labelColors').find({ }).sort({ order: 1 }).toArray()
            ]);

            return { subjects, labelColors };
        } finally {
            super.dispose(db);
        }
    }
}


export default SubjectDAO;