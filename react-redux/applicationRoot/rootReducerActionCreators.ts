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

import { Client, compress } from "micro-graphql-react";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

import ajaxUtil from "util/ajaxUtil";

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

let subjectsLoaded = false;

export function loadSubjects() {
  return function(dispatch, getState) {
    if (subjectsLoaded || getState().app.subjectsLoaded) {
      return;
    }
    subjectsLoaded = true;

    let publicUserId = getState().app.publicUserId;

    dispatch({ type: LOAD_SUBJECTS });

    Promise.all([
      graphqlClient.runQuery(compress`query allSubjects {
        allSubjects(publicUserId: ${JSON.stringify(publicUserId)}, SORT: {name: 1}) {
          Subjects {
            _id, name, backgroundColor, textColor, path,  
          }
        }
      }`),
      graphqlClient.runQuery(
        compress`query labelColors {
          allLabelColors(SORT: {order: 1}) {
            LabelColors { _id, backgroundColor, order }
          }
        }`
      )
    ]).then(([{ data }, { data: { allLabelColors: { LabelColors: labelColors } } }]) => {
      dispatch({ type: LOAD_COLORS, colors: labelColors });
      dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: data.allSubjects.Subjects });
    });
  };
}

export const subjectEditingActions = {
  saveSubject(subjectProps, dispatch) {
    graphqlClient
      .runMutation(
        `mutation updateSubject($_id: String, $name: String, $backgroundColor: String, $textColor: String, $parentId: String) {
          updateSubject(_id: $_id, name: $name, backgroundColor: $backgroundColor, textColor: $textColor, parentId: $parentId) {
            _id, name, backgroundColor, textColor, path
          }
        }`,
        { ...subjectProps }
      )
      .then(resp => {
        let affectedSubjects = resp.updateSubject;
        dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects });
      });
  },
  deleteSubject(_id, dispatch) {
    return graphqlClient
      .runMutation(
        `mutation deleteSubject {
          deleteSubject(_id: "${_id}")
        }`
      )
      .then(resp => {
        dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.deleteSubject, _id });
        return { subjectsDeleted: resp.deleteSubject };
      });
  }
};

export const setIsTouch = value => ({ type: SET_IS_TOUCH, value });
