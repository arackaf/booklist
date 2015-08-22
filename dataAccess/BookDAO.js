'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MongoClient = require('mongodb').MongoClient;

var BookDAO = (function () {
    function BookDAO(userId) {
        _classCallCheck(this, BookDAO);

        this.userId = userId;
    }

    _createClass(BookDAO, [{
        key: 'saveBook',
        value: function saveBook(book) {
            var _this = this;

            return MongoClient.connect('mongodb://localhost:27017/mongotest').then(function (db) {
                book.userId = _this.userId;
                return db.collection('books').insert(book).then(function (result) {
                    return db.close();
                });
            });
        }
    }]);

    return BookDAO;
})();

module.exports = BookDAO;