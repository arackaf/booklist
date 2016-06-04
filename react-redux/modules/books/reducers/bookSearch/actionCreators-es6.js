import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE, SET_SORT_DIRECTION } from './actionNames';

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
            'searchChildSubjects', state.searchChildSubjects && filterSubjectsVal ? 'true' : null
        );
        dispatch(endFilterChanging());
    }
}

export function setSortOrder(sort, direction){
    return { type: SET_SORT_DIRECTION, sort, direction };
}