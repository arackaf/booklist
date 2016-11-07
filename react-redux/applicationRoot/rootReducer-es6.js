import {
    SET_DESKTOP,
    SET_MOBILE
} from './rootReducerActionNames';

const initialState = {
    publicUserId: '',
    publicName: '',
    publicBooksHeader: '',
    isPublic: false,
    isDesktop: false,
    isMobile: false
};

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'SET_PUBLIC_INFO':
            return { ...state, isPublic: true, publicName: action.name, publicBooksHeader: action.booksHeader, publicUserId: action._id };
        case 'RESET_PUBLIC_INFO':
            return { ...state, isPublic: false, publicName: '', publicBooksHeader: '', publicUserId: '' };
        case SET_DESKTOP:
            return { ...state, isDesktop: true };
        case SET_MOBILE:
            return { ...state, isMobile: true };
    }

    return state;
}