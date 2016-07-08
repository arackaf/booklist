import {
    SET_DESKTOP,
    SET_MOBILE,
    SET_COVERS
} from './actionNames';

const initialState = {
    isDesktop: false,
    isMobile: false,
    isCovers: false
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case SET_DESKTOP:
            return { ...initialState, isDesktop: true };
        case SET_MOBILE:
            return { ...initialState, isMobile: true };
        case SET_COVERS:
            return { ...initialState, isCovers: true };
    }
    return state;
}