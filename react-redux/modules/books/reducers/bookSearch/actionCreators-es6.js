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
            filterSubjectsVal = Object.keys(state.pending.subjects).filter(k => state.pending.subjects[k]).join('-'),
            pending = state.pending;

        globalHashManager.setValues(
            'search', pending.search,
            'filterSubjects', filterSubjectsVal,
            'searchChildSubjects', pending.searchChildSubjects && filterSubjectsVal ? 'true' : null,
            'author', pending.author,
            'publisher', pending.publisher,
            'pagesOperator', pending.pages != '' ? pending.pagesOperator : null,
            'pages', pending.pages
        );
        dispatch(endFilterChanging());
    }
}

export function setSortOrder(sort, direction){
    return function(dispatch, getState){
        globalHashManager.setValues(
            'sort', sort,
            'sortDirection', direction == 1 ? 'asc' : 'desc'
        );
    };
}

export function syncFiltersToHash(initial){
    return function(dispatch, getState){
        let state = getState().books.bookSearch;

        let subjects = {},
            selectedSubjectsHashString = globalHashManager.getCurrentHashValueOf('filterSubjects');
        if (selectedSubjectsHashString){
            selectedSubjectsHashString.split('-').forEach(_id => subjects[_id] = true);
        }

        let searchChildSubjects = globalHashManager.getCurrentHashValueOf('searchChildSubjects') ? true : null,
            packet = { searchChildSubjects, subjects };

        ['search', 'author', 'publisher', 'pages', 'pagesOperator', 'sort'].forEach(prop => packet[prop] = globalHashManager.getCurrentHashValueOf(prop) || '');
        packet.sortDirection = globalHashManager.getCurrentHashValueOf('sortDirection') == 'asc' ? 1 : -1;
        let newIsDirty = isDirty(state, packet);

        if (initial || newIsDirty) {
            dispatch(setFilters(packet));

            dispatch(loadBooks());
        }
    };
}

export function setFilters(packet){
    return { type: SET_FILTERS, packet }
}

function isDirty(oldState, newState){
    if (subjectsDifferent(oldState.subjects, newState.subjects)) return true;
    if (oldState.pagesOperator != newState.pagesOperator){
        if (newState.pages !== '') return true;
    }
    return !!['search', 'author', 'publisher', 'pages'].filter(prop => oldState[prop] != newState[prop]).length;
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

export const setPendingSearch = createPendingActionCreator('search');
export const setPendingSubjects = createPendingActionCreator('subjects');
export const setPendingSearchChildSubjects = createPendingActionCreator('searchChildSubjects', evt => evt.target.checked);
export const setPendingAuthor = createPendingActionCreator('author');
export const setPendingPublisher = createPendingActionCreator('publisher');
export const setPendingPages = createPendingActionCreator('pages');
export const setPendingPagesOperator = createPendingActionCreator('pagesOperator');