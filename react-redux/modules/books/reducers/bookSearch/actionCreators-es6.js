import { BEGIN_FILTER_CHANGE, TOGGLE_PENDING_SUBJECT, END_FILTER_CHANGE } from './actionNames';

export function beginFilterChange(){
    return { type: BEGIN_FILTER_CHANGE };
}

export function togglePendingSubject(_id){
    return { type: TOGGLE_PENDING_SUBJECT, _id };
}

export function closeSubjectsFilterModal(){
    return { type: END_FILTER_CHANGE };
}