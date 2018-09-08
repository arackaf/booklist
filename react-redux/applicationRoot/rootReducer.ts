import { createSelector } from "reselect";
import update from "immutability-helper";

import {
  SET_IS_TOUCH,
  SET_PUBLIC_INFO,
  RESET_PUBLIC_INFO,
  SET_LOGGED_IN,
  SET_DESKTOP,
  SET_MOBILE,
  REQUEST_DESKTOP,
  REQUEST_MOBILE,
  SET_MODULE,
  LOAD_SUBJECTS,
  LOAD_SUBJECTS_RESULTS,
  LOAD_COLORS,
  SAVE_SUBJECT_RESULTS,
  SUBJECT_DELETED,
  LOAD_TAGS_RESULTS,
  UPDATE_TAG_RESULTS,
  TAG_DELETED
} from "./rootReducerActionNames";

interface ITag {
  _id: string;
  name: string;
}

export const hashOf = <T>() => <{ [s: string]: T }>{};

const initialState = {
  isTouch: false,
  userId: "",
  publicUserId: "",
  publicName: "",
  publicBooksHeader: "",
  isPublic: false,
  isDesktop: false,
  showingDesktop: false,
  isMobile: false,
  showingMobile: false,
  subjectHash: {} as { [s: string]: SubjectType },
  colors: [],
  module: "",
  isLoggedIn: false,
  subjectsLoaded: false,
  subjectsInitialQueryFired: false,
  tagHash: hashOf<ITag>(),
  tagsLoaded: false
};

export type AppType = typeof initialState;
export type SubjectType = {
  _id: string;
  name: string;
  path: string;
};

export type RootApplicationType = {
  app: AppType;
};

export const objectsToHash = objs => objs.reduce((hash, o) => ((hash[o._id] = o), hash), {});

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_TOUCH:
      return { ...state, isTouch: action.value };
    case SET_PUBLIC_INFO:
      return { ...state, isPublic: true, publicName: action.publicName, publicBooksHeader: action.publicBooksHeader, publicUserId: action.userId };
    case RESET_PUBLIC_INFO:
      return { ...state, isPublic: false, publicName: "", publicBooksHeader: "", publicUserId: "" };
    case SET_DESKTOP:
      return { ...state, isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false };
    case SET_MOBILE:
      return { ...state, isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true };
    case REQUEST_DESKTOP:
      return { ...state, showingDesktop: true, showingMobile: false };
    case REQUEST_MOBILE:
      return { ...state, showingDesktop: false, showingMobile: true };
    case SET_MODULE:
      return { ...state, module: action.module };
    case SET_LOGGED_IN:
      return { ...state, isLoggedIn: true, userId: action.userId };
    case LOAD_SUBJECTS:
      return { ...state, subjectsInitialQueryFired: true };
    case LOAD_SUBJECTS_RESULTS:
      return { ...state, subjectHash: objectsToHash(action.subjects), subjectsLoaded: true };
    case LOAD_COLORS:
      return { ...state, colors: action.colors.map(c => c.backgroundColor) };
    case SAVE_SUBJECT_RESULTS:
      return { ...state, subjectHash: { ...state.subjectHash, ...objectsToHash(action.affectedSubjects) } };
    case SUBJECT_DELETED:
      let subjectHash = { ...state.subjectHash };
      action.subjectsDeleted.forEach(_id => delete subjectHash[_id]);
      return { ...state, subjectHash };
    case LOAD_TAGS_RESULTS:
      return { ...state, tagHash: objectsToHash(action.tags), tagsLoaded: true };
    case UPDATE_TAG_RESULTS:
      return { ...state, tagHash: { ...state.tagHash, ...objectsToHash([action.tag]) } };
    case TAG_DELETED:
      return update(state, { tagHash: { $unset: [action._id] } });
  }

  return state;
}

export const selectAppUiState = createSelector(
  (state: RootApplicationType) => state.app,
  app => ({
    showingMobile: app.showingMobile,
    showingDesktop: app.showingDesktop,
    isPublic: app.isPublic,
    publicBooksHeader: app.publicBooksHeader,
    publicName: app.publicName
  })
);

export const combineSelectors = <TResult>(...selectors): ((state) => TResult) =>
  (createSelector as any)(...selectors, (...results) => Object.assign({}, ...results));

export const unwindSubjects = (subjects): SubjectType[] => {
  let result = [];
  subjects.forEach(s => result.push(s, ...unwindSubjects(s.children || [])));
  return result;
};

export const subjectSortCompare = ({ name: name1 }, { name: name2 }) => {
  name1 = name1 || "";
  name2 = name2 || "";

  let name1After = name1.toLowerCase() > name2.toLowerCase(),
    bothEqual = name1.toLowerCase() === name2.toLowerCase();
  return bothEqual ? 0 : name1After ? 1 : -1;
};

export const topLevelSubjectsSortedSelector = createSelector(
  (state: { app: AppType }) => state.app.subjectHash,
  subjectHash =>
    Object.keys(subjectHash)
      .map(_id => subjectHash[_id])
      .filter(s => !s.path)
      .sort(subjectSortCompare)
);

export const getAllDescendantsOfSubject = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(s => regex.test(s.path));
};

export const getChildSubjectsSorted = (_id, subjectHash) => {
  let regex = new RegExp(`,${_id},$`);
  return Object.keys(subjectHash)
    .map(_id => subjectHash[_id])
    .filter(sc => regex.test(sc.path))
    .sort(subjectSortCompare);
};

export const subjectChildMapSelector = createSelector(
  (state: { app: AppType }) => state.app.subjectHash,
  subjectHash =>
    Object.keys(subjectHash)
      .map(_id => ({ _id, children: getChildSubjectsSorted(_id, subjectHash) }))
      .reduce((hash, o) => ((hash[o._id] = o.children), hash), {})
);

export const stackAndGetTopLevelSubjects = (subjectsHash): SubjectType[] => {
  let subjects = Object.keys(subjectsHash).map(_id => ({ ...subjectsHash[_id] }));
  subjects.sort(subjectSortCompare).forEach(s => {
    s.children = [];
    s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectSortCompare));
    s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
  });
  return subjects.filter(s => s.path == null);
};

export const getRootSubject = path => (path ? path.split(",")[1] : null);

export const computeSubjectParentId = path => {
  if (path) {
    let pathParts = path.split(",");
    return pathParts[pathParts.length - 2];
  } else {
    return "";
  }
};

export const flattenSubjects = subjects => Object.keys(subjects).map(k => subjects[k]);

export const getEligibleParents = (subjectHash, _id) => {
  let eligibleParents = null;
  if (!_id && _id != null) {
    eligibleParents = flattenSubjects(subjectHash);
  } else if (_id) {
    eligibleParents = flattenSubjects(subjectHash).filter(s => s._id !== _id && !new RegExp(`,${_id},`).test(s.path));
  }
  if (eligibleParents) {
    eligibleParents.sort(subjectSortCompare);
  }

  return eligibleParents;
};

export const filterTags = (tags, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return tags.filter(s => search(s.name));
};

function allTagssSorted(tagHash): ITag[] {
  let tags = Object.keys(tagHash).map(_id => tagHash[_id]);
  return tags.sort(({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
      bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : name1After ? 1 : -1;
  });
}

export const selectEntireTagsState = createSelector(
  (state: RootApplicationType) => state.app.tagHash,
  (state: RootApplicationType) => state.app.colors,
  (tagHash, colors) => ({
    colors,
    tagHash,
    allTagsSorted: allTagssSorted(tagHash)
  })
);
