var MongoClient = require('mongodb').MongoClient;

class DAO{
    open(){
        let result = MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mongotest');
        //let result = MongoClient.connect('mongodb://adam:rackis_password@olympia.modulusmongo.net:27017/puZ5iqab');

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
        try {
            db.close();
        } catch(err){ } //maybe closed by error or something
    }
}

export default DAO;