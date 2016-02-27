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

    it('Prelim - basic search', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Thomas Jefferson' }, {_id: 2, title: 'Thomas Kuhn'}, {_id: 3, title: 'Thomas Jefferson', userId: -2});
        return await verifyResults({search: 'Thomas'}, lookup, 1, 2);
    });

    it('Prelim - basic subject search', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Civil War', subjects: [3] }, {_id: 2, title: 'other', subjects: [] });
        return await verifyResults({ subjects: [3] }, lookup, 1);
    });

    it('Prelim - basic both searches - no results', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Civil War', subjects: [3] }, {_id: 2, title: 'Jefferson'}, {_id: 3, title: 'other', subjects: [] });
        return await verifyResults({ search: 'Jeff', subjects: [3] }, lookup);
    });

    it('Prelim - basic both searches', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Civil War', subjects: [3] }, {_id: 2, title: 'Jefferson Davis', subjects: [3]}, {_id: 3, title: 'other', subjects: [] });
        return await verifyResults({ search: 'Jeff', subjects: [3] }, lookup, 2);
    });

    it('Prelim - basic both searches - bad ids', async function(){
        let lookup = await insertBooks({_id: 1, title: 'Civil War', subjects: [3], userId: -2 }, {_id: 2, title: 'Jefferson', userId: -2}, {_id: 3, title: 'other', subjects: [] });
        return await verifyResults({ search: 'Jeff', subjects: [3] }, lookup);
    });

    async function verifyResults(searchPacket, bookIdLookup, ...resultIds){
        let subjectSearch = (searchPacket.subjects || []).map(sid => ObjectId(subjects.find(s => s.oldId == sid)._id)),
            results = await bookDaoInst.searchBooks(searchPacket.search, subjectSearch);

        assert.strictEqual(results.length, resultIds.length);

        resultIds.forEach(_id => {
            let found = results.find(b => '' + b._id == '' + bookIdLookup[_id]);
            assert.isObject(found);
        });
    }

    async function insertBooks(...books){
        let lookup = { };
        books.forEach(b => {
            b.userId = b.userId || -1;
            b.oldId = b._id;
            b._id = ObjectId();
            b.subjects = (b.subjects || []).map(sid => ObjectId(subjects.find(s => s.oldId == sid)._id));
            lookup[b.oldId] = '' + b._id;
        });

        await Promise.all(books.map(s => db.collection('books').insert(s)));
        return lookup;
    }

});
