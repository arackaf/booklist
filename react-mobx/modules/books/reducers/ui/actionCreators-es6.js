import {
    SET_DESKTOP,
    SET_MOBILE,
    SET_COVERS
} from './actionNames';

export function setDesktop(){
    return { type: SET_DESKTOP };
}

export function setMobile(){
    return { type: SET_MOBILE };
}

export function setCovers(){
    return { type: SET_COVERS };
}
