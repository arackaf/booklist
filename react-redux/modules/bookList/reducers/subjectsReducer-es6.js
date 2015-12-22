const { LOAD_SUBJECTS_RESULTS, EDIT_SUBJECT, EDIT_SUBJECTS, SET_NEW_SUBJECT_NAME, SET_NEW_SUBJECT_PARENT, STOP_EDITING_SUBJECTS, UPDATE_SUBJECT, UPDATE_SUBJECT_RESULTS } = require('../actions/actionNames');

const { stackAndGetTopLevelSubjects } = require('../util/booksSubjectsHelpers');

const initialSubjectsState = () => ({
    list: {},
    editSubjectsPacket: null
});

function subjectsReducer(state = initialSubjectsState(), action = {}){
    switch(action.type){
        case LOAD_SUBJECTS_RESULTS:
            return Object.assign({}, state, { list: subjectsToHash(action.subjects) });
        case EDIT_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: { newSubjectName: '', newSubjectParent: '', editingSubjectId: '' } });
        case SET_NEW_SUBJECT_NAME:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: action.value }) });
        case SET_NEW_SUBJECT_PARENT:
            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectParent: action.value }) });
        case STOP_EDITING_SUBJECTS:
            return Object.assign({}, state, { editSubjectsPacket: null });
        case EDIT_SUBJECT:
            var editingSubject = Object.assign({}, [...flattenedSubjects(state.list)].find(s => s._id == action._id)),
                newSubjectParent;

            var eligibleParents = [...flattenedSubjects(state.list)]
                .filter(s => s._id !== action._id && (!new RegExp(`,${action._id},`).test(s.path)))
                .map(o => Object.assign({}, o));

            if (editingSubject.path == null){
                newSubjectParent = null;
            } else {
                let hierarchy = editingSubject.path.split(',');
                newSubjectParent = hierarchy[hierarchy.length - 2];
            }

            return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { newSubjectName: editingSubject.name, newSubjectParent, editingSubject, eligibleParents }) });
        case UPDATE_SUBJECT_RESULTS:
            if ((action.existingParent || null) == (action.newParent || null)) {
                //parent's the same - update name and we're done
                let existingSubjects = [...flattenedSubjects(state.list)],
                    tweakedSubjects = existingSubjects.map(s => s._id == action._id ? Object.assign({}, s, { name: action.newName }) : s);

                return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editingSubject: null }), list: stackAndGetTopLevelSubjects(tweakedSubjects) });
            } else {
                //not the most efficient code ... flatten all subjects, rip out those that were affected, re-stack
                let existingSubjects = [...flattenedSubjects(state.list)],
                    affectedIds = action.affectedSubjects.map(s => '' + s._id),
                    tweakedSubjects = existingSubjects.map(s => Object.assign({}, s)).filter(s => affectedIds.indexOf('' + s._id) == -1);

                return Object.assign({}, state, { editSubjectsPacket: Object.assign({}, state.editSubjectsPacket, { editingSubject: null }), list: stackAndGetTopLevelSubjects(tweakedSubjects.concat(action.affectedSubjects)) });
            }
    }
    return state;
}

function subjectsToHash(subjects){
    let hash = {};
    subjects.forEach(s => hash[s._id] = s);
    return hash;
}

function *flattenedSubjects(subjects){
    for (let subject of subjects){
        yield subject;
        if (subject.children.length) {
            yield* flattenedSubjects(subject.children);
        }
    }
}

module.exports = { subjectsReducer };