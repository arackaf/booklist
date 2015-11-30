var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

class DAO{
    open(){
        let result = MongoClient.connect('mongodb://localhost:27017/mongotest');

        //handling error like this will keep the resulting promise in error state
        result.catch(err => {
            this.logError('Error connecting ' + err);
        });
        return result;
    }
    confirmSingleResult(res){
        let numInserted = +res.result.n;
        if (!numInserted) {
            throw 'Object not inserted';
        }
        if (numInserted > 1){
            throw 'Expected 1 object to be inserted.  Actual ' + numInserted;
        }
    }
    dispose(db){
        db.close();
        console.log('DISPOSED');
    }
}

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