'use strict';

var assert = require('chai').assert;
var ObjectId = require('mongodb').ObjectID;

var DAO = require('../../dataAccess/DAO');
var SubjectDAO = require('../../dataAccess/subjectDAO');

var dao = undefined,
    db = undefined,
    subjectDaoInst = undefined;

describe('subject update', function () {

    beforeEach(function callee$1$0(done) {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    dao = new DAO();
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(dao.open());

                case 3:
                    db = context$2$0.sent;

                    subjectDaoInst = new SubjectDAO(-1);
                    done();

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    afterEach(function callee$1$0(done) {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(db.collection('subjects').remove({ userId: -1 }));

                case 2:
                    context$2$0.next = 4;
                    return regeneratorRuntime.awrap(db.collection('subjects').remove({ userId: -2 }));

                case 4:
                    dao.dispose(db);
                    done();

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Prelim - test util functions', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: null }));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Update basic parent', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Update basic parent - security check', function callee$1$0() {
        var subjects, subjectInServer;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1, userId: -2 }, { _id: 2, userId: -2 }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(db.collection('subjects').findOne({ _id: ObjectId(subjects[1]._id) }));

                case 7:
                    subjectInServer = context$2$0.sent;

                    assert(subjectInServer.path == null, 'subject was moved and shouldnt have been');

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Set basic parent - security check on new parent', function callee$1$0() {
        var subjects, subjectInServer;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1, userId: -2 }, { _id: 2, userId: -1 }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(db.collection('subjects').findOne({ _id: ObjectId(subjects[1]._id) }));

                case 7:
                    subjectInServer = context$2$0.sent;

                    assert(subjectInServer.path == null, 'subject was moved and shouldnt have been');

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Should update the child of a subject whose parent changes', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Should update the child and grandchildren of a subject whose parent changes', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Move a child which is also a parent up', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[2]._id, null));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: null }, { _id: subjects[2]._id, path: null }, { _id: subjects[3]._id, path: ',20,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Should update the child and grandchildren w/ siblings of a subject whose parent changes', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 202, path: ',2,20,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Should update the child, and grandchildren of a subject whose parent changes - other sibling not touched', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 3 }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Should update the child, grandchildren, and great grandchildren of a subject whose parent changes', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,201,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Above - change made deeper down', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, { _id: subjects[4]._id, path: ',1,20,201,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Above - two siblings to move (a)', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }, { _id: 2011, path: ',2,20,201,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, { _id: subjects[4]._id, path: ',1,20,201,' }, { _id: subjects[5]._id, path: ',1,20,201,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Above - change made even deeper down', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, { _id: subjects[4]._id, path: ',1,201,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('Above - two siblings to move', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }, { _id: 2011, path: ',2,20,201,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, { _id: subjects[4]._id, path: ',1,201,' }, { _id: subjects[5]._id, path: ',1,201,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('UpdateSubjectInfo set new name', function callee$1$0() {
        var subjects, updatedSub;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1, name: 'subject' }, { _id: 2, name: 'lala' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectInfo(subjects[0]._id, 'foo', null));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(db.collection('subjects').findOne({ _id: ObjectId(subjects[0]._id) }));

                case 7:
                    updatedSub = context$2$0.sent;

                    assert.strictEqual(updatedSub.name, 'foo');

                case 9:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('UpdateSubjectInfo set new name - updateParent not called if not needed', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1, name: 'subject' }, { _id: 2, name: 'lala' }));

                case 2:
                    subjects = context$2$0.sent;

                    subjectDaoInst.updateSubjectParent = function () {
                        throw 'I was called';
                    };
                    context$2$0.next = 6;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectInfo(subjects[0]._id, 'foo', null));

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('UpdateSubjectInfo -- set parent info', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('UpdateSubjectInfo -- set parent info', function callee$1$0() {
        var subjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 202, path: ',2,20,' }));

                case 2:
                    subjects = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id));

                case 5:
                    context$2$0.next = 7;
                    return regeneratorRuntime.awrap(verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' }));

                case 7:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('set subject parent right return 1', function callee$1$0() {
        var ids, resultSubjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, path: ',2,', name: 'c' }, { _id: 4, path: ',2,3,', name: 'd' }));

                case 2:
                    ids = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id));

                case 5:
                    resultSubjects = context$2$0.sent;
                    return context$2$0.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id));

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('set subject parent right return 2', function callee$1$0() {
        var ids, resultSubjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 3, path: ',2,' }, { _id: 4, path: ',2,3,' }, { _id: 5, path: ',2,3,' }));

                case 2:
                    ids = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id));

                case 5:
                    resultSubjects = context$2$0.sent;
                    return context$2$0.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id, ids[4]._id));

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('set subject parent right return 3', function callee$1$0() {
        var ids, resultSubjects;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 3, path: ',2,' }, { _id: 4, path: ',2,3,' }, { _id: 5, path: ',2,3,' }));

                case 2:
                    ids = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.updateSubjectParent(ids[4]._id, null));

                case 5:
                    resultSubjects = context$2$0.sent;
                    return context$2$0.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[4]._id));

                case 7:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    function insertSubjects() {
        for (var _len = arguments.length, subjects = Array(_len), _key = 0; _key < _len; _key++) {
            subjects[_key] = arguments[_key];
        }

        var lookup;
        return regeneratorRuntime.async(function insertSubjects$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    lookup = {};

                    subjects.forEach(function (s) {
                        s.userId = s.userId || -1;
                        s.oldId = s._id;
                        s._id = ObjectId();
                        lookup[s.oldId] = s._id;
                    });
                    subjects.forEach(function (s) {
                        if (s.path) {
                            s.path = s.path.replace(/\d+/g, function (val) {
                                return lookup[val];
                            });
                        }
                    });
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(Promise.all(subjects.map(function (s) {
                        return db.collection('subjects').insert(s);
                    })));

                case 5:
                    return context$2$0.abrupt('return', subjects.map(function (s) {
                        return { _id: s._id + '', oldId: s.oldId };
                    }));

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    }

    function verifyReturnedSubjects(subjects) {
        for (var _len2 = arguments.length, ids = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            ids[_key2 - 1] = arguments[_key2];
        }

        assert.strictEqual(subjects.length, ids.length);

        ids.forEach(function (_id) {
            return assert.isObject(subjects.find(function (s) {
                return s._id == _id;
            }), 'Could not find ' + _id);
        });
    }

    function verifyPaths(subjects) {
        for (var _len3 = arguments.length, verifySubjects = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            verifySubjects[_key3 - 1] = arguments[_key3];
        }

        var lookup, subjectsServer;
        return regeneratorRuntime.async(function verifyPaths$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    lookup = {};

                    subjects.forEach(function (s) {
                        return lookup[s.oldId] = s._id;
                    });
                    verifySubjects.forEach(function (s) {
                        if (s.path) {
                            s.path = s.path.replace(/\d+/g, function (val) {
                                return lookup[val];
                            });
                        }
                    });

                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(subjectDaoInst.loadSubjects(-1));

                case 5:
                    subjectsServer = context$2$0.sent;

                    assert.strictEqual(subjectsServer.length, verifySubjects.length);
                    verifySubjects.forEach(function (vs) {
                        return assert.equal(subjectsServer.find(function (ss) {
                            return ss._id == vs._id;
                        }).path, vs.path);
                    });

                case 8:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    }
});