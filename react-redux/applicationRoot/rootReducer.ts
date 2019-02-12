import { createSelector } from "reselect";
import update from "immutability-helper";

import {
  SET_PUBLIC_INFO,
  RESET_PUBLIC_INFO,
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
  TAG_DELETED,
  NEW_LOGIN,
  IS_OFFLINE,
  IS_ONLINE
} from "./rootReducerActionNames";
import { useMemo, useReducer } from "react";

import { setDefaultClient, Client } from "micro-graphql-react";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);

export function getSearchVersion(key) {
  let initialSearchVersion = +localStorage.getItem(key);

  if (initialSearchVersion) {
    let currentTime = +new Date();
    let delta = currentTime - initialSearchVersion;

    //2 hours
    if (delta > 2 * 60 * 60 * 1000) {
      initialSearchVersion = +new Date();
    }
  } else {
    initialSearchVersion = +new Date();
  }
  localStorage.setItem(key, "" + initialSearchVersion);
  return initialSearchVersion;
}

export const BOOK_SEARCH_VERSION_KEY = "bookSearchVersion";
export const SUBJECTS_SEARCH_VERSION_KEY = "subjectsSearchVersion";
export const TAGS_SEARCH_VERSION_KEY = "tagsSearchVersion";

let initialSubjectsVersion = getSearchVersion(SUBJECTS_SEARCH_VERSION_KEY);
let initialTagsVersion = getSearchVersion(TAGS_SEARCH_VERSION_KEY);

export interface ITag {
  _id: string;
  name: string;
}

export const hashOf = <T>() => <{ [s: string]: T }>{};

const isTouch = "ontouchstart" in window || "onmsgesturechange" in window;

const uiSettings = { isTouch, isDesktop: false, showingDesktop: false, isMobile: false, showingMobile: false };

const { logged_in, userId } = isLoggedIn();
const authSettings = logged_in && userId ? { isLoggedIn: true, userId } : { isLoggedIn: false, userId: "" };

if (window.screen.width < 700) {
  Object.assign(uiSettings, { isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true });
} else {
  Object.assign(uiSettings, { isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false });
}

if (!!localStorage.getItem("useDesktop")) {
  Object.assign(uiSettings, { showingDesktop: true, showingMobile: false });
}

const initialState = {
  ...uiSettings,
  ...authSettings,
  publicUserId: "",
  publicName: "",
  publicBooksHeader: "",
  isPublic: false,
  subjectHash: {} as { [s: string]: SubjectType },
  colors: [],
  module: "",
  subjectsLoaded: false,
  subjectsInitialQueryFired: false,
  tagHash: hashOf<ITag>(),
  tagsLoaded: false,
  tagsVersion: initialTagsVersion,
  subjectsVersion: initialSubjectsVersion,
  online: navigator.onLine
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
    case SAVE_SUBJECT_RESULTS:
    case SUBJECT_DELETED:
    case NEW_LOGIN:
      let newSearchVersion = +new Date();
      localStorage.setItem(SUBJECTS_SEARCH_VERSION_KEY, "" + newSearchVersion);
      state = { ...state, subjectsVersion: newSearchVersion };
  }

  switch (action.type) {
    case UPDATE_TAG_RESULTS:
    case TAG_DELETED:
    case NEW_LOGIN:
      let newSearchVersion = +new Date();
      localStorage.setItem(TAGS_SEARCH_VERSION_KEY, "" + newSearchVersion);
      state = { ...state, tagsVersion: newSearchVersion };
  }

  switch (action.type) {
    case SET_PUBLIC_INFO:
      return { ...state, isPublic: true, publicName: action.publicName, publicBooksHeader: action.publicBooksHeader, publicUserId: action.userId };
    case RESET_PUBLIC_INFO:
      return { ...state, isPublic: false, publicName: "", publicBooksHeader: "", publicUserId: "" };
    case REQUEST_DESKTOP:
      return { ...state, showingDesktop: true, showingMobile: false };
    case REQUEST_MOBILE:
      return { ...state, showingDesktop: false, showingMobile: true };
    case SET_MODULE:
      return { ...state, module: action.module };
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
    case NEW_LOGIN:
      let { logged_in, userId } = isLoggedIn();
      return { ...state, isLoggedIn: !!logged_in, userId };
    case IS_OFFLINE:
      return { ...state, online: false };
    case IS_ONLINE:
      return { ...state, online: true };
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
    publicName: app.publicName,
    online: app.online
  })
);

type F = (...args) => any;
function combineSelectors<T extends F, U extends F>(a: T, b: U): (state: any) => ReturnType<T> & ReturnType<U>;
function combineSelectors<T extends F, U extends F, V extends F>(a: T, b: U, c: V): (state: any) => ReturnType<T> & ReturnType<U> & ReturnType<V>;
function combineSelectors<T extends F, U extends F, V extends F, W extends F>(
  a: T,
  b: U,
  c: V,
  d: W
): (state: any) => ReturnType<T> & ReturnType<U> & ReturnType<V> & ReturnType<W>;
function combineSelectors<T extends F, U extends F, V extends F, W extends F, X extends F>(
  a: T,
  b: U,
  c: V,
  d: W,
  e: X
): (state: any) => ReturnType<T> & ReturnType<U> & ReturnType<V> & ReturnType<W> & ReturnType<X>;
function combineSelectors<T extends F, U extends F, V extends F, W extends F, X extends F>(
  a: T,
  b: U,
  c?: V,
  d?: W,
  e?: X
): (state: any) => ReturnType<T> & ReturnType<U> & ReturnType<V> & ReturnType<W> & ReturnType<X> {
  let selectors = [a, b, c, d, e].filter(selector => selector);

  return (createSelector as any)(...selectors, (...results) => Object.assign({}, ...results));
}

export { combineSelectors };

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

export const selectStackedSubjects = createSelector(
  (state: RootApplicationType) => state.app.subjectHash,
  subjectHash => {
    let mainSubjectsCollection = stackAndGetTopLevelSubjects(subjectHash),
      subjectsUnwound = unwindSubjects(mainSubjectsCollection);
    return {
      subjects: mainSubjectsCollection,
      allSubjectsSorted: allSubjectsSorted(subjectHash),
      subjectsUnwound: subjectsUnwound,
      subjectHash
    };
  }
);

export const selectEntireSubjectsState = createSelector(
  state => state.app,
  selectStackedSubjects,
  (app, stackedSubjects) => {
    return {
      colors: app.colors,
      ...stackedSubjects
    };
  }
);

function allSubjectsSorted(subjectsHash): SubjectType[] {
  let subjects = Object.keys(subjectsHash).map(_id => subjectsHash[_id]);
  return subjects.sort(subjectSortCompare);
}

export const filterSubjects = (subjects, search) => {
  if (!search) {
    search = () => true;
  } else {
    let regex = new RegExp(search, "i");
    search = txt => regex.test(txt);
  }
  return subjects.filter(s => search(s.name));
};

export function isLoggedIn() {
  let logged_in = getCookie("logged_in"),
    userId = getCookie("userId");
  return { logged_in, userId };
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

export const selectLoggedIn = createSelector(
  (state: RootApplicationType) => state.app.isLoggedIn,
  (state: RootApplicationType) => state.app.userId,
  (isLoggedIn, userId) => ({ isLoggedIn, userId })
);

export function makeActionCreators(dispatch, fns) {
  return Object.entries(fns).reduce((hash, [name, fn]: [any, any]) => {
    hash[name] = (...args) => dispatch(fn(...args));
    return hash;
  }, {});
}

export function getStatePacket<T>(reducer, initialState, actions?): [T, any, any] {
  let [state, dispatch] = useReducer(reducer, initialState);
  let newDispatch = actions
    ? useMemo(() => {
        return val => {
          if (typeof val === "object") {
            dispatch(val);
          } else if (typeof val === "function") {
            val(dispatch, state);
          } else throw "Fuck off";
        };
      }, [dispatch, state])
    : null;

  return useMemo(() => [state, actions ? makeActionCreators(newDispatch, actions) : {}, dispatch], [state]) as any;
}
