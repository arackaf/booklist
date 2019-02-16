import { objectsToHash, AppType, graphqlClient, getStatePacket } from "./rootReducer";

const LOAD_SUBJECTS = "root.LOAD_SUBJECTS";
const LOAD_SUBJECTS_RESULTS = "root.LOAD_SUBJECTS_RESULTS";
const LOAD_COLORS = "root.LOAD_COLORS_SUBJECTS";
const SAVE_SUBJECT_RESULTS = "root.SAVE_SUBJECT_RESULTS";
const SUBJECT_DELETED = "root.SUBJECT_DELETED";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";

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
  let actions = { loadSubjects };
  return getStatePacket<SubjectState>(subjectsReducer, initialState, actions);
}
