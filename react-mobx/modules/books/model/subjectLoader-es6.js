import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class Subject{
    _id = '';
    @observable name = '';
    @observable path = '';
    @observable children = [];

    constructor(subject){
        Object.assign(this, subject);
    }
}

class SubjectLoader {
    @observable subjects = []
    load(){
        Promise.resolve(ajaxUtil.get('/subject/all', { })).then(resp => {
            debugger;
        });
    }
    stackAndGetTopLevelSubjects(subjects){
        subjects.forEach(s => {
            s.children = [];
            s.children.push(...subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
            s.childLevel = !s.path ? 0 : (s.path.match(/\,/g) || []).length - 1;
        });
        return subjects.filter(s => s.path == null);
    }
}

export default SubjectLoader;