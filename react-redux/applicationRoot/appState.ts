import { useReducer, useMemo } from "react";

const isTouch = "ontouchstart" in window || "onmsgesturechange" in window;
const uiSettings = { isTouch, isDesktop: false, showingDesktop: false, isMobile: false, showingMobile: false };

const { logged_in, userId } = isLoggedIn();
const authSettings = logged_in && userId ? { isLoggedIn: true, userId } : { isLoggedIn: false, userId: "" };

export const REQUEST_DESKTOP = "root.REQUEST_DESKTOP";
export const REQUEST_MOBILE = "root.REQUEST_MOBILE";

export const SET_PUBLIC_INFO = "root.SET_PUBLIC_INFO";
export const RESET_PUBLIC_INFO = "root.RESET_PUBLIC_INFO";
export const SET_MODULE = "root.SET_MODULE";
export const NEW_LOGIN = "root.NEW_LOGIN";

export const IS_OFFLINE = "root.IS_OFFLINE";
export const IS_ONLINE = "root.IS_ONLINE";

const initialState = {
  ...uiSettings,
  ...authSettings,
  publicUserId: "",
  publicName: "",
  publicBooksHeader: "",
  isPublic: false,
  module: "",
  online: navigator.onLine
};

export type AppState = typeof initialState;

function appReducer(state: AppState, action): AppState {
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

const setDeviceOverride = view => {
  try {
    if (view == "mobile") {
      localStorage.removeItem("useDesktop");
    } else {
      localStorage.setItem("useDesktop", "1");
    }
  } catch (e) {}
};

const requestDesktop = () => dispatch => {
  setDeviceOverride("desktop");
  dispatch({ type: REQUEST_DESKTOP });
};

const requestMobile = () => dispatch => {
  setDeviceOverride("mobile");
  dispatch({ type: REQUEST_MOBILE });
};

const setModule = module => ({ type: SET_MODULE, module });

function makeActionCreators(dispatch, fns) {
  return useMemo(
    () =>
      Object.entries(fns).reduce((hash, [name, fn]: [any, any]) => {
        hash[name] = (...args) => dispatch(fn(...args));
        return hash;
      }, {}),
    []
  );
}

export function useAppState(): [AppState, any, any] {
  let [appState, dispatch] = useReducer(appReducer, initialState);
  if ((useAppState as any).__lastState === appState) {
    return (useAppState as any).__lastResult;
  }
  let actions = { requestDesktop, requestMobile, setModule };

  let myDispatch = val => {
    if (typeof val === "object") {
      dispatch(val);
    } else if (typeof val === "function") {
      val(dispatch);
    } else throw "Fuck off";
  };

  (useAppState as any).__lastResult = [appState, myDispatch, makeActionCreators(myDispatch, actions)];
  (useAppState as any).__lastState = appState;
  return (useAppState as any).__lastResult;
}

export function isLoggedIn() {
  let logged_in = getCookie("logged_in");
  let userId = getCookie("userId");
  return { logged_in, userId };
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}
