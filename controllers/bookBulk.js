'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

var _easyExpressControllers = require('easy-express-controllers');

var _AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');

var _AmazonSearch2 = _interopRequireDefault(_AmazonSearch);

var _amazonOperationQueue = require('../amazonDataAccess/amazonOperationQueue');

var _bookDAO = require('../dataAccess/bookDAO');

var _bookDAO2 = _interopRequireDefault(_bookDAO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var bookController = (_class = function () {
    function bookController() {
        _classCallCheck(this, bookController);
    }

    _createClass(bookController, [{
        key: 'setSubjects',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(books, add, remove) {
                var bookDao;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                bookDao = new _bookDAO2.default();
                                _context.next = 4;
                                return bookDao.setBooksSubjects(books, add, remove);

                            case 4:
                                this.send({ success: true });
                                _context.next = 10;
                                break;

                            case 7:
                                _context.prev = 7;
                                _context.t0 = _context['catch'](0);
                                console.log(_context.t0);
                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 7]]);
            }));

            function setSubjects(_x, _x2, _x3) {
                return ref.apply(this, arguments);
            }

            return setSubjects;
        }()
    }]);

    return bookController;
}(), (_applyDecoratedDescriptor(_class.prototype, 'setSubjects', [_easyExpressControllers.httpPost], Object.getOwnPropertyDescriptor(_class.prototype, 'setSubjects'), _class.prototype)), _class);
exports.default = bookController;