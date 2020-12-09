import { get, derived } from "svelte/store";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";

import { appState } from "./appState";
import { query } from "micro-graphql-svelte";
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
  onDelete: resp => standardDelete("Subject", AllSubjectsQuery, resp.deleteSubject),
});

let { publicUserId } = get(appState);
let { queryState } = query<QueryOf<Queries["allSubjects"]>>(AllSubjectsQuery, { initialSearch: { publicUserId } });

export const subjectsState = derived(queryState, ({ loaded, data }) => {
  const subjects = data ? data.allSubjects.Subjects : null;
  const subjectHash = subjects ? objectsToHash(subjects) : {};

  return { subjectsLoaded: loaded, subjectHash };
});
