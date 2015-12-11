const assert = require('chai').assert;

const DAO = require('../dataAccess/DAO');
const SubjectDAO = require('../dataAccess/SubjectDAO');

let dao,
    db,
    subjectDaoInst;

describe('subject parent update', function() {

    beforeEach(async function(done){
        dao = new DAO();
        db = await dao.open();
        subjectDaoInst = new SubjectDAO;
        done();
    });

    afterEach(async function(done){
        await db.collection('subjects').remove({ userId: -1 });
        dao.dispose(db);
        done();
    });

    it('Prelim - test util functions', async function(){
        await insertSubjects({_id: 1}, {_id: 2});
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: null });
    });

    it('Update basic parent', async function(){
        await insertSubjects({_id: 1}, {_id: 2});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' });
    });

    it('Should update the child of a subject whose parent changes', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' }, { _id: 20, path: ',1,2,' });
    });

    it('Should update the child and grandchildren of a subject whose parent changes', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' }, { _id: 20, path: ',1,2,' }, { _id: 201, path: ',1,2,20,' });
    });

    it('Should update the child and grandchildren w/ siblings of a subject whose parent changes', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 202, path: ',2,20,'});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' }, { _id: 20, path: ',1,2,' }, { _id: 201, path: ',1,2,20,' }, { _id: 202, path: ',1,2,20,' });
    });

    it('Should update the child, and grandchildren of a subject whose parent changes - other sibling not touched', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 3});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' }, { _id: 20, path: ',1,2,' }, { _id: 201, path: ',1,2,20,' }, {_id: 3});
    });

    it('Should update the child, grandchildren, and great grandchildren of a subject whose parent changes', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(2, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2, path: ',1,' }, { _id: 20, path: ',1,2,' }, { _id: 201, path: ',1,2,20,' }, {_id: 2010, path: ',1,2,20,201,'});
    });

    it('Above - change made deeper down', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(20, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2 }, { _id: 20, path: ',1,' }, { _id: 201, path: ',1,20,' }, {_id: 2010, path: ',1,20,201,'});
    });

    it('Above - change made even deeper down', async function(){
        await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(201, 1);
        return await verifyPaths({_id: 1, path: null}, {_id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',1,' }, {_id: 2010, path: ',1,201,'});
    });

    async function insertSubjects(...subjects){
        subjects.forEach(s => s.userId = s.userId || -1);
        await Promise.all(subjects.map(s => db.collection('subjects').insert(s)));
    }

    async function verifyPaths(...verifySubjects){
        let subjectsServer = await subjectDaoInst.loadSubjects(-1);
        assert.strictEqual(subjectsServer.length, verifySubjects.length);
        verifySubjects.forEach(vs => assert.equal(subjectsServer.find(ss => ss._id == vs._id).path, vs.path));
    }

});
