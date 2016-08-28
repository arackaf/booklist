import {
    SET_DESKTOP,
    SET_MOBILE,
    REQUEST_DESKTOP,
    REQUEST_MOBILE
} from './actionNames';

export function setDesktop(){
    return { type: SET_DESKTOP };
}

export function setMobile(){
    return { type: SET_MOBILE };
}

export function requestMobile(){
    return { type: REQUEST_MOBILE };
}

export function requestDesktop(){

    //TODO: pending proper thunk refactor
    //let viewport = document.querySelector("meta[name=viewport]");
    //viewport.setAttribute('content', '');

    return { type: REQUEST_DESKTOP };
}