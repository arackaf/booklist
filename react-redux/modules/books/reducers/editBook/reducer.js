'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = reducer;

var _actionNames = require('./actionNames');

var initialState = {
    isEditing: false,
    editingBook: {},
    editingBookSaving: false,
    editingBookSaved: false
};

function reducer(state, action) {
    if (state === undefined) state = initialState;

    switch (action.type) {
        case _actionNames.EDIT_BOOK:
            return _extends({}, state, { editingBook: action.book, isEditing: true });
        case _actionNames.STOP_EDITING_BOOK:
            return _extends({}, state, { editingBookSaved: false, editingBookSaving: false, isEditing: false }); //leave the book object so the modal fade is a bit nicer
        case _actionNames.EDITING_BOOK_SAVING:
            return _extends({}, state, { editingBookSaving: true });
        case _actionNames.EDITING_BOOK_SAVED:
            return _extends({}, state, { editingBookSaving: false, editingBookSaved: true, isEditing: false }); //close the modal immediately
        case _actionNames.EDIT_BOOK_RESET:
            return _extends({}, initialState);
    }
    return state;
}

module.exports = exports['default'];