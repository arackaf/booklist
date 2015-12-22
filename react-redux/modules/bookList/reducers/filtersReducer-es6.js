const { TOGGLE_FILTER_SUBJECT, OPEN_SUBJECTS_FILTER_MODAL, CLOSE_SUBJECTS_FILTER_MODAL, TOGGLE_FILTERED_SUBJECT } = require('../actions/actionNames');
const Immutable = require('/node_modules/immutable/dist/immutable');

const initialState = () => ({
    searchText: '',
    subjects: Immutable.Set(),
    subjectsFilterModal: null
});

function filtersReducer(state = initialState(), action = {}){
    switch(action.type){
        case TOGGLE_FILTER_SUBJECT:
            let newSubjects = Object.assign({}, state.subjects);
            if (newSubjects[action._id]) delete newSubjects[action._id];
            else newSubjects[action._id] = true;

            return Object.assign({}, state, { subjects: newSubjects });
        case OPEN_SUBJECTS_FILTER_MODAL:
            return Object.assign({}, state, { subjectsFilterModal: { subjects: Immutable.Set(state.subjects) } });
        case TOGGLE_FILTERED_SUBJECT:
            let newFilterSubjects = state.subjectsFilterModal.subjects;
            newFilterSubjects = newFilterSubjects.has(action._id) ? newFilterSubjects.delete(action._id) : newFilterSubjects.add(action._id);
            return Object.assign({}, state, { subjectsFilterModal: Object.assign({}, state.subjectsFilterModal, { subjects: newFilterSubjects }) });
        case CLOSE_SUBJECTS_FILTER_MODAL:
            return Object.assign({}, state, { subjectsFilterModal: null });
    }
    return state;
}

module.exports = filtersReducer;