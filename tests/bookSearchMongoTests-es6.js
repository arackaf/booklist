const assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectID;

const DAO = require('../dataAccess/DAO');
const BookDAO = require('../dataAccess/BookDAO');

describe('book search', function() {
    let dao,
        db,
        bookDaoInst;


    const subjects = [
        { _id: 1, name: 'History', path: null, userId: -1 },
        { _id: 2, name: 'American History', path: ',1,', userId: -1 },
        { _id: 3, name: 'Civil War', path: ',1,2,', userId: -1 },
        { _id: 4, name: 'Science', path: null, userId: -1 }
    ];

    before(async function(done){
        dao = new DAO();
        db = await dao.open();

        subjects.forEach(s => {
            s.userId = s.userId || -1;
            s.oldId = s._id;
            s._id = ObjectId();
        });

        await Promise.all(subjects.map(s => db.collection('subjects').insert(s)));
        subjects.forEach(s => {
            s._id = s._id + ''
        });

        done();
    });

    after(async function(done){
        await db.collection('subjects').remove({ userId: -1 });
        dao.dispose(db);
        done();
    });

    beforeEach(async function(done){
        bookDaoInst = new BookDAO(-1);
        done();
    });

    afterEach(async function(done){
        await db.collection('books').remove({ userId: -1 });
        await db.collection('books').remove({ userId: -2 });
        done();
    });

    it('Prelim - test util functions', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Thomas Jefferson' }, {_id: 2, title: 'Thomas Kuhn'}, {_id: 3, title: 'Thomas Jefferson', userId: -2});
        return await verifyResults({search: 'Thomas'}, lookup, 1, 2);
    });

    async function verifyResults(searchPacket, lookup, ...resultIds){
        let results = await bookDaoInst.searchBooks(searchPacket.search);

        assert.strictEqual(results.length, resultIds.length);

        resultIds.forEach(_id => {
            let found = results.find(b => '' + b._id == '' + lookup[_id]);
            assert.isObject(found);
        });
    }

    async function insertBooks(...books){
        let lookup = { };
        books.forEach(s => {
            s.userId = s.userId || -1;
            s.oldId = s._id;
            s._id = ObjectId();
            lookup[s.oldId] = '' + s._id;
        });

        await Promise.all(books.map(s => db.collection('books').insert(s)));
        return lookup;
    }

});
