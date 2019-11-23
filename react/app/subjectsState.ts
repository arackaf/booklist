import { graphqlClient } from "util/graphql";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import { useContext, useMemo } from "react";
import { AppContext } from "./renderUI";
import { useQuery, buildQuery, useMutation, buildMutation } from "micro-graphql-react";
import { syncUpdates, syncDeletes } from "../util/graphqlHelpers";
import { QueryOf, Queries, MutationOf, Mutations } from "graphql-typings";

const objectsToHash = objs => objs.reduce((hash, o) => ((hash[o._id] = o), hash), {});

export type SubjectType = {
  _id: string;
  name: string;
  path: string;
};

export interface SubjectState {
  subjectHash: { [s: string]: SubjectType };
  subjectsLoaded: boolean;
}

graphqlClient.subscribeMutation([
  { when: /updateSubject/, run: (op, res) => syncUpdates(AllSubjectsQuery, res.updateSubject, "allSubjects", "Subjects") },
  { when: /deleteSubject/, run: (op, res) => syncDeletes(AllSubjectsQuery, res.deleteSubject, "allSubjects", "Subjects") }
]);

export function useSubjectsState() {
  let [app] = useContext(AppContext);
  let { userId, publicUserId } = app;
  let { loaded, data } = useQuery<QueryOf<Queries["allSubjects"]>>(
    buildQuery(
      AllSubjectsQuery,
      { publicUserId, userId },
      { active: !!userId || !!publicUserId, onMutation: { when: /(update|delete)Subject/, run: ({ refresh }) => refresh() } }
    )
  );
  const subjects = data ? data.allSubjects.Subjects : null;
  const subjectHash = useMemo(() => (subjects ? objectsToHash(subjects) : {}), [subjects]);

  return { subjectsLoaded: loaded, subjectHash };
}

export function useSubjectMutations() {
  let { runMutation: updateSubject } = useMutation<MutationOf<Mutations["updateSubject"]>>(buildMutation(UpdateSubjectMutation));
  let { runMutation: deleteSubject } = useMutation<MutationOf<Mutations["deleteSubject"]>>(buildMutation(DeleteSubjectMutation));

  return { updateSubject, deleteSubject };
}

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const useStackedSubjects = () => {
  const { subjectHash } = useSubjectsState();

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

export const computeSubjectParentId = path => {
  if (path) {
    let pathParts = path.split(",");
    return pathParts[pathParts.length - 2];
  } else {
    return "";
  }
};

export const useLevelSubjectsSortedSelector = () => {
  const { subjectHash } = useSubjectsState();

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
  const { subjectHash } = useSubjectsState();

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
