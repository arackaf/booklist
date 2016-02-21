import { SET_FILTERED_SUBJECTS, SET_TEXT_SEARCH } from './actionNames';

export function setFilteredSubjects(subjects, searchChildSubjects){
    return { type: SET_FILTERED_SUBJECTS, subjects, searchChildSubjects }
}

export function setSearchFilterText(value){
    return { type: SET_TEXT_SEARCH, value }
}