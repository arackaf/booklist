var MongoClient = require('mongodb').MongoClient;

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
    logError(err){
        console.log(err)
    }
    dispose(db){
        db.close();
    }
}

module.exports = DAO;