import { objectsToHash, AppType, graphqlClient, getStatePacket } from "./rootReducer";

const LOAD_SUBJECTS = "root.LOAD_SUBJECTS";
const LOAD_SUBJECTS_RESULTS = "root.LOAD_SUBJECTS_RESULTS";
const LOAD_COLORS = "root.LOAD_COLORS_SUBJECTS";
const SAVE_SUBJECT_RESULTS = "root.SAVE_SUBJECT_RESULTS";
const SUBJECT_DELETED = "root.SUBJECT_DELETED";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import { useContext, useMemo } from "react";
import { SubjectsContext } from "./renderUI";

export type SubjectType = {
  _id: string;
  name: string;
  path: string;
};

const initialState = {
  subjectHash: {} as { [s: string]: SubjectType },
  subjectsLoaded: false,
  subjectsInitialQueryFired: false
};

export type SubjectState = typeof initialState;

function subjectsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUBJECTS:
      return { ...state, subjectsInitialQueryFired: true };
    case LOAD_SUBJECTS_RESULTS:
      return { ...state, subjectHash: objectsToHash(action.subjects), subjectsLoaded: true };
    case SAVE_SUBJECT_RESULTS:
      return { ...state, subjectHash: { ...state.subjectHash, ...objectsToHash(action.affectedSubjects) } };
    case SUBJECT_DELETED:
      let subjectHash = { ...state.subjectHash };
      action.subjectsDeleted.forEach(_id => delete subjectHash[_id]);
      return { ...state, subjectHash };
  }

  return state;
}

const loadSubjects = (app: AppType) => dispatch => {
  let publicUserId = app.publicUserId;
  dispatch({ type: LOAD_SUBJECTS });

  Promise.resolve(graphqlClient.runQuery(AllSubjectsQuery, { publicUserId, cache: 5 })).then(({ data }) => {
    dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: data.allSubjects.Subjects });
  });
};

export function useSubjectsState(): [SubjectState, any, any] {
  let actions = { loadSubjects, createOrUpdateSubject, deleteSubject };
  return getStatePacket<SubjectState>(subjectsReducer, initialState, actions);
}

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const useStackedSubjects = () => {
  const [{ subjectHash }] = useContext(SubjectsContext);

  return useMemo(() => {
    const mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash);
    const subjectsUnwound = unwindSubjects(mainSubjectsCollection);
    return {
      subjects: mainSubjectsCollection,
      allSubjectsSorted: allSubjectsSorted(subjectHash),
      subjectsUnwound: subjectsUnwound,
      subjectHash
    };
  }, [subjectHash]);
};

export const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
  name1 = name1 || "";
  name2 = name2 || "";

  let name1After = name1.toLowerCase() > name2.toLowerCase(),
    bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
};

const stackAndGetTopLevelSubjects = (subjectsHash): SubjectType[] => {
  let subjects = Object.keys(subjectsHash).map(_id => ({ ...subjectsHash[_id] }));
  subjects.sort(subjectSortCompare).forEach(s => {
    s.children = [];
    s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
    s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
  });
  return subjects.filter(s => s.path == null);
};

export const unwindSubjects = (subjects): SubjectType[] => {
  let result = [];
  subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
  return result;
};

export const filterSubjects = (subjects, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return subjects.filter(s => search(s.name));
};

export const getEligibleParents = (subjectHash, _id) => {
  let eligibleParents = null;
  if (!_id && _id != null) {
    eligibleParents = flattenSubjects(subjectHash);
  } else if (_id) {
    eligibleParents = flattenSubjects(subjectHash).filter(s => s._id !== _id && !new RegExp(`,${_id},`).test(s.path));
  }
  if (eligibleParents) {
    eligibleParents.sort(subjectSortCompare);
  }

  return eligibleParents;
};

export const flattenSubjects = subjects => Object.keys(subjects).map(k => subjects[k]);

export const createOrUpdateSubject = subject => dispatch => {
  let { _id, name, parentId, backgroundColor, textColor } = subject;
  let request = { _id: _id || null, name, parentId, backgroundColor, textColor };

  graphqlClient.runMutation(UpdateSubjectMutation, { ...request }).then(resp => {
    let affectedSubjects = resp.updateSubject;
    dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects });
  });
};

export const deleteSubject = _id => dispatch => {
  return graphqlClient.runMutation(DeleteSubjectMutation, { _id }).then(resp => {
    dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.deleteSubject, _id });
    return { subjectsDeleted: resp.deleteSubject };
  });
};

export const computeSubjectParentId = path => {
  if (path) {
    let pathParts = path.split(",");
    return pathParts[pathParts.length - 2];
  } else {
    return "";
  }
};

export const useLevelSubjectsSortedSelector = () => {
  const [{ subjectHash }] = useContext(SubjectsContext);

  return useMemo(
    () =>
      Object.keys(subjectHash)
        .map(_id => subjectHash[_id])
        .filter(s => !s.path)
        .sort(subjectSortCompare),
    [subjectHash]
  );
};

export const getChildSubjectsSorted = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},$`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(sc => regex.test(sc.path))
    .sort(subjectSortCompare);
};

export const useChildMapSelector = () => {
  const [{ subjectHash }] = useContext(SubjectsContext);

  return useMemo(
    () =>
      Object.keys(subjectHash)
        .map(_id => ({ _id, children: getChildSubjectsSorted(_id, subjectHash) }))
        .reduce((hash, o) => ((hash[o._id] = o.children), hash), {}),
    [subjectHash]
  );
};

export const getAllDescendantsOfSubject = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(s => regex.test(s.path));
};
