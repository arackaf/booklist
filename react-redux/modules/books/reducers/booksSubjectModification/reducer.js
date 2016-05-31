'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _actionNames = require('./actionNames');

var _require = require('react-redux-util/reselect');

var createSelector = _require.createSelector;

var bookSubjectManagerInitialState = {
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {},
    settingBooksSubjects: false
};

function bookSubjectManagerReducer(state, action) {
    if (state === undefined) state = bookSubjectManagerInitialState;

    switch (action.type) {
        case _actionNames.SETTING_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: true });
        case _actionNames.SET_BOOKS_SUBJECTS:
            return Object.assign({}, state, { settingBooksSubjects: false });
        case _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { singleBookModify: action._id });
        case _actionNames.ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { selectedBooksModify: true });
        case _actionNames.CLEAR_SUBJECT_MODIFICATION_SUBJECTS:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {} });
        case _actionNames.CANCEL_BOOKS_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { singleBookModify: null, selectedBooksModify: false });
        case _actionNames.TOGGLE_SUBJECT_ADD_FOR_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { addingSubjects: _extends({}, state.addingSubjects, _defineProperty({}, action._id, !state.addingSubjects[action._id])) });
        case _actionNames.FINISHED_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { addingSubjects: {}, removingSubjects: {}, singleBookModify: null, selectedBooksModify: false });
        case _actionNames.TOGGLE_SUBJECT_REMOVE_FOR_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { removingSubjects: _extends({}, state.removingSubjects, _defineProperty({}, action._id, !state.removingSubjects[action._id])) });
    }
    return state;
}

var modifyingBooksSelector = createSelector([function (state) {
    return state.booksSubjectsModifier.singleBookModify;
}, function (state) {
    return state.booksSubjectsModifier.selectedBooksModify;
}, function (state) {
    return state.books;
}], function (singleBookModify, selectedBooksModify, books) {
    var modifyingBookIds = singleBookModify ? [singleBookModify] : selectedBooksModify ? Object.keys(books.selectedBooks).filter(function (k) {
        return books.selectedBooks[k];
    }) : [];
    return modifyingBookIds.filter(function (_id) {
        return _id;
    }).map(function (_id) {
        return books.booksHash[_id];
    });
});

var addingSubjectsSelector = createSelector([function (state) {
    return state.booksSubjectsModifier.addingSubjects;
}, function (state) {
    return state.subjects.subjectHash;
}], function (adding, subjects) {
    return Object.keys(adding).filter(function (_id) {
        return adding[_id];
    }).map(function (_id) {
        return subjects[_id];
    });
});

var removingSubjectsSelector = createSelector([function (state) {
    return state.booksSubjectsModifier.removingSubjects;
}, function (state) {
    return state.subjects.subjectHash;
}], function (removing, subjects) {
    return Object.keys(removing).filter(function (_id) {
        return removing[_id];
    }).map(function (_id) {
        return subjects[_id];
    });
});

var booksSubjectsModifierSelector = createSelector([function (state) {
    return state.booksSubjectsModifier;
}, modifyingBooksSelector, addingSubjectsSelector, removingSubjectsSelector], function (booksSubjectsModifier, modifyingBooks, addingSubjects, removingSubjects) {
    return {
        addingSubjectIds: booksSubjectsModifier.addingSubjects,
        removingSubjectIds: booksSubjectsModifier.removingSubjects,
        settingBooksSubjects: booksSubjectsModifier.settingBooksSubjects,
        modifyingBooks: modifyingBooks,
        addingSubjects: addingSubjects,
        removingSubjects: removingSubjects
    };
});

module.exports = { bookSubjectManagerReducer: bookSubjectManagerReducer, booksSubjectsModifierSelector: booksSubjectsModifierSelector };