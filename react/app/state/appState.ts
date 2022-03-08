import { useEffect, createContext } from "react";

import localStorageManager from "util/localStorage";
import { isLoggedIn } from "util/loginStatus";
import { getStatePacket } from "util/stateManagementHelpers";
import { getCurrentUrlState, history } from "util/urlHelpers";
import ajaxUtil from "util/ajaxUtil";

const isTouch = "ontouchstart" in window || "onmsgesturechange" in window;
const uiSettings = { isTouch, isDesktop: false, showingDesktop: false, isMobile: false, showingMobile: false, desktopRequested: false };

const { logged_in, userId, loginToken } = isLoggedIn();
const authSettings = logged_in && userId ? { isLoggedIn: true, userId, loginToken } : { isLoggedIn: false, userId: "", loginToken: "" };

if (logged_in && !loginToken) {
  ajaxUtil.postAuth("/logout", {}, () => ((window as any).location = "/"));
}

if (logged_in && (window as any).location.pathname == "/login") {
  window.location.replace("/");
}

if (window.screen.width < 700) {
  Object.assign(uiSettings, { isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true });
} else {
  Object.assign(uiSettings, { isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false });
}

if (!!localStorage.getItem("useDesktop")) {
  Object.assign(uiSettings, { showingDesktop: true, showingMobile: false });
}

const REQUEST_DESKTOP = "root.REQUEST_DESKTOP";
const REQUEST_MOBILE = "root.REQUEST_MOBILE";

export const URL_SYNC = "root.URL_SYNC";

const IS_OFFLINE = "root.IS_OFFLINE";
const IS_ONLINE = "root.IS_ONLINE";
export const SET_THEME = "root.SET_THEME";
export const SET_WHITE_BG = "root.SET_WHITE_BG";

let initialUrlState = getCurrentUrlState();
let initialSearchState = initialUrlState.searchState;

export function getCurrentModuleFromUrl() {
  let location = history.location;
  let originalModule = location.pathname.replace(/\//g, "").toLowerCase();
  let { logged_in, userId: currentUserId } = isLoggedIn();
  let moduleToLoad = originalModule || (logged_in ? "books" : "home");
  let publicModule = moduleToLoad == "home" || moduleToLoad == "view" || moduleToLoad == "activate" || moduleToLoad == "settings";

  let loggedIn = logged_in && currentUserId;

  if (!loggedIn && !publicModule) {
    moduleToLoad = "authenticate";
  }

  return moduleToLoad;
}

const initialState = {
  ...uiSettings,
  ...authSettings,
  publicUserId: initialSearchState.userId,
  publicName: "",
  publicBooksHeader: "",
  isPublic: !!initialSearchState.userId,
  module: null,
  urlState: initialUrlState,
  online: navigator.onLine,
  colorTheme: localStorageManager.get("color-theme", "scheme5"),
  whiteBackground: localStorageManager.get("white-bg", "0")
};

export type AppState = typeof initialState;

function appReducer(state: AppState, action): AppState {
  switch (action.type) {
    case REQUEST_DESKTOP:
      return { ...state, showingDesktop: true, showingMobile: false, desktopRequested: true };
    case REQUEST_MOBILE:
      return { ...state, showingDesktop: false, showingMobile: true, desktopRequested: false };
    case URL_SYNC:
      return { ...state, module: getCurrentModuleFromUrl(), urlState: getCurrentUrlState() };
    case IS_OFFLINE:
      return { ...state, online: false };
    case IS_ONLINE:
      return { ...state, online: true };
    case SET_THEME:
      return { ...state, colorTheme: action.theme };
    case SET_WHITE_BG:
      return { ...state, whiteBackground: action.value ? "1" : "0" };
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
    window.location.reload();
  } catch (e) {}
};

const requestDesktop = () => dispatch => {
  setDeviceOverride("desktop");
};

const requestMobile = () => dispatch => {
  setDeviceOverride("mobile");
};

const isOnline = () => ({ type: IS_ONLINE });
const isOffline = () => ({ type: IS_OFFLINE });

export function useAppState(): [AppState, any, any] {
  let actions = { requestDesktop, requestMobile, isOffline, isOnline };
  let result = getStatePacket<AppState>(appReducer, initialState, actions);

  let colorTheme = result[0].colorTheme;
  let whiteBg = result[0].whiteBackground;
  useEffect(() => {
    localStorageManager.set("color-theme", colorTheme);
    localStorageManager.set("white-bg", whiteBg);
    document.body.className = `${colorTheme} ${whiteBg == "1" ? "white-bg" : ""}`;
  }, [colorTheme, whiteBg]);

  return result;
}

export const AppContext = createContext<[AppState, any, any]>(null);

export const ModuleUpdateContext = createContext<{ startTransition: any; isPending: boolean }>(null);
