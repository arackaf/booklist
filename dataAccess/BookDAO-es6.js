var MongoClient = require('mongodb').MongoClient;

class DAO{
    open(){
        let result = MongoClient.connect('mongodb://localhost:27017/mongotest');
        Promise.resolve(result).then(db => this.db = db);
        return result;
    }
    confirmSingleResult(res){
        if (+res.result.n !== 1) {
            throw 'Object not inserted';
        }
    }
    processSingleResultAndClose(p){
        return p.then(result => {
            this.confirmSingleResult(result);
            this.dispose();
        }, err => {
            this.dispose();
            console.log(err);
            throw err;
        });
    }
    dispose(){
        this.db.close();
    }
}

class BookDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    saveBook(book){
        return super.open().then(db => {
            book.userId = this.userId;
            return super.processSingleResultAndClose(
                db.collection('books').insert(book)
            );
        });
    }
}


module.exports = BookDAO;