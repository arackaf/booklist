import { get, derived, Readable } from "svelte/store";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";

import { appState } from "./appState";
import { query, mutation } from "micro-graphql-svelte";
import { standardDelete } from "../../util/graphqlCacheHelpers";
import { QueryOf, Queries, MutationOf, Mutations } from "graphql-typings";
import { graphqlSyncAndRefresh } from "util/graphqlHelpers";

const objectsToHash = objs => objs.reduce((hash, o) => ((hash[o._id] = o), hash), {});

export interface SubjectType {
  _id: string;
  name: string;
  path: string;
};

export interface FullSubject extends SubjectType {
  children: [SubjectType];
}

export interface SubjectState {
  subjectHash: { [s: string]: SubjectType };
  subjectsLoaded: boolean;
}

graphqlSyncAndRefresh("Subject", AllSubjectsQuery, {
  onDelete: resp => standardDelete("Subject", AllSubjectsQuery, resp.deleteSubject),
});

let { publicUserId } = get(appState);
let { queryState } = query<QueryOf<Queries["allSubjects"]>>(AllSubjectsQuery, { initialSearch: { publicUserId } });

export const subjectsState = derived(queryState, ({ loaded, data }) => {
  const subjects = data ? data.allSubjects.Subjects : null;
  const subjectHash: { [k: string]: SubjectType } = subjects ? objectsToHash(subjects) : {};

  return { subjectsLoaded: loaded, subjectHash };
});

const { mutationState: updateMutationState } = mutation<MutationOf<Mutations["updateSubject"]>>(UpdateSubjectMutation);
export const updateSubject = get(updateMutationState).runMutation;

const { mutationState: deleteMutationState } = mutation<MutationOf<Mutations["deleteSubject"]>>(DeleteSubjectMutation);
export const deleteSubject = get(deleteMutationState).runMutation;

export const allSubjects = derived(subjectsState, $state => ($state.subjectsLoaded ? allSubjectsSorted($state.subjectHash) : []));

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const stackedSubjects = derived(subjectsState, ({ subjectHash, subjectsLoaded }) => {
  const mainSubjectsCollection: FullSubject[] = stackAndGetTopLevelSubjects(subjectHash);
  const subjectsUnwound = unwindSubjects(mainSubjectsCollection);

  return {
    subjects: mainSubjectsCollection,
    allSubjectsSorted: allSubjectsSorted(subjectHash),
    subjectsUnwound,
    subjectHash,
    subjectsLoaded,
  };
});

export const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
  name1 = name1 || "";
  name2 = name2 || "";

  let name1After = name1.toLowerCase() > name2.toLowerCase(),
    bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
};

const stackAndGetTopLevelSubjects = (subjectsHash): FullSubject[] => {
  let subjects = Object.keys(subjectsHash).map(_id => ({ ...subjectsHash[_id] }));
  subjects.sort(subjectSortCompare).forEach(s => {
    s.children = [];
    s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
    s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
  });
  return subjects.filter(s => s.path == null);
};

export const unwindSubjects = (subjects): FullSubject[] => {
  let result = [];
  subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
  return result;
};

export const filterSubjects = (subjects, search, lookupMap = {}, alreadySelected = {}) => {
  let searchFn;
  if (!search) {
    searchFn = s => !alreadySelected[s._id];
  } else {
    let regex = new RegExp(search, "i");
    searchFn = s => regex.test(s.name) && !alreadySelected[s._id];
  }
  return subjects.reduce((result, s) => {
    if (searchFn(s)) {
      const entry = { ...s, prepend: [] };

      let currentSubject = s;
      let parentId;
      let ancestorsInactive = 0;
      while ((parentId = computeSubjectParentId(currentSubject.path))) {
        if (!parentId) {
          break;
        }
        let parent = lookupMap[parentId];
        if (!parent) {
          break;
        }

        if (alreadySelected[parent._id] || !searchFn(parent)) {
          ancestorsInactive++;
        }

        entry.prepend.unshift(parent);
        currentSubject = parent;
      }

      if (!ancestorsInactive) {
        entry.prepend = [];
      }

      result.push(entry);
    }
    return result;
  }, []);
};

export const getEligibleParents = (subjectHash, _id) => {
  let eligibleParents = _id
    ? flattenSubjects(subjectHash).filter(s => s._id !== _id && !new RegExp(`,${_id},`).test(s.path))
    : flattenSubjects(subjectHash);

  return eligibleParents.sort(subjectSortCompare);
};

export const flattenSubjects = subjects => Object.keys(subjects).map(k => subjects[k]);

export const computeSubjectParentId = path => {
  if (path) {
    let pathParts = path.split(",");
    return pathParts[pathParts.length - 2];
  } else {
    return "";
  }
};

export const rootSubjects = derived(subjectsState, ({ subjectHash }) =>
  Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(s => !s.path)
    .sort(subjectSortCompare) as SubjectType[]
);

export const getChildSubjectsSorted = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},$`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(sc => regex.test(sc.path))
    .sort(subjectSortCompare);
};

export const childMapSelector = derived(subjectsState, ({ subjectHash }) => {
  Object.keys(subjectHash)
    .map(_id => ({ _id, children: getChildSubjectsSorted(_id, subjectHash) }))
    .reduce((hash, o) => ((hash[o._id] = o.children), hash), {});
});

export const getAllDescendantsOfSubject = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(s => regex.test(s.path));
};
