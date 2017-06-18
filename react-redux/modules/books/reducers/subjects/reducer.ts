import {BooksModuleType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, tagsType} from 'modules/books/reducers/reducer';
import { createSelector } from 'reselect';

import {
    UPDATE_SUBJECT,
} from './actionNames';
import {appType, subjectType} from 'applicationRoot/rootReducer';

import {stackAndGetTopLevelSubjects, subjectSortCompare, getEligibleParents, unwindSubjects} from 'applicationRoot/rootReducer';

export type stackedSubjectsType = {
    subjects: subjectType[];
    allSubjectsSorted: subjectType[];
    subjectsUnwound: subjectType[];

}
export const selectStackedSubjects = createSelector<BooksModuleType, stackedSubjectsType, any>(
    state => state.app.subjectHash,
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

export type entireSubjectsStateType = stackedSubjectsType & {
    colors: any[];
}
export const selectEntireSubjectsState = createSelector<BooksModuleType, entireSubjectsStateType, appType, stackedSubjectsType>(
    state => state.app,
    selectStackedSubjects,

    (app, stackedSubjects) => {
        return {
            colors: app.colors,
            ...stackedSubjects
        };
    }
)

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