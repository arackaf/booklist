import { useEffect } from "react";
import localStorageManager from "util/localStorage";
import { getStatePacket } from "util/stateManagementHelpers";

const isTouch = "ontouchstart" in window || "onmsgesturechange" in window;
const uiSettings = { isTouch, isDesktop: false, showingDesktop: false, isMobile: false, showingMobile: false };

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

const SET_MODULE = "root.SET_MODULE";

const IS_OFFLINE = "root.IS_OFFLINE";
const IS_ONLINE = "root.IS_ONLINE";
export const SET_THEME = "root.SET_THEME";

const initialState = {
  ...uiSettings,
  publicUserId: "",
  publicName: "",
  publicBooksHeader: "",
  isPublic: false,
  module: "",
  online: navigator.onLine,
  colorTheme: localStorageManager.get("color-theme", "scheme3")
};

export type AppState = typeof initialState;

function appReducer(state: AppState, action): AppState {
  switch (action.type) {
    case REQUEST_DESKTOP:
      return { ...state, showingDesktop: true, showingMobile: false };
    case REQUEST_MOBILE:
      return { ...state, showingDesktop: false, showingMobile: true };
    case SET_MODULE:
      return { ...state, module: action.module };
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

const setModule = module => ({ type: SET_MODULE, module });
const isOnline = () => ({ type: IS_ONLINE });
const isOffline = () => ({ type: IS_OFFLINE });

export function useAppState(): [AppState, any, any] {
  let actions = { requestDesktop, requestMobile, setModule, isOffline, isOnline };
  let result = getStatePacket<AppState>(appReducer, initialState, actions);

  let colorTheme = result[0].colorTheme;
  useEffect(() => {
    localStorageManager.set("color-theme", colorTheme);
    document.body.className = colorTheme;
  }, [colorTheme]);

  return result;
}
