export const BEGIN_PENDNIG_DELETE = "subjectsModule.BEGIN_PENDNIG_DELETE";
export const CANCEL_PENDNIG_DELETE = "subjectsModule.CANCEL_PENDNIG_DELETE";
export const DELETING_SUBJECTS = "subjectsModule.DELETING_SUBJECTS";
export const DONE_DELETING_SUBJECTS = "subjectsModule.DONE_DELETING_SUBJECTS";

export const ADD_NEW_SUBJECT = "subjectsModule.ADD_NEW_SUBJECT";
export const BEGIN_SUBJECT_EDIT = "subjectsModule.BEGIN_SUBJECT_EDIT";
export const SET_EDITING_SUBJECT_FIELD = "subjectsModule.SET_EDITING_SUBJECT_FIELD";
export const SUBJECTS_SAVING = "subjectsModule.SUBJECTS_SAVING";
export const CLEAR_SAVING_STATE = "subjectsModule.CLEAR_SAVING_STATE";
export const CANCEL_SUBJECT_EDIT = "subjectsModule.CANCEL_SUBJECT_EDIT";
export const UPDATE_SUBJECT = "subjectsModule.UPDATE_SUBJECT";
export const UPDATE_SUBJECT_RESULTS = "subjectsModule.UPDATE_SUBJECT_RESULTS";
export const BEGIN_SUBJECT_DELETE = "subjectsModule.BEGIN_SUBJECT_DELETE";

export const SET_SUBJECT_DRAGGING = "subjectsModule.SET_SUBJECT_DRAGGING";
export const SUBJECT_DRAGGING_OVER = "subjectsModule.SUBJECT_DRAGGING_OVER";

import update from "immutability-helper";
import { getStatePacket } from "applicationRoot/rootReducer";
import { SubjectsContext } from "applicationRoot/renderUI";
import { createContext, useContext, useMemo } from "react";
import { getEligibleParents } from "applicationRoot/subjectsState";

const initialSubjectsState = {
  draggingId: null,
  currentDropCandidateId: null,
  pendingSubjectsHash: {},
  pendingDeleteHash: {},
  deletingHash: {},
  editingSubjectsHash: {},
  subjectsSaving: {},
  subjectsSaved: {}
};

export type SubjectType = {
  _id: string;
  name: string;
  parentId: string;
};

export type SubjectsDndType = typeof initialSubjectsState;

function reducer(state = initialSubjectsState, action) {
  switch (action.type) {
    case ADD_NEW_SUBJECT:
      return {
        ...state,
        pendingSubjectsHash: { ...state.pendingSubjectsHash, [action.subject._id]: action.subject },
        editingSubjectsHash: { ...state.editingSubjectsHash, [action.subject._id]: action.subject }
      };

    case BEGIN_SUBJECT_EDIT:
      return { ...state, editingSubjectsHash: { ...state.editingSubjectsHash, [action._id]: action.subject } };
    case CANCEL_SUBJECT_EDIT:
      return update(state, {
        editingSubjectsHash: { $unset: [action._id] },
        pendingSubjectsHash: { $unset: [action._id] }
      });

    case BEGIN_PENDNIG_DELETE:
      return { ...state, pendingDeleteHash: { ...state.pendingDeleteHash, [action._id]: true } };
    case CANCEL_PENDNIG_DELETE:
      return update(state, { pendingDeleteHash: { $unset: [action._id] } });
    case DELETING_SUBJECTS:
      return { ...state, deletingHash: { ...state.deletingHash, ...action.subjects } };
    case DONE_DELETING_SUBJECTS:
      return update(state, {
        pendingDeleteHash: { $unset: Object.keys(action.subjects) },
        deletingHash: { $unset: Object.keys(action.subjects) }
      });
    case SET_SUBJECT_DRAGGING:
      return { ...state, draggingId: action.sourceId };
    case SUBJECT_DRAGGING_OVER:
      return { ...state, draggingId: action.sourceId, currentDropCandidateId: action.targetId };
    case SUBJECTS_SAVING:
      return { ...state, subjectsSaving: { ...state.subjectsSaving, ...action.subjects } };
    case CLEAR_SAVING_STATE:
      return update(state, {
        subjectsSaved: { $unset: Object.keys(action.subjects) },
        subjectsSaving: { $unset: Object.keys(action.subjects) },
        editingSubjectsHash: { $unset: Object.keys(action.subjects) },
        pendingSubjectsHash: { $unset: Object.keys(action.subjects) }
      });
    case SET_EDITING_SUBJECT_FIELD:
      return {
        ...state,
        editingSubjectsHash: {
          ...state.editingSubjectsHash,
          [action._id]: { ...state.editingSubjectsHash[action._id], [action.field]: action.value }
        }
      };
  }
  return state;
}

export function useSubjectsDndState(): [SubjectsDndType, any, any] {
  let actions = {};
  return getStatePacket<SubjectsDndType>(reducer, initialSubjectsState, actions);
}

export const SubjectsDnDContext = createContext<[SubjectsDndType, any, any]>(null);

export const editingSubjectHashSelector = () => {
  const [{ subjectHash }] = useContext(SubjectsContext);
  const [{ editingSubjectsHash }] = useContext(SubjectsDnDContext);

  return useMemo(() => {
    return {
      editingSubjectsHash: Object.keys(editingSubjectsHash)
        .map(_id => editingSubjectsHash[_id])
        .reduce((hash, s) => ((hash[s._id] = { ...s, eligibleParents: getEligibleParents(subjectHash, s._id) }), hash), {}) as object
    };
  }, [subjectHash, editingSubjectsHash]);
};

export const draggingSubjectSelector = () => {
  const [{ subjectHash }] = useContext(SubjectsContext);
  const [{ draggingId }] = useContext(SubjectsDnDContext);

  return useMemo(() => (draggingId ? { ...subjectHash[draggingId], _id: draggingId + "_dragging", candidateMove: true } : null), [
    subjectHash,
    draggingId
  ]);
};

const tempSubjectCompare = ({ _id: id1 }, { _id: id2 }) => id1 - id2;

export const pendingSubjectsSelector = () => {
  const [{ pendingSubjectsHash }] = useContext(SubjectsDnDContext);

  return useMemo(() => {
    let result: { [s: string]: SubjectType[] } = {};
    Object.keys(pendingSubjectsHash).forEach(_id => {
      let subject = pendingSubjectsHash[_id],
        resultKey = subject.parentId || "root";

      if (!result[resultKey]) {
        result[resultKey] = [];
      }
      result[resultKey].push(subject);
    });
    Object.keys(result).forEach(parentId => result[parentId].sort(tempSubjectCompare));
    return result;
  }, [pendingSubjectsHash]);
};
