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
import { getStatePacket } from "util/stateManagementHelpers";
import { createContext, useContext, useMemo } from "react";
import { getEligibleParents, computeSubjectParentId, unwindSubjects, getAllDescendantsOfSubject, useSubjectsState } from "app/subjectsState";

import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import { syncUpdates } from "util/graphqlHelpers";

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
  let actions = {
    addNewSubject,
    beginDrag,
    clearSubjectDragging,
    subjectDraggingOver,
    subjectNotDraggingOver,
    beginSubjectEdit,
    cancelSubjectEdit,
    beginSubjectDelete,
    cancelSubjectDelete,
    setEditingSubjectField,
    setNewParent,
    deleteSubject,
    saveChanges
  };
  return getStatePacket<SubjectsDndType>(reducer, initialSubjectsState, actions);
}

export const SubjectsDnDContext = createContext<[SubjectsDndType, any, any]>(null);

export const useEditingSubjectHash = () => {
  const { subjectHash } = useSubjectsState();
  const [{ editingSubjectsHash }] = useContext(SubjectsDnDContext);

  return useMemo(() => {
    return {
      editingSubjectsHash: Object.keys(editingSubjectsHash)
        .map(_id => editingSubjectsHash[_id])
        .reduce((hash, s) => ((hash[s._id] = { ...s, eligibleParents: getEligibleParents(subjectHash, s._id) }), hash), {}) as object
    };
  }, [subjectHash, editingSubjectsHash]);
};

export const useDraggingSubject = () => {
  const { subjectHash } = useSubjectsState();
  const [{ draggingId }] = useContext(SubjectsDnDContext);

  return useMemo(() => (draggingId ? { ...subjectHash[draggingId], _id: draggingId + "_dragging", candidateMove: true } : null), [
    subjectHash,
    draggingId
  ]);
};

const tempSubjectCompare = ({ _id: id1 }, { _id: id2 }) => id1 - id2;

export const usePendingSubjects = () => {
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

export const useSubjectEditInfo = subject => {
  const [{ editingSubjectsHash, pendingDeleteHash, deletingHash, subjectsSaving, subjectsSaved }] = useContext(SubjectsDnDContext);
  const { _id } = subject;

  return useMemo(
    () => ({
      isEditingSubject: !!editingSubjectsHash[_id],
      isPendingDelete: pendingDeleteHash[_id],
      isDeleting: deletingHash[_id],
      isSubjectSaving: !!subjectsSaving[_id],
      isSubjectSaved: !!subjectsSaved[_id]
    }),
    [editingSubjectsHash, pendingDeleteHash, deletingHash, subjectsSaving, subjectsSaved, _id]
  );
};

// ---------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------- actions ---------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------

const toIdHash = objs => objs.reduce((hash, obj) => ((hash[obj._id] = true), hash), {});

let tempId = -1;

const addNewSubject = parentId => ({ type: ADD_NEW_SUBJECT, subject: { _id: tempId--, name: "", parentId: parentId || null, pending: true } });

const beginDrag = sourceId => ({ type: SET_SUBJECT_DRAGGING, sourceId });
const clearSubjectDragging = () => ({ type: SUBJECT_DRAGGING_OVER, sourceId: null, targetId: null });
const subjectDraggingOver = targetId => (dispatch, getState) => {
  let sourceId = getState().draggingId;
  dispatch({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId });
};
const subjectNotDraggingOver = targetId => (dispatch, getState) => {
  let sourceId = getState().draggingId;
  let currentTarget = getState().currentDropCandidateId;

  if (currentTarget == targetId) {
    dispatch({ type: SUBJECT_DRAGGING_OVER, sourceId, targetId: null });
  }
};

const cancelSubjectEdit = _id => ({ type: CANCEL_SUBJECT_EDIT, _id });
const beginSubjectEdit = (_id, subjectHash) => dispatch => {
  let subject = { ...subjectHash[_id] };
  subject.parentId = computeSubjectParentId(subject.path);
  dispatch({ type: BEGIN_SUBJECT_EDIT, _id, subject });
};

const beginSubjectDelete = _id => ({ type: BEGIN_PENDNIG_DELETE, _id });
const cancelSubjectDelete = _id => ({ type: CANCEL_PENDNIG_DELETE, _id });

const setEditingSubjectField = (_id, field, value) => ({ type: SET_EDITING_SUBJECT_FIELD, _id, field, value });

const saveChanges = (subject, original, subjectHash, runUpdate) => dispatch => {
  let { _id, name, parentId, backgroundColor, textColor } = subject;
  let request = { _id, name, parentId, backgroundColor, textColor };

  if (!name) {
    dispatch(setEditingSubjectField(_id, "validationError", "Name is required"));
    return;
  }

  if (original.pending) {
    request._id = null;
  }

  let oldParentId = original.pending ? "" : computeSubjectParentId(subjectHash[_id].path);
  let subjectsSavingHash;
  if (oldParentId != subject.parentId) {
    subjectsSavingHash = toIdHash(unwindSubjects([original]));
    subjectsSavingHash[subject.parentId] = true;

    if (subject.parentId) {
      let newParentPath = subjectHash[subject.parentId].path;
      if (newParentPath) {
        newParentPath
          .split(",")
          .filter(s => s)
          .forEach(_id => (subjectsSavingHash[_id] = true));
      }
    }
  } else {
    subjectsSavingHash = toIdHash([subject]);
  }

  dispatch({ type: SUBJECTS_SAVING, subjects: subjectsSavingHash });

  Promise.resolve(runUpdate(request)).then(() => dispatch({ type: CLEAR_SAVING_STATE, subjects: subjectsSavingHash }));
};

const setNewParent = (subject, newParent, subjectHash, runInsert) => dispatch => {
  let { _id, name, backgroundColor, textColor } = subject,
    adjustedSubject = { ...subject },
    request = { _id, name, backgroundColor, textColor, parentId: newParent._id };

  if (!newParent.path) {
    adjustedSubject.path = `,${newParent._id},`;
  } else {
    adjustedSubject.path = `${newParent.path},${newParent._id},`;
  }

  let subjectsSavingHash = toIdHash(unwindSubjects([adjustedSubject]));
  adjustedSubject.path
    .split(",")
    .filter(s => s)
    .concat(getAllDescendantsOfSubject(adjustedSubject._id, subjectHash).map(s => s._id))
    .forEach(_id => (subjectsSavingHash[_id] = true));

  //provide immediate feedback, so the DnD "sticks"
  syncUpdates(AllSubjectsQuery, [adjustedSubject], "allSubjects", "Subjects", { force: true });
  dispatch(clearSubjectDragging());
  //disable dragging and editing on the entire hierarchy until the save is done
  dispatch({ type: SUBJECTS_SAVING, subjects: subjectsSavingHash });

  Promise.resolve(runInsert(request)).then(() => dispatch({ type: CLEAR_SAVING_STATE, subjects: subjectsSavingHash }));
};

const deleteSubject = (_id, subjectHash, deleteSubject) => dispatch => {
  let subjectsDeleting = [{ _id }, ...getAllDescendantsOfSubject(_id, subjectHash)];

  dispatch({ type: DELETING_SUBJECTS, subjects: toIdHash(subjectsDeleting) });

  Promise.resolve(deleteSubject({ _id })).then(resp =>
    dispatch({ type: DONE_DELETING_SUBJECTS, subjects: resp.deleteSubject.reduce((o, _id) => ((o[_id] = true), o), {}) })
  );
};
