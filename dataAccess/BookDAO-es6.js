var MongoClient = require('mongodb').MongoClient;

class BookDAO{
    constructor(userId){
        this.userId = userId;
    }
    saveBook(book){
        return MongoClient.connect('mongodb://localhost:27017/mongotest').then(db => {
            book.userId = this.userId;
            return db.collection('books').insert(book).then(result => db.close());
        });
    }
}


module.exports = BookDAO;