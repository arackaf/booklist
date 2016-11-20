import {
    LOAD_SUBJECTS, LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, NEW_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_VALUE,
    STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS, LOAD_COLORS, CANCEL_SUBJECT_EDIT,
    BEGIN_SUBJECT_DELETE, CANCEL_SUBJECT_DELETE, SUBJECT_DELETING, SUBJECT_DELETED, SET_SUBJECT_SEARCH_VALUE
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