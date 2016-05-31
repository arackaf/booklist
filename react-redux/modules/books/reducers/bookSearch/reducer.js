'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actionNames = require('../actionNames');

var initialState = {
    searchText: '',
    subjects: {},
    sort: '',
    sortDirection: '',
    searchChildSubjects: false,
    isDirty: false
};

function bookSearchReducer(state, action) {
    if (state === undefined) state = initialState;

    switch (action.type) {
        case _actionNames.SET_FILTERS:
            var newIsDirty = state.searchText != action.text || subjectsDifferent(state.subjects, action.subjects) || state.searchChildSubjects != action.searchChildSubjects;

            return Object.assign({}, state, {
                searchText: action.text,
                subjects: _extends({}, action.subjects),
                searchChildSubjects: action.searchChildSubjects,
                isDirty: newIsDirty
            });
        case _actionNames.LOAD_BOOKS:
            return Object.assign({}, state, { isDirty: false });
        case _actionNames.SET_SORT_DIRECTION:
            return Object.assign({}, state, { sort: action.sort, sortDirection: action.direction, isDirty: true });
    }
    return state;
}

function subjectsDifferent(oldSubjects, newSubjects) {
    return Object.keys(oldSubjects).filter(function (k) {
        return oldSubjects[k];
    }).sort().join('-') !== Object.keys(newSubjects).filter(function (k) {
        return newSubjects[k];
    }).sort().join('-');
}

function projectselectedSubjects(selectedSubjectsIds, subjects) {
    //last filter since subjects might not be loaded yet
    return Object.keys(selectedSubjectsIds).filter(function (k) {
        return selectedSubjectsIds[k];
    }).map(function (_id) {
        return subjects[_id];
    }).filter(function (s) {
        return s;
    });
}

var bookSearchSelector = function bookSearchSelector(state) {
    return Object.assign({}, state.bookSearch, { selectedSubjects: projectselectedSubjects(state.bookSearch.subjects, state.subjects.subjectHash) });
};

module.exports = { bookSearchReducer: bookSearchReducer, bookSearchSelector: bookSearchSelector };