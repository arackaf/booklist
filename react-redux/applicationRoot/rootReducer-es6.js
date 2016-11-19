import {SET_DESKTOP,SET_MOBILE} from './rootReducerActionNames';

const initialState = {
    publicUserId: '',
    publicName: '',
    publicBooksHeader: '',
    isPublic: false,
    isDesktop: false,
    showingDesktop: false,
    isMobile: false,
    showingMobile: false
};

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'SET_PUBLIC_INFO':
            return { ...state, isPublic: true, publicName: action.name, publicBooksHeader: action.booksHeader, publicUserId: action._id };
        case 'RESET_PUBLIC_INFO':
            return { ...state, isPublic: false, publicName: '', publicBooksHeader: '', publicUserId: '' };
        case SET_DESKTOP:
            return { ...state, isDesktop: true, showingDesktop: true, isMobile: false, showingMobile: false };
        case SET_MOBILE:
            return { ...state, isDesktop: false, showingDesktop: false, isMobile: true, showingMobile: true };
    }

    return state;
}