import {
  REQUEST_DESKTOP,
  REQUEST_MOBILE,
  SET_MODULE,
  SET_PUBLIC_INFO,
  LOAD_SUBJECTS,
  LOAD_SUBJECTS_RESULTS,
  LOAD_COLORS,
  SAVE_SUBJECT_RESULTS,
  SUBJECT_DELETED,
  NEW_LOGIN
} from "./rootReducerActionNames";

import { Client } from "micro-graphql-react";

import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

export const setDeviceOverride = view => {
  try {
    if (view == "mobile") {
      localStorage.removeItem("useDesktop");
    } else {
      localStorage.setItem("useDesktop", "1");
    }
  } catch (e) {}
};

export const requestDesktop = () => dispatch => {
  setDeviceOverride("desktop");
  dispatch({ type: REQUEST_DESKTOP });
};
export const requestMobile = () => dispatch => {
  setDeviceOverride("mobile");
  dispatch({ type: REQUEST_MOBILE });
};

export const newLogin = () => ({ type: NEW_LOGIN });
export const setModule = module => ({ type: SET_MODULE, module });
export const setPublicInfo = publicInfo => ({ type: SET_PUBLIC_INFO, ...publicInfo });

let subjectsLoaded = false;

export function loadSubjects() {
  return function(dispatch, getState) {
    if (subjectsLoaded || getState().app.subjectsLoaded) {
      return;
    }
    subjectsLoaded = true;
    let app: any = getState().app;
    let publicUserId = app.publicUserId;
    dispatch({ type: LOAD_SUBJECTS });

    Promise.all([
      graphqlClient.runQuery(AllSubjectsQuery, { publicUserId, cache: 5 }),
      graphqlClient.runQuery(AllLabelColorsQuery, { cache: 9 })
    ]).then(([{ data }, { data: { allLabelColors: { LabelColors: labelColors } } }]) => {
      dispatch({ type: LOAD_COLORS, colors: labelColors });
      dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: data.allSubjects.Subjects });
    });
  };
}

export const deleteSubject = _id => dispatch => {
  return graphqlClient.runMutation(DeleteSubjectMutation, { _id }).then(resp => {
    dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.deleteSubject, _id });
    return { subjectsDeleted: resp.deleteSubject };
  });
};

export const createOrUpdateSubject = subject => dispatch => {
  let { _id, name, parentId, backgroundColor, textColor } = subject;
  let request = { _id: _id || null, name, parentId, backgroundColor, textColor };

  graphqlClient.runMutation(UpdateSubjectMutation, { ...request }).then(resp => {
    let affectedSubjects = resp.updateSubject;
    dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects });
  });
};
