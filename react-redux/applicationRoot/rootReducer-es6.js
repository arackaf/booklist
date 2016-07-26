const initialState = {
    publicUserId: '',
    publicName: '',
    publicBooksHeader: '',
    isPublic: false
};

export default function rootReducer(state = initialState, action){
    switch(action.type){
        case 'SET_PUBLIC_INFO':
            return { ...state, isPublic: true, publicName: action.name, publicBooksHeader: action.booksHeader, publicUserId: action._id };
        case 'RESET_PUBLIC_INFO':
            return { ...state, isPublic: false, publicName: '', publicBooksHeader: '', publicUserId: '' };
    }

    return state;
}