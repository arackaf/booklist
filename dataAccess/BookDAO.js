'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MongoClient = require('mongodb').MongoClient;

var DAO = (function () {
    function DAO() {
        _classCallCheck(this, DAO);
    }

    _createClass(DAO, [{
        key: 'open',
        value: function open() {
            var _this = this;

            var result = MongoClient.connect('mongodb://localhost:27017/mongotest');
            Promise.resolve(result).then(function (db) {
                return _this.db = db;
            });
            return result;
        }
    }, {
        key: 'confirmSingleResult',
        value: function confirmSingleResult(res) {
            if (+res.result.n !== 1) {
                throw 'Object not inserted';
            }
        }
    }, {
        key: 'processSingleResultAndClose',
        value: function processSingleResultAndClose(p) {
            var _this2 = this;

            return p.then(function (result) {
                _this2.confirmSingleResult(result);
                _this2.dispose();
            }, function (err) {
                _this2.dispose();
                console.log(err);
                throw err;
            });
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.db.close();
        }
    }]);

    return DAO;
})();

var BookDAO = (function (_DAO) {
    _inherits(BookDAO, _DAO);

    function BookDAO(userId) {
        _classCallCheck(this, BookDAO);

        _get(Object.getPrototypeOf(BookDAO.prototype), 'constructor', this).call(this);
        this.userId = userId;
    }

    _createClass(BookDAO, [{
        key: 'saveBook',
        value: function saveBook(book) {
            var _this3 = this;

            return _get(Object.getPrototypeOf(BookDAO.prototype), 'open', this).call(this).then(function (db) {
                book.userId = _this3.userId;
                return _get(Object.getPrototypeOf(BookDAO.prototype), 'processSingleResultAndClose', _this3).call(_this3, db.collection('books').insert(book));
            });
        }
    }]);

    return BookDAO;
})(DAO);

module.exports = BookDAO;