import {
    BEGIN_FILTER_CHANGE,
    TOGGLE_PENDING_SUBJECT,
    END_FILTER_CHANGE,
    SET_SORT_DIRECTION,
    SET_FILTERS,
    SET_PENDING,
    APPLY_PENDING_SEARCH
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
            filterSubjectsVal = Object.keys(state.pending.subjects).filter(k => state.pending.subjects[k]).join('-');

        globalHashManager.setValues(
            'search', state.pending.searchText,
            'filterSubjects', filterSubjectsVal,
            'searchChildSubjects', state.pending.searchChildSubjects && filterSubjectsVal ? 'true' : null
        );
        dispatch(endFilterChanging());
    }
}

export function setSortOrder(sort, direction){
    return { type: SET_SORT_DIRECTION, sort, direction };
}

export function setFilters(searchText, subjects, searchChildSubjects){
    return { type: SET_FILTERS, searchText, subjects, searchChildSubjects }
}

export function syncFiltersToHash(){
    return function(dispatch, getState){
        let state = getState().books.bookSearch;

        let subjectsSelected = {},
            selectedSubjectsHashString = globalHashManager.getCurrentHashValueOf('filterSubjects');
        if (selectedSubjectsHashString){
            selectedSubjectsHashString.split('-').forEach(_id => subjectsSelected[_id] = true);
        }

        let hashSearch = (globalHashManager.getCurrentHashValueOf('search') || ''),
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

function subjectsDifferent(oldSubjects, newSubjects){
    return Object.keys(oldSubjects).filter(k => oldSubjects[k]).sort().join('-') !== Object.keys(newSubjects).filter(k => newSubjects[k]).sort().join('-');
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

function createPendingActionCreator(name, getEvtValue = evt => evt.target.value){
    return function (evt) {
        return function (dispatch, getState) {
            if (evt.which === 13){
                dispatch(applyFilters());
            } else {
                dispatch({type: SET_PENDING, field: name, value: getEvtValue(evt)})
            }
        };
    }
}

export const setPendingSearchText = createPendingActionCreator('searchText');
export const setPendingSubjects = createPendingActionCreator('subjects');
export const setPendingSearchChildSubjects = createPendingActionCreator('searchChildSubjects', evt => evt.target.checked);
export const setPendingAuthor = createPendingActionCreator('author');
export const setPendingPublisher = createPendingActionCreator('publisher');
export const setPendingPages = createPendingActionCreator('pages');
export const setPendingPagesOperator = createPendingActionCreator('pagesOperator');

export function pendingSearchModified(evt){
    return function(dispatch, getState) {
        if (evt.which == 13) {
            let pendingSearch = getState().books.bookSearch.pending.searchText;
            globalHashManager.setValueOf('bookSearch', pendingSearch);
        } else {
            dispatch(setPendingSearchText(evt));
        }
    };
}
