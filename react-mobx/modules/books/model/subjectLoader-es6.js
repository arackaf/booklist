import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class Subject{
    _id = '';
    @observable name = '';
    @observable path = '';
    @observable children = [];
    @computed get childLevel(){ return !this.path ? 0 : (this.path.match(/\,/g) || []).length - 1; };

    constructor(subject){
        Object.assign(this, subject);
    }
}

class SubjectLoader {
    @observable subjects = []
    @computed get stackedSubjects(){
        //this.subjects.forEach(s => {
        //    s.children = this.subjects.filter(sc => new RegExp(`,${s._id},$`).test(sc.path));
        //});
        return this.subjects.filter(s => s.path == null);
    }
    load(){
        Promise.resolve(ajaxUtil.get('/subject/all', { })).then(resp => {
            this.subjects = resp.results.map(s => new Subject(s));
        });
    }
}

export default SubjectLoader;