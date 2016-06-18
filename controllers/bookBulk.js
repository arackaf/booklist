'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _easyExpressControllers = require('easy-express-controllers');

var _amazonDataAccessAmazonSearchJs = require('../amazonDataAccess/AmazonSearch.js');

var _amazonDataAccessAmazonSearchJs2 = _interopRequireDefault(_amazonDataAccessAmazonSearchJs);

var _amazonDataAccessAmazonOperationQueue = require('../amazonDataAccess/amazonOperationQueue');

var _dataAccessBookDAO = require('../dataAccess/bookDAO');

var _dataAccessBookDAO2 = _interopRequireDefault(_dataAccessBookDAO);

var bookController = (function () {
    function bookController() {
        _classCallCheck(this, bookController);
    }

    _createDecoratedClass(bookController, [{
        key: 'setSubjects',
        decorators: [_easyExpressControllers.httpPost],
        value: function setSubjects(books, add, remove) {
            var bookDao;
            return regeneratorRuntime.async(function setSubjects$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        console.log(books, add, remove);
                        context$2$0.prev = 1;
                        bookDao = new _dataAccessBookDAO2['default']();
                        context$2$0.next = 5;
                        return regeneratorRuntime.awrap(bookDao.setBooksSubjects(books, add, remove));

                    case 5:
                        this.send({ success: true });
                        context$2$0.next = 11;
                        break;

                    case 8:
                        context$2$0.prev = 8;
                        context$2$0.t0 = context$2$0['catch'](1);
                        console.log(context$2$0.t0);
                    case 11:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this, [[1, 8]]);
        }
    }]);

    return bookController;
})();

exports['default'] = bookController;
module.exports = exports['default'];