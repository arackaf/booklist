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