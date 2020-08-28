import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import { useContext, useMemo } from "react";
import { AppContext } from "../renderUI";
import { useSuspenseQuery, useMutation } from "micro-graphql-react";
import { standardDelete } from "../../util/graphqlCacheHelpers";
import { QueryOf, Queries, MutationOf, Mutations } from "graphql-typings";
import { graphqlSyncAndRefresh } from "util/graphqlHelpers";

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

graphqlSyncAndRefresh("Subject", AllSubjectsQuery, {
  onDelete: resp => standardDelete("Subject", AllSubjectsQuery, resp.deleteSubject)
});

export function useSubjectsState() {
  let [app] = useContext(AppContext);
  let { userId, publicUserId } = app;
  let { loaded, data } = useSuspenseQuery<QueryOf<Queries["allSubjects"]>>(
    AllSubjectsQuery,
    { publicUserId },
    { active: !!userId || !!publicUserId }
  );
  const subjects = data ? data.allSubjects.Subjects : null;
  const subjectHash = useMemo(() => (subjects ? objectsToHash(subjects) : {}), [subjects]);

  return { subjectsLoaded: loaded, subjectHash };
}

export function useSubjectMutations() {
  let { runMutation: updateSubject } = useMutation<MutationOf<Mutations["updateSubject"]>>(UpdateSubjectMutation);
  let { runMutation: deleteSubject } = useMutation<MutationOf<Mutations["deleteSubject"]>>(DeleteSubjectMutation);

  return { updateSubject, deleteSubject };
}

export const useAllSubjects = () => {
  const { subjectHash, subjectsLoaded } = useSubjectsState();
  return useMemo(() => (subjectsLoaded ? allSubjectsSorted(subjectHash) : []), [subjectHash, subjectsLoaded]);
};

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const useStackedSubjects = () => {
  const { subjectHash, subjectsLoaded } = useSubjectsState();

  return useMemo(() => {
    const mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash);
    const subjectsUnwound = unwindSubjects(mainSubjectsCollection);
    return {
      subjects: mainSubjectsCollection,
      allSubjectsSorted: allSubjectsSorted(subjectHash),
      subjectsUnwound: subjectsUnwound,
      subjectHash,
      subjectsLoaded
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
  let searchFn;
  let lookupMap = subjects.reduce((map, s) => ((map[s._id] = s), map), {});
  if (!search) {
    searchFn = () => true;
  } else {
    let regex = new RegExp(search, "i");
    searchFn = txt => regex.test(txt);
  }
  return subjects.reduce((result, s) => {
    if (searchFn(s.name)) {
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
        if (!searchFn(parent.name)) {
          ancestorsInactive++;
        }
        entry.prepend.unshift(parent);
        currentSubject = parent;
      }

      if (!ancestorsInactive){
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

export const useRootSubjects = () => {
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
