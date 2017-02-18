'use strict';

var _reducer = require('../modules/books/reducers/bookSearch/reducer');

var _actionCreators = require('../modules/books/reducers/actionCreators');

var _actionNames = require('../modules/books/reducers/actionNames');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var assert = require('chai').assert;

describe('book search', function () {
    before(function () {});

    after(function () {});

    beforeEach(function () {});

    afterEach(function () {});

    it('set isDirty to true', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', {}, null)).isDirty);

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    })));

    it('set isDirty to true then false after load', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        assert.strictEqual(false, apply((0, _actionCreators.setFilters)('', {}, null), { type: _actionNames.LOAD_BOOKS }).isDirty);

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    })));

    it('set isDirty to true then false after load, keep false for non-changing set filters call', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        assert.strictEqual(false, apply((0, _actionCreators.setFilters)('', {}, null), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', {}, null)).isDirty);

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    })));

    it('set isDirty to true then false after load, keep false for non-changing set filters call 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        assert.strictEqual(false, apply((0, _actionCreators.setFilters)('', { a: true }, null), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', { a: true }, null)).isDirty);

                    case 1:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    })));

    it('set isDirty to true then false after load, keep false for non-changing set filters call 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        assert.strictEqual(false, apply((0, _actionCreators.setFilters)('', { a: true }, true), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', { a: true }, true)).isDirty);

                    case 1:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    })));

    it('searchChildSubjects resets isDirty properly', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', { a: true }, true), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', { a: true }, null)).isDirty);

                    case 1:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    })));

    it('searchChildSubjects resets isDirty properly', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', { a: true }, null), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', { a: true }, true)).isDirty);

                    case 1:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    })));

    it('subjects change resets isDirty properly', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', { a: true }, true), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', {}, true)).isDirty);

                    case 1:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    })));

    it('subjects change resets isDirty properly 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', {}, true), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('', { a: true }, true)).isDirty);

                    case 1:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    })));

    it('text change resets isDirty properly 2', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        assert.strictEqual(true, apply((0, _actionCreators.setFilters)('', { a: true }, true), { type: _actionNames.LOAD_BOOKS }, (0, _actionCreators.setFilters)('a', { a: true }, true)).isDirty);

                    case 1:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    })));

    function apply() {
        var state = (0, _reducer.bookSearchReducer)(undefined, { type: '________' });

        for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
            actions[_key] = arguments[_key];
        }

        actions.forEach(function (a) {
            return state = (0, _reducer.bookSearchReducer)(state, a);
        });
        return state;
    }
});