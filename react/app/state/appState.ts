import { useEffect } from "react";

import localStorageManager from "util/localStorage";
import { isLoggedIn } from "util/loginStatus";
import { getStatePacket } from "util/stateManagementHelpers";
import { getCurrentUrlState, history } from "util/urlHelpers";

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

const REQUEST_DESKTOP = "root.REQUEST_DESKTOP";
const REQUEST_MOBILE = "root.REQUEST_MOBILE";

export const URL_SYNC = "root.URL_SYNC";

const IS_OFFLINE = "root.IS_OFFLINE";
const IS_ONLINE = "root.IS_ONLINE";
export const SET_THEME = "root.SET_THEME";

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
  colorTheme: localStorageManager.get("color-theme", "scheme5")
};

export type AppState = typeof initialState;

function appReducer(state: AppState, action): AppState {
  switch (action.type) {
    case REQUEST_DESKTOP:
      return { ...state, showingDesktop: true, showingMobile: false };
    case REQUEST_MOBILE:
      return { ...state, showingDesktop: false, showingMobile: true };
    case URL_SYNC:
      return { ...state, module: getCurrentModuleFromUrl(), urlState: getCurrentUrlState() };
    case IS_OFFLINE:
      return { ...state, online: false };
    case IS_ONLINE:
      return { ...state, online: true };
    case SET_THEME:
      return { ...state, colorTheme: action.theme };
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

const isOnline = () => ({ type: IS_ONLINE });
const isOffline = () => ({ type: IS_OFFLINE });

export function useAppState(): [AppState, any, any] {
  let actions = { requestDesktop, requestMobile, isOffline, isOnline };
  let result = getStatePacket<AppState>(appReducer, initialState, actions);

  let colorTheme = result[0].colorTheme;
  useEffect(() => {
    localStorageManager.set("color-theme", colorTheme);
    document.body.className = colorTheme;
  }, [colorTheme]);

  return result;
}
