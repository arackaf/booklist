import { SET_FILTERS } from './actionNames';

export function setFilters(text, subjects, searchChildSubjects){
    return { type: SET_FILTERS, text, subjects, searchChildSubjects }
}