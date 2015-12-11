const DAO = require('./DAO');

class SubjectDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async loadSubjects(){
        let db = await super.open();
        try {
            return await db.collection('subjects').find({}).toArray();
        } finally {
            super.dispose(db);
        }
    }
}


module.exports = SubjectDAO;