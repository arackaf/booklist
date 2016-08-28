import {
    SET_DESKTOP,
    SET_MOBILE,
    REQUEST_DESKTOP,
    REQUEST_MOBILE
} from './actionNames';

const initialState = {
    isDesktop: false,
    isMobile: false,
    desktopRequested: false,
    mobileRequested: false
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case SET_DESKTOP:
            return { ...initialState, isDesktop: true };
        case SET_MOBILE:
            return { ...initialState, isMobile: true };
        case REQUEST_DESKTOP:
            return {...state, desktopRequested: true, mobileRequested: false };
        case REQUEST_MOBILE:
            return {...state, desktopRequested: false, mobileRequested: true };
    }
    return state;
}