import { UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS } from "./actionNames";

import { subjectEditingActions } from "applicationRoot/rootReducerActionCreators";
const { saveSubject, deleteSubject: deleteSubjectRoot } = subjectEditingActions;

export function createOrUpdateSubject(subject) {
  return function(dispatch, getState) {
    let { _id, name, parentId, backgroundColor, textColor } = subject,
      request = { _id: _id || null, name, parentId, backgroundColor, textColor };

    saveSubject(request, dispatch);
  };
}

export function deleteSubject(_id) {
  return function(dispatch, getState) {
    deleteSubjectRoot(_id, dispatch);
  };
}
