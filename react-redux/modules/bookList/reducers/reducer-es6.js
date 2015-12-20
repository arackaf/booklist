const { LOAD_BOOKS, LOAD_BOOKS_RESULTS, EDIT_SUBJECTS_FOR, MODIFY_SUBJECTS, MODIFY_SUBJECTS_RESULTS, LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS,
        TOGGLE_SELECT_BOOK, SELECT_ALL_BOOKS, DE_SELECT_ALL_BOOKS,
        EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS
    } = require('../actions/actionNames');

const initialState = () => ({
    bookList: [],
    subjects: []
});

var i = 0;

function reducer(state = initialState(), action = {}){
    switch(action.type){
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true });
        case LOAD_BOOKS_RESULTS:
            setBookResultsSubjects(action.bookList, state.subjects);
            return Object.assign({}, state, { loading: false, bookList: true || i++ % 2 == 0 ? action.bookList : [] });
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjects: stackAndGetTopLevelSubjects(action.subjects) });
        case TOGGLE_SELECT_BOOK:
            var newBookList = state.bookList.map(b => Object.assign({}, b, { selected: b._id == action._id ? !b.selected : b.selected }));
            return Object.assign({}, state, { bookList: newBookList, selectedCount: newBookList.filter(b => b.selected).length });
        case SELECT_ALL_BOOKS:
            var newBookList = state.bookList.map(b => Object.assign({}, b, { selected: true }));
            return Object.assign({}, state, { bookList: newBookList, selectedCount: newBookList.length });
        case DE_SELECT_ALL_BOOKS:
            var newBookList = state.bookList.map(b => Object.assign({}, b, { selected: false }));
            return Object.assign({}, state, { bookList: newBookList, selectedCount: 0 });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsModal: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsModal: Object.assign({}, state.editSubjectsModal, { newSubjectName: action.value }) });
        case SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsModal: Object.assign({}, state.editSubjectsModal, { newSubjectParent: action.value }) });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsModal: null });
        case EDIT_SUBJECT:
            var editingSubject = Object.assign({}, [...flattenedSubjects(state.subjects)].find(s => s._id == action._id)),
                newSubjectParent;

            var eligibleParents = [...flattenedSubjects(state.subjects)]
                .filter(s => s._id !== action._id && (!new RegExp(`,${action._id},`).test(s.path)))
                .map(o => Object.assign({}, o));

            if (editingSubject.path == null){
                newSubjectParent = null;
            } else {
                let hierarchy = editingSubject.path.split(',');
                newSubjectParent = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsModal: Object.assign({}, state.editSubjectsModal, { newSubjectName: editingSubject.name, newSubjectParent, editingSubject, eligibleParents }) });
        case UPDATE_SUBJECT_RESULTS:
            if ((action.existingParent || null) == (action.newParent || null)) {
                //parent's the same - update name and we're done
                let existingSubjects = [...flattenedSubjects(state.subjects)],
                    tweakedSubjects = existingSubjects.map(s => s._id == action._id ? Object.assign({}, s, { name: action.newName }) : s);

                return Object.assign({}, state, { editSubjectsModal: Object.assign({}, state.editSubjectsModal, { editingSubject: null }), subjects: stackAndGetTopLevelSubjects(tweakedSubjects) });
            } else {
                //not the most efficient code ... flatten all subjects, rip out those that were affected, re-stack
                let existingSubjects = [...flattenedSubjects(state.subjects)],
                    affectedIds = action.affectedSubjects.map(s => '' + s._id),
                    tweakedSubjects = existingSubjects.map(s => Object.assign({}, s)).filter(s => affectedIds.indexOf('' + s._id) == -1);

                return Object.assign({}, state, { editSubjectsModal: Object.assign({}, state.editSubjectsModal, { editingSubject: null }), subjects: stackAndGetTopLevelSubjects(tweakedSubjects.concat(action.affectedSubjects)) });
            }
    }

    return state;
}

function *flattenedSubjects(subjects){
    for (let subject of subjects){
        yield subject;
        if (subject.children.length) {
            yield* flattenedSubjects(subject.children);
        }
    }
}

function stackAndGetTopLevelSubjects(subjects){
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return stackSubjects(subjects).filter(s => s.path == null);
}

function stackSubjects(subjects){
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
    });
    return subjects;
}

function setBookResultsSubjects(books, subjects){
    let subjectLookup = { };
    subjects.forEach(s => subjectLookup[s._id] = s.name);

    books.forEach(b => b.subjects = b.subjects.map(s => ({ _id: s, name: subjectLookup[s] || '<subject not found>' })));
}

module.exports = reducer;