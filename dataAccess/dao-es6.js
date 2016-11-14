import { MongoClient } from 'mongodb';

let db;
let dbPromise = MongoClient
        .connect(process.env.MONGO_CONNECTION || 'mongodb://localhost:27017/mongotest')
        .then(database => db = database)
        .catch(err => console.log('Error connecting ' + err));


class DAO{
    static init(){
        return dbPromise;
    }
    open(){
        return db;
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
    dispose(db){ }
    static shutdown(){
        db = null;
    }
}

export default DAO;