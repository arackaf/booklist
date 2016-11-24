import {SET_DESKTOP, SET_MOBILE, REQUEST_DESKTOP, REQUEST_MOBILE, SET_MODULE, SET_LOGGED_IN} from './rootReducerActionNames';

export const setDesktop = () => ({ type: SET_DESKTOP });
export const setMobile = () => ({ type: SET_MOBILE });

export const requestDesktop = () => ({ type: REQUEST_DESKTOP });
export const requestMobile = () => ({ type: REQUEST_MOBILE });
export const setModule = module => ({ type: SET_MODULE, module });
export const setLoggedIn = () => ({ type: SET_LOGGED_IN });