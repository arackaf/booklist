const { LOAD_BOOKS, LOAD_BOOKS_RESULTS, EDIT_SUBJECTS_FOR, MODIFY_SUBJECTS, MODIFY_SUBJECTS_RESULTS } = require('../actions/actionNames');

const initialState = () => ({
    bookList: []
});

var i = 0;

function reducer(state = initialState(), action = {}){
    switch(action.type){
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true, editSubjectsAtIndex: -5 });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { loading: false, bookList: i++ % 2 == 0 ? action.bookList : [] });
        case EDIT_SUBJECTS_FOR:
            return Object.assign({}, state, { editSubjectsAtIndex: action.index });
        case MODIFY_SUBJECTS:
            return Object.assign({}, state);
        case MODIFY_SUBJECTS_RESULTS:
            let list = state.bookList.concat();
            list[state.editSubjectsAtIndex] = Object.assign({}, list[state.editSubjectsAtIndex]);
            list[state.editSubjectsAtIndex].subjects.push(action.subject);

            return Object.assign({}, state, { bookList: list });
    }

    return state;
}

module.exports = reducer;