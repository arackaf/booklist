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

const graphqlClient = new Client({
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

    Promise.resolve(ajaxUtil.get("/subject/all", { userId: publicUserId })).then(subjectsResp => {
      dispatch({ type: LOAD_SUBJECTS_RESULTS, subjects: subjectsResp.results });
      //dispatch({ type: LOAD_COLORS, colors: subjectsResp.colors });
    });
  };
}

export const subjectEditingActions = {
  saveSubject(subjectProps, dispatch) {
    //return ajaxUtil.post("/subject/setInfo", subjectProps, resp => dispatch({ type: SAVE_SUBJECT_RESULTS, affectedSubjects: resp.affectedSubjects }));
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
    return ajaxUtil.post("/subject/delete", { _id: _id + "" }, resp =>
      dispatch({ type: SUBJECT_DELETED, subjectsDeleted: resp.subjectsDeleted, _id })
    );
  }
};

export const setIsTouch = value => ({ type: SET_IS_TOUCH, value });
