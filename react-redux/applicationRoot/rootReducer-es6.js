import {createSelector} from 'reselect';

import {
    SET_DESKTOP,
    SET_MOBILE,
    REQUEST_DESKTOP,
    REQUEST_MOBILE,
    LOAD_SUBJECTS,
    LOAD_SUBJECTS_RESULTS,
    LOAD_COLORS
} from './rootReducerActionNames';

const initialState = {
    publicUserId: '',
    publicName: '',
    publicBooksHeader: '',
    isPublic: false,
    isDesktop: false,
    showingDesktop: false,
    isMobile: false,
    showingMobile: false,
    subjectHash: {},
    colors: [],
    subjectsLoaded: false,
    subjectsInitialQueryFired: false
};

const subjectsToHash = subjects => subjects.reduce((hash, s) => (hash[s._id] = s, hash), {});

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'SET_PUBLIC_INFO':
            return { ...state, isPublic: true, publicName: action.name, publicBooksHeader: action.booksHeader, publicUserId: action._id };
        case 'RESET_PUBLIC_INFO':
            return { ...state, isPublic: false, publicName: '', publicBooksHeader: '', publicUserId: '' };
        case SET_DESKTOP:
            return { ...state, isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false };
        case SET_MOBILE:
            return { ...state, isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true };
        case REQUEST_DESKTOP:
            return { ...state, showingDesktop: true, showingMobile: false };
        case REQUEST_MOBILE:
            return { ...state, showingDesktop: false, showingMobile: true };
        case LOAD_SUBJECTS:
            return Object.assign({}, state, { subjectsInitialQueryFired: true });
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { subjectHash: subjectsToHash(action.subjects), subjectsLoaded: true });
        case LOAD_COLORS:
            return Object.assign({}, state, { colors: action.colors });
    }

    return state;
}

export const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
        bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : (name1After ? 1 : -1);
};

export const stackAndGetTopLevelSubjects = subjectsHash => {
    let subjects = Object.keys(subjectsHash).map(_id => ({...subjectsHash[_id]}));
    subjects.sort(subjectSortCompare).forEach(s => {
        s.children = [];
        s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
        s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
    });
    return subjects.filter(s => s.path == null);
}

export const subjectsSelector = createSelector([subjectHash => subjectHash], subjectHash => ({
    subjects: stackAndGetTopLevelSubjects(subjectHash)
}));