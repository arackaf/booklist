const { TOGGLE_FILTER_SUBJECT } = require('../actions/actionNames');

const initialState = () => ({
    searchText: '',
    subjects: {}
});

function filtersReducer(state = initialState(), action = {}){
    switch(action.type){
        case TOGGLE_FILTER_SUBJECT:
            let newSubjects = Object.assign({}, state.subjects);
            if (newSubjects[action._id]) delete newSubjects[action._id];
            else newSubjects[action._id] = true;

            return Object.assign({}, state, { subjects: newSubjects });
    }
    return state;
}

module.exports = filtersReducer;