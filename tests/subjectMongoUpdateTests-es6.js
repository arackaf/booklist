const assert = require('chai').assert;
const ObjectId = require('mongodb').ObjectID;

const DAO = require('../dataAccess/DAO');
const SubjectDAO = require('../dataAccess/SubjectDAO');

let dao,
    db,
    subjectDaoInst;

describe('subject update', function() {

    beforeEach(async function(done){
        dao = new DAO();
        db = await dao.open();
        subjectDaoInst = new SubjectDAO(-1);
        done();
    });

    afterEach(async function(done){
        await db.collection('subjects').remove({ userId: -1 });
        await db.collection('subjects').remove({ userId: -2 });
        dao.dispose(db);
        done();
    });

    it('Prelim - test util functions', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2});
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: null });
    });

    it('Update basic parent', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' });
    });

    it('Update basic parent - security check', async function(){
        let subjects = await insertSubjects({_id: 1, userId: -2}, {_id: 2, userId: -2});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

        let subjectInServer = await db.collection('subjects').findOne({_id: ObjectId(subjects[1]._id) });
        console.log(subjectInServer);
        assert(subjectInServer.path == null);
    });

    it('Should update the child of a subject whose parent changes', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' });
    });

    it('Should update the child and grandchildren of a subject whose parent changes', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' });
    });

    it('Move a child which is also a parent up', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'});
        await subjectDaoInst.updateSubjectParent(subjects[2]._id, null);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: null }, { _id: subjects[2]._id, path: null }, { _id: subjects[3]._id, path: ',20,' });
    });

    it('Should update the child and grandchildren w/ siblings of a subject whose parent changes', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 202, path: ',2,20,'});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' });
    });

    it('Should update the child, and grandchildren of a subject whose parent changes - other sibling not touched', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 3});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, {_id: subjects[4]._id});
    });

    it('Should update the child, grandchildren, and great grandchildren of a subject whose parent changes', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, {_id: subjects[4]._id, path: ',1,2,20,201,'});
    });

    it('Above - change made deeper down', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, {_id: subjects[4]._id, path: ',1,20,201,'});
    });

    it('Above - two siblings to move (a)', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'}, {_id: 2011, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, {_id: subjects[4]._id, path: ',1,20,201,'}, {_id: subjects[5]._id, path: ',1,20,201,'});
    });

    it('Above - change made even deeper down', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, {_id: subjects[4]._id, path: ',1,201,'});
    });

    it('Above - two siblings to move', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 2010, path: ',2,20,201,'}, {_id: 2011, path: ',2,20,201,'});
        await subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, {_id: subjects[4]._id, path: ',1,201,'}, {_id: subjects[5]._id, path: ',1,201,'});
    });

    //TODO: kill these tests when drag and drop implemented
    it('TEMP TEST 1 -- set parent info', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'});
        await subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' });
    });

    it('TEMP TEST 2 -- set parent info', async function(){
        let subjects = await insertSubjects({_id: 1}, {_id: 2}, {_id: 20, path: ',2,'}, {_id: 201, path: ',2,20,'}, {_id: 202, path: ',2,20,'});
        await subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id);
        return await verifyPaths(subjects, {_id: subjects[0]._id, path: null}, {_id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' });
    });

    it('set subject parent right return 1', async function(){
        let ids = await insertSubjects({_id: 1, name: 'a'}, {_id: 2, name: 'b'}, {_id: 3, path: `,2,`, name: 'c'}, {_id: 4, path: `,2,3,`, name: 'd'});
        let resultSubjects = await subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id);
        return verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id);
    });

    it('set subject parent right return 2', async function(){
        let ids = await insertSubjects({_id: 1}, {_id: 2}, {_id: 3, path: `,2,`}, {_id: 4, path: `,2,3,`}, {_id: 5, path: `,2,3,`});
        let resultSubjects = await subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id);
        return verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id, ids[4]._id);
    });

    it('set subject parent right return 3', async function(){
        let ids = await insertSubjects({_id: 1}, {_id: 2}, {_id: 3, path: `,2,`}, {_id: 4, path: `,2,3,`}, {_id: 5, path: `,2,3,`});
        let resultSubjects = await subjectDaoInst.updateSubjectParent(ids[4]._id, null);
        return verifyReturnedSubjects(resultSubjects, ids[4]._id);
    });

    async function insertSubjects(...subjects){
        let lookup = { };
        subjects.forEach(s => {
            s.userId = s.userId || -1;
            s.oldId = s._id;
            s._id = ObjectId();
            lookup[s.oldId] = s._id;
        });
        subjects.forEach(s => {
            if (s.path){
                s.path = s.path.replace(/\d+/g, function(val){ return lookup[val] });
            }
        });
        await Promise.all(subjects.map(s => db.collection('subjects').insert(s)));
        return subjects.map(s => ({ _id: s._id + '', oldId: s.oldId }));
    }

    function verifyReturnedSubjects(subjects, ...ids){
        assert.strictEqual(subjects.length, ids.length);

        ids.forEach(_id => assert.isObject(subjects.find(s => s._id == _id), `Could not find ${_id}`));
    }

    async function verifyPaths(subjects, ...verifySubjects){
        let lookup = {};

        subjects.forEach(s => lookup[s.oldId] = s._id);
        verifySubjects.forEach(s => {
            if (s.path){
                s.path = s.path.replace(/\d+/g, function(val){ return lookup[val] });
            }
        });

        let subjectsServer = await subjectDaoInst.loadSubjects(-1);
        assert.strictEqual(subjectsServer.length, verifySubjects.length);
        verifySubjects.forEach(vs => assert.equal(subjectsServer.find(ss => ss._id == vs._id).path, vs.path));
    }
});
