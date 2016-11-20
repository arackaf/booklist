import {createSelector} from 'reselect';
import {
    LOAD_SUBJECTS,
    LOAD_SUBJECTS_RESULTS,
    LOAD_COLORS,

    EDIT_SUBJECT,
    NEW_SUBJECT,
    EDIT_SUBJECTS,

    CANCEL_SUBJECT_EDIT,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,
    BEGIN_SUBJECT_DELETE,
    CANCEL_SUBJECT_DELETE,

    SUBJECT_DELETING,
    SUBJECT_DELETED,
} from './actionNames';

const initialSubjectsState = {
    subjectHash: {},
    editingSubjectId: null,
    deletingSubjectId: null,
    editingSubject: null,
    editModalOpen: false,
    saving: false,
    deleting: false,
    colors: [],
    loaded: false,
    subjectSearch: '',
    initialQueryFired: false
};

export function reducer(state = initialSubjectsState, action){
    switch(action.type){
        case LOAD_SUBJECTS:
            return Object.assign({}, state, { initialQueryFired: true });
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), loaded: true });
        case LOAD_COLORS:
            return Object.assign({}, state, { colors: action.colors });
    }
    return state;
}

const subjectsToHash = subjects => subjects.reduce((hash, s) => (hash[s._id] = s, hash), {});

const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
        bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : (name1After ? 1 : -1);
};

function stackAndGetTopLevelSubjects(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    subjects.sort(subjectSortCompare).forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
        s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
    });
    return subjects.filter(s => s.path == null);
}

const subjectsSelector = createSelector([state => state.subjectHash],
    subjectHash => {
        let mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash);

        return {
            subjects: mainSubjectsCollection
        };
    }
);

export const selector = createSelector([state => state.subjectsModule],
    subjects => subjectsSelector(subjects)
);