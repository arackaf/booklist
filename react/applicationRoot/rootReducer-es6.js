let applicationData = {
    get module(){
        return 'Book entry';
    }
};

function rootReducer(state = {}){
    return Object.assign({}, applicationData);
}

module.exports = rootReducer;