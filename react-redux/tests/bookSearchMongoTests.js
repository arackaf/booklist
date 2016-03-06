'use strict';

var assert = require('chai').assert;
var ObjectId = require('mongodb').ObjectID;

var DAO = require('../../dataAccess/DAO');
var BookDAO = require('../../dataAccess/BookDAO');

describe('book search', function () {
    var dao = undefined,
        db = undefined,
        bookDaoInst = undefined;

    var subjects = [{ _id: 1, name: 'History', path: null, userId: -1 }, { _id: 2, name: 'American History', path: ',1,', userId: -1 }, { _id: 3, name: 'Civil War', path: ',1,2,', userId: -1 }, { _id: 4, name: 'Science', path: null, userId: -1 }, { _id: 5, name: 'Physics', path: ',4,', userId: -1 }];

    before(function callee$1$0(done) {
        var fixedPath;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    dao = new DAO();
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(dao.open());

                case 3:
                    db = context$2$0.sent;

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

                    context$2$0.next = 9;
                    return regeneratorRuntime.awrap(Promise.all(subjects.map(function (s) {
                        return db.collection('subjects').insert(s);
                    })));

                case 9:
                    subjects.forEach(function (s) {
                        return s._id = s._id + '';
                    });

                    done();

                case 11:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    after(function callee$1$0(done) {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(db.collection('subjects').remove({ userId: -1 }));

                case 2:
                    dao.dispose(db);
                    done();

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    beforeEach(function callee$1$0(done) {
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    bookDaoInst = new BookDAO(-1);
                    done();

                case 2:
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
                    return regeneratorRuntime.awrap(db.collection('books').remove({ userId: -1 }));

                case 2:
                    context$2$0.next = 4;
                    return regeneratorRuntime.awrap(db.collection('books').remove({ userId: -2 }));

                case 4:
                    done();

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches a basic title text', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Thomas Jefferson' }, { _id: 2, title: 'Thomas Kuhn' }, { _id: 3, title: 'Thomas Jefferson', userId: -2 }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ search: 'Thomas' }, lookup, 1, 2));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches a subject', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ subjects: [3] }, lookup, 1));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches both - no results', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Jefferson' }, { _id: 3, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ search: 'Jeff', subjects: [3] }, lookup));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches both', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Jefferson Davis', subjects: [3] }, { _id: 3, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ search: 'Jeff', subjects: [3] }, lookup, 2));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches both - bad ids', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3], userId: -2 }, { _id: 2, title: 'Jefferson', userId: -2 }, { _id: 3, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ search: 'Jeff', subjects: [3] }, lookup));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches basic child subject chain', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ subjects: [1], searchChildSubjects: true }, lookup, 1));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches 2 subject chains', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ subjects: [1, 4], searchChildSubjects: true }, lookup, 1, 2));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('searches 2 subject chains with a specific match', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ subjects: [1, 4], searchChildSubjects: true }, lookup, 1, 2, 3));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('does not search subject chains when not told to do so', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ subjects: [1, 4], searchChildSubjects: false }, lookup, 3));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    it('intersects subject chain searches with title searches', function callee$1$0() {
        var lookup;
        return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return regeneratorRuntime.awrap(insertBooks({ _id: 1, title: 'Civil War', subjects: [3] }, { _id: 2, title: 'Physics book', subjects: [5] }, { _id: 3, title: 'Science book', subjects: [4] }, { _id: 4, title: 'other', subjects: [] }));

                case 2:
                    lookup = context$2$0.sent;
                    context$2$0.next = 5;
                    return regeneratorRuntime.awrap(verifyResults({ search: 'civil', subjects: [1, 4], searchChildSubjects: true }, lookup, 1));

                case 5:
                    return context$2$0.abrupt('return', context$2$0.sent);

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    });

    function verifyResults(searchPacket, bookIdLookup) {
        for (var _len = arguments.length, resultIds = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            resultIds[_key - 2] = arguments[_key];
        }

        var subjectSearch, results;
        return regeneratorRuntime.async(function verifyResults$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    subjectSearch = (searchPacket.subjects || []).map(function (sid) {
                        return ObjectId(subjects.find(function (s) {
                            return s.oldId == sid;
                        })._id);
                    });
                    context$2$0.next = 3;
                    return regeneratorRuntime.awrap(bookDaoInst.searchBooks(searchPacket.search, subjectSearch, searchPacket.searchChildSubjects));

                case 3:
                    results = context$2$0.sent;

                    assert.strictEqual(results.length, resultIds.length);

                    resultIds.forEach(function (_id) {
                        var found = results.find(function (b) {
                            return '' + b._id == '' + bookIdLookup[_id];
                        });
                        assert.isObject(found);
                    });

                case 6:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    }

    function insertBooks() {
        for (var _len2 = arguments.length, books = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            books[_key2] = arguments[_key2];
        }

        var lookup;
        return regeneratorRuntime.async(function insertBooks$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    lookup = {};

                    books.forEach(function (b) {
                        b.userId = b.userId || -1;
                        b.oldId = b._id;
                        b._id = ObjectId();
                        b.subjects = (b.subjects || []).map(function (sid) {
                            return ObjectId(subjects.find(function (s) {
                                return s.oldId == sid;
                            })._id);
                        });
                        lookup[b.oldId] = '' + b._id;
                    });

                    context$2$0.next = 4;
                    return regeneratorRuntime.awrap(Promise.all(books.map(function (s) {
                        return db.collection('books').insert(s);
                    })));

                case 4:
                    return context$2$0.abrupt('return', lookup);

                case 5:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    }
});