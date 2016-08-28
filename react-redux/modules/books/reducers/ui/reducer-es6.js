import {
    SET_DESKTOP,
    SET_MOBILE
} from './actionNames';

const initialState = {
    isDesktop: false,
    isMobile: false
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case SET_DESKTOP:
            return { ...initialState, isDesktop: true };
        case SET_MOBILE:
            return { ...initialState, isMobile: true };
    }
    return state;
}