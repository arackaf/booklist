'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _bootstrapButton = require('applicationRoot/components/bootstrapButton');

var _bootstrapButton2 = _interopRequireDefault(_bootstrapButton);

var _actionCreators = require('../reducers/books/actionCreators');

var actionCreatorsBooks = _interopRequireWildcard(_actionCreators);

var _actionCreators2 = require('../reducers/bookSearch/actionCreators');

var actionCreatorsBookSearch = _interopRequireWildcard(_actionCreators2);

var _actionCreators3 = require('../reducers/booksSubjectModification/actionCreators');

var actionCreatorsBookSubjectModification = _interopRequireWildcard(_actionCreators3);

var _actionCreators4 = require('../reducers/editBook/actionCreators');

var actionCreatorsEditBook = _interopRequireWildcard(_actionCreators4);

var _actionCreators5 = require('../reducers/booksTagModification/actionCreators');

var actionCreatorsBookTagModification = _interopRequireWildcard(_actionCreators5);

var _reducer = require('../reducers/reducer');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BookViewListMobileItem = function BookViewListMobileItem(props) {
    var publisherDisplay = null,
        isbnPages = null;
    if (props.publisher || props.publicationDate) {
        publisherDisplay = [props.publisher, props.publicationDate].filter(function (s) {
            return s;
        }).join(' ');
    }
    if (props.isbn || props.pages) {
        isbnPages = [props.pages ? props.pages + ' pages' : null, props.isbn ? 'ISBN ' + props.isbn : null].filter(function (o) {
            return o;
        }).join('; ');
    }

    var book = props.book;

    return _react2.default.createElement(
        'span',
        { className: 'list-group-item', style: { cursor: 'pointer' } },
        _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
                'div',
                { className: 'col-xs-3 col-sm-1' },
                _react2.default.createElement('img', { src: book.smallImage })
            ),
            _react2.default.createElement(
                'div',
                { className: 'col-xs-9 col-sm-11' },
                _react2.default.createElement(
                    'h4',
                    { className: 'list-group-item-heading' },
                    book.title
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'list-group-item-text' },
                    book.authors.length ? _react2.default.createElement(
                        'b',
                        null,
                        book.authors.join(', ')
                    ) : 'No author'
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    publisherDisplay ? _react2.default.createElement(
                        'p',
                        { className: 'list-group-item-text' },
                        publisherDisplay
                    ) : null,
                    isbnPages ? _react2.default.createElement(
                        'p',
                        { className: 'list-group-item-text' },
                        isbnPages
                    ) : null,
                    !props.viewingPublic ? _react2.default.createElement(
                        'button',
                        { className: 'btn btn-primary btn-xs', onClick: function onClick() {
                                return props.editBook(book);
                            } },
                        _react2.default.createElement('i', { className: 'fa fa-fw fa-pencil' })
                    ) : null,
                    !props.viewingPublic ? _react2.default.createElement(
                        'button',
                        { className: 'margin-left btn btn-danger btn-xs', onClick: function onClick() {
                                return props.setPendingDeleteBook(book);
                            } },
                        _react2.default.createElement('i', { className: 'fa fa-fw fa-trash' })
                    ) : null,
                    book.pendingDelete ? _react2.default.createElement(
                        _bootstrapButton.AjaxButton,
                        { running: book.deleting, runningText: 'Deleting', onClick: function onClick() {
                                return props.deleteBook(book);
                            }, className: 'margin-left btn btn-xs btn-danger' },
                        'Confirm delete'
                    ) : null,
                    book.pendingDelete ? _react2.default.createElement(
                        'button',
                        { onClick: function onClick() {
                                return props.cancelPendingDeleteBook(book);
                            }, className: 'margin-left btn btn-xs btn-primary' },
                        'Cancel'
                    ) : null
                )
            )
        )
    );
};

var BookViewListMobileItemConnected = (0, _reactRedux.connect)(_reducer.selector, _extends({}, actionCreatorsBooks, actionCreatorsEditBook))(BookViewListMobileItem);

var BookViewListMobile = function BookViewListMobile(props) {
    return _react2.default.createElement(
        'div',
        null,
        props.currentPage > 1 || props.hasMoreBooks ? _react2.default.createElement(
            'div',
            { style: { marginLeft: '10px', marginBottom: '10px' } },
            props.currentPage > 1 ? _react2.default.createElement(
                _bootstrapButton2.default,
                { style: { marginRight: '10px' }, preset: 'primary-xs', onClick: props.pageDown },
                _react2.default.createElement('i', { className: 'fa fa-fw fa-chevron-left' }),
                ' Previous'
            ) : null,
            props.hasMoreBooks ? _react2.default.createElement(
                _bootstrapButton2.default,
                { preset: 'primary-xs', onClick: props.pageUp },
                'Next ',
                _react2.default.createElement('i', { className: 'fa fa-fw fa-chevron-right' })
            ) : null
        ) : null,
        _react2.default.createElement(
            'div',
            { style: { paddingBottom: 15 } },
            _react2.default.createElement(
                'div',
                { style: { border: 0 }, className: 'list-group docked-to-panel' },
                props.books.map(function (book, i) {
                    return _react2.default.createElement(BookViewListMobileItemConnected, { key: book._id, book: book, viewingPublic: props.viewingPublic });
                })
            )
        ),
        props.currentPage > 1 || props.hasMoreBooks ? _react2.default.createElement(
            'div',
            { style: { marginLeft: '10px', marginTop: '10px', marginBottom: '10px' } },
            props.currentPage > 1 ? _react2.default.createElement(
                _bootstrapButton2.default,
                { style: { marginRight: '10px' }, preset: 'primary-xs', onClick: props.pageDown },
                _react2.default.createElement('i', { className: 'fa fa-fw fa-chevron-left' }),
                ' Previous'
            ) : null,
            props.hasMoreBooks ? _react2.default.createElement(
                _bootstrapButton2.default,
                { preset: 'primary-xs', onClick: props.pageUp },
                'Next ',
                _react2.default.createElement('i', { className: 'fa fa-fw fa-chevron-right' })
            ) : null
        ) : null
    );
};

var BookViewListMobileConnected = (0, _reactRedux.connect)(_reducer.selector, _extends({}, actionCreatorsBooks, actionCreatorsBookSubjectModification, actionCreatorsEditBook, actionCreatorsBookSearch, actionCreatorsBookTagModification))(BookViewListMobile);
exports.default = BookViewListMobileConnected;