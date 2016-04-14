import { LOAD_BOOKS } from '../actions/actionNames';
import { SET_FILTERS } from '../actions/bookSearch/actionNames';

const initialState = {
    searchText: '',
    subjects: {},
    searchChildSubjects: false,
    isDirty: false
};

function bookSearchReducer(state = initialState, action){
    switch(action.type){
        case SET_FILTERS:
            let newIsDirty =
                state.searchText != action.text ||
                subjectsDifferent(state.subjects, action.subjects) ||
                state.searchChildSubjects != action.searchChildSubjects;

            return Object.assign({},
                state,
                {
                    searchText: action.text,
                    subjects: { ...action.subjects },
                    searchChildSubjects: action.searchChildSubjects,
                    isDirty: newIsDirty
                }
            );
        case LOAD_BOOKS:
            return Object.assign({}, state, { isDirty: false });
    }
    return state;
}

function subjectsDifferent(oldSubjects, newSubjects){
    return Object.keys(oldSubjects).filter(k => oldSubjects[k]).sort().join('-') !== Object.keys(newSubjects).filter(k => newSubjects[k]).sort().join('-');
}

function projectselectedSubjects(selectedSubjectsIds, subjects){
    //last filter since subjects might not be loaded yet
    return Object.keys(selectedSubjectsIds).filter(k => selectedSubjectsIds[k]).map(_id => subjects[_id]).filter(s => s);
}

const bookSearchSelector = state => Object.assign({}, state.bookSearch, { selectedSubjects: projectselectedSubjects(state.bookSearch.subjects, state.subjects.subjectHash) });

module.exports = { bookSearchReducer, bookSearchSelector };