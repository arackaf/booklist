//function eventualSortOfBookSavingControllerAction() {
//    var aSearch = new AmazonSearch(),
//        bookDAO = new BookDAO(1);
//    aSearch.lookupBook('0679764410').then(book => bookDAO.saveBook(book)).then(() => console.log('Book Saved'), err => console.log('Oops - error', err));
//}

'use strict';

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _require = require('easy-express-controllers');

var httpPost = _require.httpPost;
var route = _require.route;
var nonRoutable = _require.nonRoutable;

var bookController = (function () {
    function bookController() {
        _classCallCheck(this, bookController);
    }

    _createDecoratedClass(bookController, [{
        key: 'details',
        value: function details() {
            this.send({ title: 'Two Roads to Sumpter' });
        }
    }, {
        key: 'save',
        decorators: [httpPost],
        value: function save() {
            this.send({ saved: true });
        }
    }]);

    return bookController;
})();

module.exports = bookController;