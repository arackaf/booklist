const assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectID;

const DAO = require('../dataAccess/DAO');
const BookDAO = require('../dataAccess/BookDAO');

let dao,
    db,
    bookDaoInst;

describe('subject update', function() {

    beforeEach(async function(done){
        dao = new DAO();
        db = await dao.open();
        bookDaoInst = new BookDAO(-1);
        done();
    });

    afterEach(async function(done){
        await db.collection('books').remove({ userId: -1 });
        await db.collection('books').remove({ userId: -2 });
        dao.dispose(db);
        done();
    });

    it('Prelim - test util functions', async function(done){
        let subjects = await insertBooks({_id: 1, title: 'Thomas Jefferson' }, {_id: 2, title: 'Thomas Kuhn'}, {_id: 3, title: 'Thomas Jefferson', userId: -2});

        await verifyResults({ search: 'Thomas' });

        done();
    });

    async function verifyResults(){
        let results = await bookDaoInst.searchBooks('Thomas');
        console.log(results.length);
        console.log(results);
    }

    async function insertBooks(...books){
        let lookup = { };
        books.forEach(s => {
            s.userId = s.userId || -1;
            s.oldId = s._id;
            s._id = ObjectId();
            lookup[s.oldId] = s._id;
        });

        await Promise.all(books.map(s => db.collection('books').insert(s)));
        return books.map(b => ({ _id: b._id + '', oldId: b.oldId }));
    }

});
