'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var assert = require('chai').assert;
var ObjectId = require('mongodb').ObjectID;

var DAO = require('../../dataAccess/DAO');
var SubjectDAO = require('../../dataAccess/subjectDAO');

var dao = void 0,
    db = void 0,
    subjectDaoInst = void 0;

describe('subject update', function () {
    var insertSubjects = function () {
        var _ref24 = _asyncToGenerator(regeneratorRuntime.mark(function _callee24() {
            for (var _len = arguments.length, subjects = Array(_len), _key = 0; _key < _len; _key++) {
                subjects[_key] = arguments[_key];
            }

            var lookup;
            return regeneratorRuntime.wrap(function _callee24$(_context24) {
                while (1) {
                    switch (_context24.prev = _context24.next) {
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
                            _context24.next = 5;
                            return Promise.all(subjects.map(function (s) {
                                return db.collection('subjects').insert(s);
                            }));

                        case 5:
                            return _context24.abrupt('return', subjects.map(function (s) {
                                return { _id: s._id + '', oldId: s.oldId };
                            }));

                        case 6:
                        case 'end':
                            return _context24.stop();
                    }
                }
            }, _callee24, this);
        }));

        return function insertSubjects() {
            return _ref24.apply(this, arguments);
        };
    }();

    var verifyPaths = function () {
        var _ref25 = _asyncToGenerator(regeneratorRuntime.mark(function _callee25(subjects) {
            for (var _len3 = arguments.length, verifySubjects = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                verifySubjects[_key3 - 1] = arguments[_key3];
            }

            var lookup, subjectsServer;
            return regeneratorRuntime.wrap(function _callee25$(_context25) {
                while (1) {
                    switch (_context25.prev = _context25.next) {
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

                            _context25.next = 5;
                            return subjectDaoInst.loadSubjects(-1);

                        case 5:
                            subjectsServer = _context25.sent;

                            assert.strictEqual(subjectsServer.length, verifySubjects.length);
                            verifySubjects.forEach(function (vs) {
                                return assert.equal(subjectsServer.find(function (ss) {
                                    return ss._id == vs._id;
                                }).path, vs.path);
                            });

                        case 8:
                        case 'end':
                            return _context25.stop();
                    }
                }
            }, _callee25, this);
        }));

        return function verifyPaths(_x3) {
            return _ref25.apply(this, arguments);
        };
    }();

    beforeEach(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(done) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            dao = new DAO();
                            _context.next = 3;
                            return dao.open();

                        case 3:
                            db = _context.sent;

                            subjectDaoInst = new SubjectDAO(-1);
                            done();

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());

    afterEach(function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(done) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return db.collection('subjects').remove({ userId: -1 });

                        case 2:
                            _context2.next = 4;
                            return db.collection('subjects').remove({ userId: -2 });

                        case 4:
                            dao.dispose(db);
                            done();

                        case 6:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function (_x2) {
            return _ref2.apply(this, arguments);
        };
    }());

    it('Prelim - test util functions', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 });

                    case 2:
                        subjects = _context3.sent;
                        _context3.next = 5;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: null });

                    case 5:
                        return _context3.abrupt('return', _context3.sent);

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    })));

    it('Update basic parent', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 });

                    case 2:
                        subjects = _context4.sent;
                        _context4.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context4.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' });

                    case 7:
                        return _context4.abrupt('return', _context4.sent);

                    case 8:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    })));

    it('Update basic parent - security check', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var subjects, subjectInServer;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return insertSubjects({ _id: 1, userId: -2 }, { _id: 2, userId: -2 });

                    case 2:
                        subjects = _context5.sent;
                        _context5.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context5.next = 7;
                        return db.collection('subjects').findOne({ _id: ObjectId(subjects[1]._id) });

                    case 7:
                        subjectInServer = _context5.sent;

                        assert(subjectInServer.path == null, 'subject was moved and shouldnt have been');

                    case 9:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    })));

    it('Set basic parent - security check on new parent', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var subjects, subjectInServer;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return insertSubjects({ _id: 1, userId: -2 }, { _id: 2, userId: -1 });

                    case 2:
                        subjects = _context6.sent;
                        _context6.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context6.next = 7;
                        return db.collection('subjects').findOne({ _id: ObjectId(subjects[1]._id) });

                    case 7:
                        subjectInServer = _context6.sent;

                        assert(subjectInServer.path == null, 'subject was moved and shouldnt have been');

                    case 9:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    })));

    it('Should update the child of a subject whose parent changes', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' });

                    case 2:
                        subjects = _context7.sent;
                        _context7.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context7.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' });

                    case 7:
                        return _context7.abrupt('return', _context7.sent);

                    case 8:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    })));

    it('Should update the child and grandchildren of a subject whose parent changes', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' });

                    case 2:
                        subjects = _context8.sent;
                        _context8.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context8.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' });

                    case 7:
                        return _context8.abrupt('return', _context8.sent);

                    case 8:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    })));

    it('Move a child which is also a parent up', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' });

                    case 2:
                        subjects = _context9.sent;
                        _context9.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[2]._id, null);

                    case 5:
                        _context9.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: null }, { _id: subjects[2]._id, path: null }, { _id: subjects[3]._id, path: ',20,' });

                    case 7:
                        return _context9.abrupt('return', _context9.sent);

                    case 8:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    })));

    it('Should update the child and grandchildren w/ siblings of a subject whose parent changes', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 202, path: ',2,20,' });

                    case 2:
                        subjects = _context10.sent;
                        _context10.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context10.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' });

                    case 7:
                        return _context10.abrupt('return', _context10.sent);

                    case 8:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    })));

    it('Should update the child, and grandchildren of a subject whose parent changes - other sibling not touched', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 3 });

                    case 2:
                        subjects = _context11.sent;
                        _context11.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context11.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id });

                    case 7:
                        return _context11.abrupt('return', _context11.sent);

                    case 8:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    })));

    it('Should update the child, grandchildren, and great grandchildren of a subject whose parent changes', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' });

                    case 2:
                        subjects = _context12.sent;
                        _context12.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[1]._id, subjects[0]._id);

                    case 5:
                        _context12.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,201,' });

                    case 7:
                        return _context12.abrupt('return', _context12.sent);

                    case 8:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    })));

    it('Above - change made deeper down', _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' });

                    case 2:
                        subjects = _context13.sent;
                        _context13.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id);

                    case 5:
                        _context13.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, { _id: subjects[4]._id, path: ',1,20,201,' });

                    case 7:
                        return _context13.abrupt('return', _context13.sent);

                    case 8:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    })));

    it('Above - two siblings to move (a)', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }, { _id: 2011, path: ',2,20,201,' });

                    case 2:
                        subjects = _context14.sent;
                        _context14.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[2]._id, subjects[0]._id);

                    case 5:
                        _context14.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',1,' }, { _id: subjects[3]._id, path: ',1,20,' }, { _id: subjects[4]._id, path: ',1,20,201,' }, { _id: subjects[5]._id, path: ',1,20,201,' });

                    case 7:
                        return _context14.abrupt('return', _context14.sent);

                    case 8:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, this);
    })));

    it('Above - change made even deeper down', _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' });

                    case 2:
                        subjects = _context15.sent;
                        _context15.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id);

                    case 5:
                        _context15.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, { _id: subjects[4]._id, path: ',1,201,' });

                    case 7:
                        return _context15.abrupt('return', _context15.sent);

                    case 8:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, this);
    })));

    it('Above - two siblings to move', _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _context16.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 2010, path: ',2,20,201,' }, { _id: 2011, path: ',2,20,201,' });

                    case 2:
                        subjects = _context16.sent;
                        _context16.next = 5;
                        return subjectDaoInst.updateSubjectParent(subjects[3]._id, subjects[0]._id);

                    case 5:
                        _context16.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id }, { _id: subjects[2]._id, path: ',2,' }, { _id: subjects[3]._id, path: ',1,' }, { _id: subjects[4]._id, path: ',1,201,' }, { _id: subjects[5]._id, path: ',1,201,' });

                    case 7:
                        return _context16.abrupt('return', _context16.sent);

                    case 8:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _callee16, this);
    })));

    it('UpdateSubjectInfo set new name', _asyncToGenerator(regeneratorRuntime.mark(function _callee17() {
        var subjects, updatedSub;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        _context17.next = 2;
                        return insertSubjects({ _id: 1, name: 'subject' }, { _id: 2, name: 'lala' });

                    case 2:
                        subjects = _context17.sent;
                        _context17.next = 5;
                        return subjectDaoInst.updateSubjectInfo(subjects[0]._id, 'foo', null);

                    case 5:
                        _context17.next = 7;
                        return db.collection('subjects').findOne({ _id: ObjectId(subjects[0]._id) });

                    case 7:
                        updatedSub = _context17.sent;

                        assert.strictEqual(updatedSub.name, 'foo');

                    case 9:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee17, this);
    })));

    it('UpdateSubjectInfo set new name - updateParent not called if not needed', _asyncToGenerator(regeneratorRuntime.mark(function _callee18() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        _context18.next = 2;
                        return insertSubjects({ _id: 1, name: 'subject' }, { _id: 2, name: 'lala' });

                    case 2:
                        subjects = _context18.sent;


                        subjectDaoInst.updateSubjectParent = function () {
                            throw 'I was called';
                        };
                        _context18.next = 6;
                        return subjectDaoInst.updateSubjectInfo(subjects[0]._id, 'foo', null);

                    case 6:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, _callee18, this);
    })));

    it('UpdateSubjectInfo -- set parent info', _asyncToGenerator(regeneratorRuntime.mark(function _callee19() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _context19.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' });

                    case 2:
                        subjects = _context19.sent;
                        _context19.next = 5;
                        return subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id);

                    case 5:
                        _context19.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' });

                    case 7:
                        return _context19.abrupt('return', _context19.sent);

                    case 8:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, _callee19, this);
    })));

    it('UpdateSubjectInfo -- set parent info', _asyncToGenerator(regeneratorRuntime.mark(function _callee20() {
        var subjects;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        _context20.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 20, path: ',2,' }, { _id: 201, path: ',2,20,' }, { _id: 202, path: ',2,20,' });

                    case 2:
                        subjects = _context20.sent;
                        _context20.next = 5;
                        return subjectDaoInst.updateSubjectInfo(subjects[1]._id, 'foo', subjects[0]._id);

                    case 5:
                        _context20.next = 7;
                        return verifyPaths(subjects, { _id: subjects[0]._id, path: null }, { _id: subjects[1]._id, path: ',1,' }, { _id: subjects[2]._id, path: ',1,2,' }, { _id: subjects[3]._id, path: ',1,2,20,' }, { _id: subjects[4]._id, path: ',1,2,20,' });

                    case 7:
                        return _context20.abrupt('return', _context20.sent);

                    case 8:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _callee20, this);
    })));

    it('set subject parent right return 1', _asyncToGenerator(regeneratorRuntime.mark(function _callee21() {
        var ids, resultSubjects;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        _context21.next = 2;
                        return insertSubjects({ _id: 1, name: 'a' }, { _id: 2, name: 'b' }, { _id: 3, path: ',2,', name: 'c' }, { _id: 4, path: ',2,3,', name: 'd' });

                    case 2:
                        ids = _context21.sent;
                        _context21.next = 5;
                        return subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id);

                    case 5:
                        resultSubjects = _context21.sent;
                        return _context21.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id));

                    case 7:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, _callee21, this);
    })));

    it('set subject parent right return 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee22() {
        var ids, resultSubjects;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        _context22.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 3, path: ',2,' }, { _id: 4, path: ',2,3,' }, { _id: 5, path: ',2,3,' });

                    case 2:
                        ids = _context22.sent;
                        _context22.next = 5;
                        return subjectDaoInst.updateSubjectParent(ids[1]._id, ids[0]._id);

                    case 5:
                        resultSubjects = _context22.sent;
                        return _context22.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[1]._id, ids[2]._id, ids[3]._id, ids[4]._id));

                    case 7:
                    case 'end':
                        return _context22.stop();
                }
            }
        }, _callee22, this);
    })));

    it('set subject parent right return 3', _asyncToGenerator(regeneratorRuntime.mark(function _callee23() {
        var ids, resultSubjects;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        _context23.next = 2;
                        return insertSubjects({ _id: 1 }, { _id: 2 }, { _id: 3, path: ',2,' }, { _id: 4, path: ',2,3,' }, { _id: 5, path: ',2,3,' });

                    case 2:
                        ids = _context23.sent;
                        _context23.next = 5;
                        return subjectDaoInst.updateSubjectParent(ids[4]._id, null);

                    case 5:
                        resultSubjects = _context23.sent;
                        return _context23.abrupt('return', verifyReturnedSubjects(resultSubjects, ids[4]._id));

                    case 7:
                    case 'end':
                        return _context23.stop();
                }
            }
        }, _callee23, this);
    })));

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
});