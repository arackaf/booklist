const DAO = require('./DAO');
const ObjectId = require('mongodb').ObjectID;

class SubjectDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async updateSubjectInfo(_id, newName, newParent){
        let db = await super.open();

        try{
            await db.collection('subjects').update({ _id: ObjectId(_id) }, { $set: { name: newName } });
            //just call it every time for now - when drag and drop implemented, this'll be separate
            return await this.updateSubjectParent(_id, newParent);
        } finally{
            super.dispose(db);
        }
    }
    async updateSubjectParent(_id, newParent){
        let db = await super.open();

        try{
            let newParentObj = await db.collection('subjects').findOne({ _id: ObjectId(newParent) }),
                newParentPath = (newParentObj.path || ',') + `${newParentObj._id},`,
                newDescendantPathPiece = `${newParentPath}${_id},`;

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
    async loadSubjects(userId){
        let db = await super.open();
        try {
            return await db.collection('subjects').find({ userId: +userId }).toArray();
        } finally {
            super.dispose(db);
        }
    }
}


module.exports = SubjectDAO;