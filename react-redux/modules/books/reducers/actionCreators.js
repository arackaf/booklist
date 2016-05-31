'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.loadSubjects = loadSubjects;
exports.loadBooks = loadBooks;
exports.booksSearch = booksSearch;
exports.booksResults = booksResults;
exports.editSubjects = editSubjects;
exports.setNewSubjectName = setNewSubjectName;
exports.setNewSubjectParent = setNewSubjectParent;
exports.stopEditingSubjects = stopEditingSubjects;
exports.editSubject = editSubject;
exports.newSubject = newSubject;
exports.createOrUpdateSubject = createOrUpdateSubject;
exports.deleteSubject = deleteSubject;
exports.toggleSelectBook = toggleSelectBook;
exports.setFilters = setFilters;
exports.setSortOrder = setSortOrder;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _actionNames = require('./actionNames');

var _booksSubjectModificationActionCreators = require('./booksSubjectModification/actionCreators');

Object.defineProperty(exports, 'enableSubjectModificationSingleBook', {
    enumerable: true,
    get: function get() {
        return _booksSubjectModificationActionCreators.enableSubjectModificationSingleBook;
    }
});
Object.defineProperty(exports, 'enableSubjectModificationToggledBooks', {
    enumerable: true,
    get: function get() {
        return _booksSubjectModificationActionCreators.enableSubjectModificationToggledBooks;
    }
});

var _editBookActionCreators = require('./editBook/actionCreators');

_defaults(exports, _interopExportWildcard(_editBookActionCreators, _defaults));

function loadSubjects() {
    return function (dispatch, getState) {
        dispatch({ type: _actionNames.LOAD_SUBJECTS });

        Promise.resolve(ajaxUtil.get('/subject/all')).then(function (subjectsResp) {
            dispatch({ type: _actionNames.LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results });
        });
    };
}

function loadBooks() {
    return function (dispatch, getState) {
        dispatch({ type: _actionNames.LOAD_BOOKS });

        Promise.resolve(booksSearch(getState().books.bookSearch)).then(function (booksResp) {
            return dispatch(booksResults(booksResp));
        });
    };
}

function booksSearch(bookSearchState) {
    return ajaxUtil.get('/book/searchBooks', {
        search: bookSearchState.searchText,
        subjects: Object.keys(bookSearchState.subjects),
        searchChildSubjects: bookSearchState.searchChildSubjects,
        sort: bookSearchState.sort,
        sortDirection: bookSearchState.sortDirection
    });
}

function booksResults(resp) {
    return { type: _actionNames.LOAD_BOOKS_RESULTS, books: resp.results };
}

function editSubjects() {
    return { type: _actionNames.EDIT_SUBJECTS };
}

function setNewSubjectName(newName) {
    return { type: _actionNames.SET_NEW_SUBJECT_NAME, value: newName };
}

function setNewSubjectParent(newParent) {
    return { type: _actionNames.SET_NEW_SUBJECT_PARENT, value: newParent };
}

function stopEditingSubjects() {
    return { type: _actionNames.STOP_EDITING_SUBJECTS };
}

function editSubject(_id) {
    return { type: _actionNames.EDIT_SUBJECT, _id: _id };
}

function newSubject() {
    return { type: _actionNames.NEW_SUBJECT };
}

function createOrUpdateSubject() {
    return function (dispatch, getState) {
        var _getState$books$subjects$editSubjectsPacket = getState().books.subjects.editSubjectsPacket;
        var editingSubject = _getState$books$subjects$editSubjectsPacket.editingSubject;
        var newName = _getState$books$subjects$editSubjectsPacket.newSubjectName;
        var newParent = _getState$books$subjects$editSubjectsPacket.newSubjectParent;
        var request = { _id: editingSubject ? editingSubject._id : null, newName: newName, newParent: newParent };

        ajaxUtil.post('/subject/setInfo', request, function (resp) {
            dispatch({ type: _actionNames.UPDATE_SUBJECT_RESULTS, newName: newName, newParent: newParent, affectedSubjects: resp.affectedSubjects });
        });
    };
}

function deleteSubject() {
    return function (dispatch, getState) {
        var request = { _id: getState().books.subjects.editSubjectsPacket.editingSubject._id + '' };
        ajaxUtil.post('/subject/delete', request, function (resp) {
            dispatch({ type: _actionNames.SUBJECT_DELETED, subjectId: request._id, booksUpdated: resp.booksUpdated });
        });
    };
}

function toggleSelectBook(_id, selected) {
    return { type: _actionNames.TOGGLE_SELECT_BOOK, _id: _id, selected: selected };
}

function setFilters(text, subjects, searchChildSubjects) {
    return { type: _actionNames.SET_FILTERS, text: text, subjects: subjects, searchChildSubjects: searchChildSubjects };
}

function setSortOrder(sort, direction) {
    return { type: _actionNames.SET_SORT_DIRECTION, sort: sort, direction: direction };
}