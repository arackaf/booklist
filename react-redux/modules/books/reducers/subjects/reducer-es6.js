import {
    EDIT_SUBJECT,
    NEW_SUBJECT,
    EDIT_SUBJECTS,
    SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS,
    UPDATE_SUBJECT,
    UPDATE_SUBJECT_RESULTS,
    CANCEL_SUBJECT_EDIT,
    BEGIN_SUBJECT_DELETE,
    CANCEL_SUBJECT_DELETE,
    SUBJECT_DELETING,
    SUBJECT_DELETED,
    SET_SUBJECT_SEARCH_VALUE
} from './actionNames';

import { createSelector } from 'reselect';

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

const emptySubject = { _id: '', name: '', path: null, backgroundColor: '', textColor: '' };
const newSubjectEditing = { subjectSearch: '', deletingSubjectId: null };
const doneEditingSubject = { saving: false, editingSubjectId: null, editingSubject: null };
const getEditingSubject = (hash, _id) => {
    let subject = hash[_id];
    let parentId = '';
    if (subject.path){
        let hierarchy = subject.path.split(',');
        parentId = hierarchy[hierarchy.length - 2];
    }

    return { ...subject, parentId };
}

export function subjectsReducer(state = initialSubjectsState, action){
    switch(action.type){
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editModalOpen: true });
        case SET_SUBJECT_SEARCH_VALUE:
            return Object.assign({}, state, { subjectSearch: action.value });
        case NEW_SUBJECT:
            return Object.assign({}, state, { ...newSubjectEditing, editingSubjectId: '', editingSubject: { ...emptySubject } });
        case EDIT_SUBJECT:
            return Object.assign({}, state, { ...newSubjectEditing, editingSubjectId: action._id, editingSubject: getEditingSubject(state.subjectHash, action._id) });
        case SET_NEW_SUBJECT_VALUE:
            return Object.assign({}, state, { editingSubject: { ...state.editingSubject, [action.field]: action.value } });
        case UPDATE_SUBJECT:
            return Object.assign({}, state, { saving: true })
        case UPDATE_SUBJECT_RESULTS:
            return Object.assign({}, state, { ...doneEditingSubject, subjectHash: { ...state.subjectHash, ...subjectsToHash(action.affectedSubjects) } });
        case BEGIN_SUBJECT_DELETE:
            return Object.assign({}, state, { deletingSubjectId: action._id });
        case CANCEL_SUBJECT_DELETE:
            return Object.assign({}, state, { deletingSubjectId: null });
        case SUBJECT_DELETING:
            return Object.assign({}, state, { deleting: true });
        case SUBJECT_DELETED:
            let subjectHash = { ...state.subjectHash };
            action.subjectsDeleted.forEach(_id => delete subjectHash[_id]);
            let newState = Object.assign({}, state, { deleting: false, deletingSubjectId: null, subjectHash });
            if (newState.editingSubjectId && !newState.subjectHash[newState.editingSubjectId]){
                newState.editingSubjectId = newState.editingSubject = null;
            }
            return newState;
        case CANCEL_SUBJECT_EDIT:
            return Object.assign({}, state, { ...doneEditingSubject });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editModalOpen: false });
    }
    return state;
}

const flattenedSubjects = subjects => Object.keys(subjects).map(k => subjects[k]);

const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
        bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : (name1After ? 1 : -1);
};

const unwindSubjects = subjects => {
    let result = [];
    subjects.concat().sort(subjectSortCompare).forEach(s => {
        result.push(s);
        result.push(...unwindSubjects(s.children));
    });
    return result;
};

const stackedSubjectsSelector = createSelector([state => state.subjectHash],
    subjectHash => {
        let mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash),
            subjectsUnwound = unwindSubjects(mainSubjectsCollection);

        return {
            subjects: mainSubjectsCollection,
            allSubjectsSorted: allSubjectsSorted(subjectHash),
            subjectsUnwound: subjectsUnwound
        };
    }
);

const searchSubjectsSelector = createSelector([
    stackedSubjectsSelector,
    state => state.subjectSearch
],
    (stackedSubjects, subjectSearch) => {
        return { ...stackedSubjects, subjectsSearched: filterSubjects(stackedSubjects.subjectsUnwound, subjectSearch) };
    }
);

const eligibleSubjectsSelector = createSelector([
        state => state.subjectHash,
        state => state.editingSubjectId
    ],
    (subjectHash, editSubjectId) => {
        let eligibleParents = null;
        if (!editSubjectId && editSubjectId != null){
            eligibleParents = flattenedSubjects(subjectHash)
        } else if (editSubjectId) {
            eligibleParents = flattenedSubjects(subjectHash).filter(s => s._id !== editSubjectId && (!new RegExp(`,${editSubjectId},`).test(s.path)));
        }

        return { eligibleParents };
    }
);

const deletingSubjectInfoSelector = createSelector([
        state => state.subjectHash,
        state => state.deletingSubjectId
    ],
    (subjectHash, deletingSubjectId) => {
        if (!deletingSubjectId) return null;

        let childSubjectRegex = new RegExp(`.*,${deletingSubjectId},.*`),
            affectedChildren = Object.keys(subjectHash).filter(k => childSubjectRegex.test(subjectHash[k].path)).length,
            subjectName = subjectHash[deletingSubjectId].name;

        return { deleteInfo: { affectedChildren, subjectName, _id: deletingSubjectId } };
    }
);

export const subjectsSelector = ({ booksModule }) => {
    return Object.assign({},
        booksModule.subjects,
        {
            ...searchSubjectsSelector(booksModule.subjects),
            ...eligibleSubjectsSelector(booksModule.subjects),
            ...deletingSubjectInfoSelector(booksModule.subjects)
        }
    );
}

function stackAndGetTopLevelSubjects(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    subjects.forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
        s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
    });
    return subjects.filter(s => s.path == null);
}

function allSubjectsSorted(subjectsHash){
    let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
    return subjects.sort(subjectSortCompare);
}

export const filterSubjects = (subjects, search) => {
    if (!search){
        search = () => true;
    } else {
        let regex = new RegExp(search, 'i');
        search = txt => regex.test(txt);
    }
    return subjects.filter(s => search(s.name))
};