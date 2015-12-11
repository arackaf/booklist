const DAO = require('./DAO');

class SubjectDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async updateSubjectParent(_id, newParent){
        let db = await super.open();

        try{
            let newParentObj = await db.collection('subjects').findOne({ _id: newParent }),
                newParentPath = (newParentObj.path || ',') + `${newParentObj._id},`,
                newDescendantPathPiece = `${newParentPath}${_id},`

            await db.collection('subjects').update({ _id: _id }, { $set: { path: newParentPath } });
            let descendantsToUpdate = await db.collection('subjects').find({ path: { $regex: `.*,${_id},` } }).toArray();

            await Promise.all(descendantsToUpdate.map(s =>
                db.collection('subjects').update({ _id: s._id }, { $set: { path: s.path.replace(new RegExp(`.*,${_id},`), newDescendantPathPiece) } })
            ));
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