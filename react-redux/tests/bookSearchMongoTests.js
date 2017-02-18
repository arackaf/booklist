'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var assert = require('chai').assert;
var ObjectId = require('mongodb').ObjectID;

var DAO = require('../../dataAccess/DAO');
var BookDAO = require('../../dataAccess/bookDAO');

describe('book search', function () {
    var verifyResults = function () {
        var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(searchPacket, bookIdLookup) {
            for (var _len = arguments.length, resultIds = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                resultIds[_key - 2] = arguments[_key];
            }

            var subjectSearch, results;
            return regeneratorRuntime.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            subjectSearch = (searchPacket.subjects || []).map(function (sid) {
                                return subjects.find(function (s) {
                                    return s.oldId == sid;
                                })._id + '';
                            });
                            _context15.next = 3;
                            return bookDaoInst.searchBooks({ search: searchPacket.search, subjects: subjectSearch, searchChildSubjects: searchPacket.searchChildSubjects });

                        case 3:
                            results = _context15.sent;


                            assert.strictEqual(results.length, resultIds.length);

                            resultIds.forEach(function (_id) {
                                var found = results.find(function (b) {
                                    return '' + b._id == '' + bookIdLookup[_id];
                                });
                                assert.isObject(found);
                            });

                        case 6:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, _callee15, this);
        }));

        return function verifyResults(_x5, _x6) {
            return _ref15.apply(this, arguments);
        };
    }();

    var insertBooks = function () {
        var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
            for (var _len2 = arguments.length, books = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                books[_key2] = arguments[_key2];
            }

            var lookup;
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            lookup = {};


                            books.forEach(function (b) {
                                b.userId = b.userId || -1;
                                b.oldId = b._id;
                                b._id = ObjectId();
                                b.subjects = (b.subjects || []).map(function (sid) {
                                    return subjects.find(function (s) {
                                        return s.oldId == sid;
                                    })._id;
                                });
                                lookup[b.oldId] = '' + b._id;
                            });

                            _context16.next = 4;
                            return Promise.all(books.map(function (s) {
                                return db.collection('books').insert(s);
                            }));

                        case 4:
                            return _context16.abrupt('return', lookup);

                        case 5:
                        case 'end':
                            return _context16.stop();
                    }
                }
            }, _callee16, this);
        }));

        return function insertBooks() {
            return _ref16.apply(this, arguments);
        };
    }();

    var dao = void 0,
        db = void 0,
        bookDaoInst = void 0;

    var subjects = [{ _id: 1, name: 'History', path: null, userId: -1 }, { _id: 2, name: 'American History', path: ',1,', userId: -1 }, { _id: 3, name: 'Civil War', path: ',1,2,', userId: -1 }, { _id: 4, name: 'Science', path: null, userId: -1 }, { _id: 5, name: 'Physics', path: ',4,', userId: -1 }];

    before(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(done) {
            var fixedPath;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            dao = new DAO();
                            _context.next = 3;
                            return dao.open();

                        case 3:
                            db = _context.sent;


                            subjects.forEach(function (s) {
                                s.userId = s.userId || -1;
                                s.oldId = s._id;
                                s._id = ObjectId();
                            });

                            fixedPath = function fixedPath(path) {
                                return ',' + path.split(',').filter(function (id) {
                                    return id;
                                }).map(function (sid) {
                                    return subjects.find(function (s) {
                                        return s.oldId == sid;
                                    })._id;
                                }).join(',') + ',';
                            };

                            subjects.forEach(function (s) {
                                return s.path = !s.path ? s.path : fixedPath(s.path);
                            });

                            _context.next = 9;
                            return Promise.all(subjects.map(function (s) {
                                return db.collection('subjects').insert(s);
                            }));

                        case 9:
                            subjects.forEach(function (s) {
                                return s._id = s._id + '';
                            });

                            done();

                        case 11:
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

    after(function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(done) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return db.collection('subjects').remove({ userId: -1 });

                        case 2:
                            dao.dispose(db);
                            done();

                        case 4:
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

    beforeEach(function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(done) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            bookDaoInst = new BookDAO(-1);
                            done();

                        case 2:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        return function (_x3) {
            return _ref3.apply(this, arguments);
        };
    }());

    afterEach(function () {
        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(done) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return db.collection('books').remove({ userId: -1 });

                        case 2:
                            _context4.next = 4;
                            return db.collection('books').remove({ userId: -2 });

                        case 4:
                            done();

                        case 5:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        return function (_x4) {
            return _ref4.apply(this, arguments);
        };
    }());

    it('searches a basic title text', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return insertBooks({ _id: 1, title: 'Thomas Jefferson' }, { _id: 2, title: 'Thomas Kuhn' }, { _id: 3, title: 'Thomas Jefferson', userId: -2 });

                    case 2:
                        lookup = _context5.sent;
                        _context5.next = 5;
                        return verifyResults({ search: 'Thomas' }, lookup, 1, 2);

                    case 5:
                        return _context5.abrupt('return', _context5.sent);

                    case 6:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    })));

    it('searches a subject', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context6.sent;
                        _context6.next = 5;
                        return verifyResults({ subjects: [3] }, lookup, 1);

                    case 5:
                        return _context6.abrupt('return', _context6.sent);

                    case 6:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    })));

    it('searches both - no results', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Jefferson' }, { _id: 3, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context7.sent;
                        _context7.next = 5;
                        return verifyResults({ search: 'Jeff', subjects: [3] }, lookup);

                    case 5:
                        return _context7.abrupt('return', _context7.sent);

                    case 6:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    })));

    it('searches both', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Jefferson Davis', subjects: [3] }, { _id: 3, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context8.sent;
                        _context8.next = 5;
                        return verifyResults({ search: 'Jeff', subjects: [3] }, lookup, 2);

                    case 5:
                        return _context8.abrupt('return', _context8.sent);

                    case 6:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    })));

    it('searches both - bad ids', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3], userId: -2 }, { _id: 2, title: 'Jefferson', userId: -2 }, { _id: 3, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context9.sent;
                        _context9.next = 5;
                        return verifyResults({ search: 'Jeff', subjects: [3] }, lookup);

                    case 5:
                        return _context9.abrupt('return', _context9.sent);

                    case 6:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    })));

    it('searches basic child subject chain', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context10.sent;
                        _context10.next = 5;
                        return verifyResults({ subjects: [1], searchChildSubjects: true }, lookup, 1);

                    case 5:
                        return _context10.abrupt('return', _context10.sent);

                    case 6:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    })));

    it('searches 2 subject chains', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context11.sent;
                        _context11.next = 5;
                        return verifyResults({ subjects: [1, 4], searchChildSubjects: true }, lookup, 1, 2);

                    case 5:
                        return _context11.abrupt('return', _context11.sent);

                    case 6:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    })));

    it('searches 2 subject chains with a specific match', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context12.sent;
                        _context12.next = 5;
                        return verifyResults({ subjects: [1, 4], searchChildSubjects: true }, lookup, 1, 2, 3);

                    case 5:
                        return _context12.abrupt('return', _context12.sent);

                    case 6:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    })));

    it('does not search subject chains when not told to do so', _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context13.sent;
                        _context13.next = 5;
                        return verifyResults({ subjects: [1, 4], searchChildSubjects: false }, lookup, 3);

                    case 5:
                        return _context13.abrupt('return', _context13.sent);

                    case 6:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    })));

    it('intersects subject chain searches with title searches', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
        var lookup;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] });

                    case 2:
                        lookup = _context14.sent;
                        _context14.next = 5;
                        return verifyResults({ search: 'civil', subjects: [1, 4], searchChildSubjects: true }, lookup, 1);

                    case 5:
                        return _context14.abrupt('return', _context14.sent);

                    case 6:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, this);
    })));
});