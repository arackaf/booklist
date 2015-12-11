const DAO = require('./DAO');

class SubjectDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async updateSubjectParent(_id, newParent){
        let db = await super.open();
        try{

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