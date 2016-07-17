'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dao = require('./dao');

var _dao2 = _interopRequireDefault(_dao);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagDAO = function (_DAO) {
    _inherits(TagDAO, _DAO);

    function TagDAO(userId) {
        _classCallCheck(this, TagDAO);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TagDAO).call(this));

        _this.userId = userId;
        return _this;
    }

    _createClass(TagDAO, [{
        key: 'deleteTag',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_id) {
                var db;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _get(Object.getPrototypeOf(TagDAO.prototype), 'open', this).call(this);

                            case 2:
                                db = _context.sent;
                                _context.next = 5;
                                return db.collection('tags').remove({ _id: (0, _mongodb.ObjectId)(_id), userId: this.userId });

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function deleteTag(_x) {
                return ref.apply(this, arguments);
            }

            return deleteTag;
        }()
    }, {
        key: 'loadTags',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(userId) {
                var db, userIdToUse, _ref, _ref2, tags, labelColors;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _get(Object.getPrototypeOf(TagDAO.prototype), 'open', this).call(this);

                            case 2:
                                db = _context2.sent;
                                userIdToUse = userId || this.userId;
                                _context2.prev = 4;
                                _context2.next = 7;
                                return Promise.all([db.collection('tags').find({ userId: userIdToUse }).sort({ name: 1 }).toArray(), db.collection('labelColors').find({}).sort({ order: 1 }).toArray()]);

                            case 7:
                                _ref = _context2.sent;
                                _ref2 = _slicedToArray(_ref, 2);
                                tags = _ref2[0];
                                labelColors = _ref2[1];
                                return _context2.abrupt('return', { tags: tags, labelColors: labelColors });

                            case 12:
                                _context2.prev = 12;

                                _get(Object.getPrototypeOf(TagDAO.prototype), 'dispose', this).call(this, db);
                                return _context2.finish(12);

                            case 15:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[4,, 12, 15]]);
            }));

            function loadTags(_x2) {
                return ref.apply(this, arguments);
            }

            return loadTags;
        }()
    }, {
        key: 'updateTagInfo',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_id, name, backgroundColor, textColor) {
                var db, newPath, newTag;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return _get(Object.getPrototypeOf(TagDAO.prototype), 'open', this).call(this);

                            case 2:
                                db = _context3.sent;
                                _context3.prev = 3;

                                if (_id) {
                                    _context3.next = 10;
                                    break;
                                }

                                newPath = null;
                                newTag = { name: name, backgroundColor: backgroundColor, textColor: textColor, path: newPath, userId: this.userId };
                                _context3.next = 9;
                                return db.collection('tags').insert(newTag);

                            case 9:
                                return _context3.abrupt('return', { tag: newTag });

                            case 10:
                                _context3.next = 12;
                                return db.collection('tags').update({ _id: (0, _mongodb.ObjectId)(_id), userId: this.userId }, { $set: { name: name, backgroundColor: backgroundColor, textColor: textColor } });

                            case 12:
                                return _context3.abrupt('return', { tag: { _id: _id, name: name, backgroundColor: backgroundColor, textColor: textColor } });

                            case 13:
                                _context3.prev = 13;

                                _get(Object.getPrototypeOf(TagDAO.prototype), 'dispose', this).call(this, db);
                                return _context3.finish(13);

                            case 16:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[3,, 13, 16]]);
            }));

            function updateTagInfo(_x3, _x4, _x5, _x6) {
                return ref.apply(this, arguments);
            }

            return updateTagInfo;
        }()
    }]);

    return TagDAO;
}(_dao2.default);

exports.default = TagDAO;