const assert = require('chai').assert;

const DAO = require('../dataAccess/DAO');
const SubjectDAO = require('../dataAccess/SubjectDAO');

let dao,
    db,
    subjectDaoInst;

describe('subject parent update', function() {

    beforeEach(function(){
        dao = new DAO();
        subjectDaoInst = new SubjectDAO;
    });

    afterEach(async function(done){
        await db.collection('subjects').remove({ userId: -1 });
        dao.dispose(db);
        done();
    });

    it('Prelim - test util functions', async function(){
        db = await dao.open();

        await insertSubjects({_id: 1, userId: -1}, {_id: 2, userId: -1});
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: null });
    });

    async function insertSubjects(...subjects){
        await Promise.all(subjects.map(s => db.collection('subjects').insert(s)));
    }

    async function verifyPaths(...verifySubjects){
        let subjectsServer = await subjectDaoInst.loadSubjects(-1);
        assert.strictEqual(subjectsServer.length, verifySubjects.length);
        verifySubjects.forEach(vs => assert.equal(subjectsServer.find(ss => ss._id == vs._id).path, vs.path));
    }

});
