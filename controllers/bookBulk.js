'use strict';

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('easy-express-controllers');

var httpPost = _require.httpPost;
var route = _require.route;
var nonRoutable = _require.nonRoutable;

var AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');

var _require2 = require('../amazonDataAccess/amazonOperationQueue');

var amazonOperationQueue = _require2.amazonOperationQueue;

var BookDAO = require('../dataAccess/BookDAO');

var bookController = (function () {
    function bookController() {
        _classCallCheck(this, bookController);
    }

    _createDecoratedClass(bookController, [{
        key: 'setSubjects',
        decorators: [httpPost],
        value: function setSubjects(books, add, remove) {
            var bookDao;
            return regeneratorRuntime.async(function setSubjects$(context$2$0) {
                var _this = this;

                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        bookDao = new BookDAO();
                        context$2$0.next = 3;
                        return regeneratorRuntime.awrap(bookDao.setBooksSubjects(books, add, remove));

                    case 3:
                        setTimeout(function () {
                            return _this.send({ success: true });
                        }, 2000);

                    case 4:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        }
    }]);

    return bookController;
})();

module.exports = bookController;