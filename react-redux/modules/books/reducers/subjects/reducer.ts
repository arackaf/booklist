import { BooksModuleType } from "modules/books/reducers/reducer";
import { createSelector } from "reselect";

import { SubjectType } from "applicationRoot/rootReducer";

import { stackAndGetTopLevelSubjects, subjectSortCompare, unwindSubjects } from "applicationRoot/rootReducer";

export const selectStackedSubjects = createSelector(
  (state: BooksModuleType) => state.app.subjectHash,
  subjectHash => {
    let mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash),
      subjectsUnwound = unwindSubjects(mainSubjectsCollection);
    return {
      subjects: mainSubjectsCollection,
      allSubjectsSorted: allSubjectsSorted(subjectHash),
      subjectsUnwound: subjectsUnwound,
      subjectHash
    };
  }
);

export const selectEntireSubjectsState = createSelector(state => state.app, selectStackedSubjects, (app, stackedSubjects) => {
  return {
    colors: app.colors,
    ...stackedSubjects
  };
});

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const filterSubjects = (subjects, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return subjects.filter(s => search(s.name));
};
