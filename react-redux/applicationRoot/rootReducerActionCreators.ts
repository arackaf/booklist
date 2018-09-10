import {
  SET_IS_TOUCH,
  SET_DESKTOP,
  SET_MOBILE,
  REQUEST_DESKTOP,
  REQUEST_MOBILE,
  SET_MODULE,
  SET_LOGGED_IN,
  SET_PUBLIC_INFO,
  LOAD_SUBJECTS,
  LOAD_SUBJECTS_RESULTS,
  LOAD_COLORS,
  SAVE_SUBJECT_RESULTS,
  SUBJECT_DELETED
} from "./rootReducerActionNames";

import { Client } from "micro-graphql-react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

export const setDesktop = () => ({ type: SET_DESKTOP });
export const setMobile = () => ({ type: SET_MOBILE });

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
export const setRequestDesktop = () => ({ type: REQUEST_DESKTOP });

export const setModule = module => ({ type: SET_MODULE, module });
export const setLoggedIn = userId => ({ type: SET_LOGGED_IN, userId });
export const setPublicInfo = publicInfo => ({ type: SET_PUBLIC_INFO, ...publicInfo });

export const setIsTouch = value => ({ type: SET_IS_TOUCH, value });

let subjectsLoaded = false;

export function loadSubjects() {
  return function(dispatch, getState) {
    if (subjectsLoaded || getState().app.subjectsLoaded) {
      return;
    }
    subjectsLoaded = true;
    let publicUserId = getState().app.publicUserId;
    dispatch({ type: LOAD_SUBJECTS });

    Promise.all([graphqlClient.runQuery(AllSubjectsQuery, { publicUserId }), graphqlClient.runQuery(AllLabelColorsQuery)]).then(
      ([
        { data },
        {
          data: {
            allLabelColors: { LabelColors: labelColors }
          }
        }
      ]) => {
        dispatch({ type: LOAD_COLORS, colors: labelColors });
        dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: data.allSubjects.Subjects });
      }
    );
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
