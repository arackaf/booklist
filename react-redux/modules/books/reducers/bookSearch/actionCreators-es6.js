import {
    BEGIN_FILTER_CHANGE,
    TOGGLE_PENDING_SUBJECT,
    END_FILTER_CHANGE,
    SET_SORT_DIRECTION,
    SET_FILTERS,
    SET_PENDING_SEARCH,
    APPLY_PENDING_SEARCH,
    SET_PENDING_CHILD_SUBJECTS
} from './actionNames';
import { loadBooks } from '../actionCreators';

import { globalHashManager } from 'react-startup';

export function beginFilterChange(){
    return { type: BEGIN_FILTER_CHANGE };
}

export function togglePendingSubject(_id){
    return { type: TOGGLE_PENDING_SUBJECT, _id };
}

export function endFilterChanging(){
    return { type: END_FILTER_CHANGE };
}

export function applyFilters(){
    return function(dispatch, getState) {
        let state = getState().books.bookSearch,
            filterSubjectsVal = Object.keys(state.pendingSubjects).filter(k => state.pendingSubjects[k]).join('-');

        globalHashManager.setValues(
            'filterSubjects', filterSubjectsVal,
            'searchChildSubjects', state.pendingSearchChildSubjects && filterSubjectsVal ? 'true' : null
        );
        dispatch(endFilterChanging());
    }
}

export function setSortOrder(sort, direction){
    return { type: SET_SORT_DIRECTION, sort, direction };
}

export function setFilters(text, subjects, searchChildSubjects){
    return { type: SET_FILTERS, text, subjects, searchChildSubjects }
}

export function syncFiltersToHash(){
    return function(dispatch, getState){
        let state = getState().books.bookSearch;

        let subjectsSelected = {},
            selectedSubjectsHashString = globalHashManager.getCurrentHashValueOf('filterSubjects');
        if (selectedSubjectsHashString){
            selectedSubjectsHashString.split('-').forEach(_id => subjectsSelected[_id] = true);
        }

        let hashSearch = (globalHashManager.getCurrentHashValueOf('bookSearch') || ''),
            hashSearchChildren = globalHashManager.getCurrentHashValueOf('searchChildSubjects') ? 'true' : null;

        let newIsDirty =
            state.searchText !=  hashSearch ||
            subjectsDifferent(state.subjects, subjectsSelected) ||
            state.searchChildSubjects != hashSearchChildren;

        if (newIsDirty) {
            dispatch(setFilters(
                hashSearch,
                subjectsSelected,
                hashSearchChildren));

            dispatch(loadBooks());
        }
    };
}

export function setPendingSearch(value){
    return { type: SET_PENDING_SEARCH, value }
}

export function pendingSearchModified(evt){
    return function(dispatch, getState) {
        if (evt.which == 13) {
            let pendingSearch = getState().books.bookSearch.pendingSearch;
            globalHashManager.setValueOf('bookSearch', pendingSearch);
        } else {
            dispatch(setPendingSearch(evt.target.value));
        }
    };
}

export function removeFilterSubject(_id) {
    return function(dispatch, getState) {
        let state = getState().books.bookSearch,
            newSubjects = Object.keys(state.subjects).filter(sId => sId != _id).join('-');

        globalHashManager.setValues(
            'filterSubjects', newSubjects,
            'searchChildSubjects', state.searchChildSubjects && newSubjects ? 'true' : null
        );
    };
}

export function setPendingChildSubjects(evt){
    return function(dispatch, getState){
        dispatch({ type: SET_PENDING_CHILD_SUBJECTS, value: evt.target.checked })
    };
}

function subjectsDifferent(oldSubjects, newSubjects){
    return Object.keys(oldSubjects).filter(k => oldSubjects[k]).sort().join('-') !== Object.keys(newSubjects).filter(k => newSubjects[k]).sort().join('-');
}