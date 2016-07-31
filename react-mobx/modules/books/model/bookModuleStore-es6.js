import { observable, computed, toJS } from 'mobx';
import { observer } from "mobx-react";

import BookSearch from './bookSearch';

class Book {
    @observable selected = false;
    toggle = () => this.selected = !this.selected;

    constructor(book){
        Object.assign(this, book);
    }
}

class Subject{
    _id = '';
    @observable name = '';
    @observable path = '';
    @computed get childLevel(){ return !this.path ? 0 : (this.path.match(/\,/g) || []).length - 1; };

    constructor(subject){
        Object.assign(this, subject);
    }
}

const subjectCompare = ({ name: name1 }, { name: name2 }) => {
    let name1After = name1.toLowerCase() > name2.toLowerCase(),
        bothEqual = name1.toLowerCase() === name2.toLowerCase();
    return bothEqual ? 0 : (name1After ? 1 : -1);
};

const addAndRecurse = subjects => {
    let result = [];
    subjects.forEach(s => {
        result.push(s);
        if (s.children.length){
            result.push(...addAndRecurse(addAndRecurse(s.children)));
        }
    })
    return result;
}

class Store {
    @observable books = []
    @observable subjects = {}
    @computed get stackedSubjects(){
        let result = Object.keys(this.subjects).map(_id => Object.assign(toJS(this.subjects[_id]), { childLevel: this.subjects[_id].childLevel }));
        result.forEach(s => s.children = result.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)).sort(subjectCompare));
        return result.filter(s => s.path == null).sort(subjectCompare);
    }
    @computed get unwoundSubjects(){
        return addAndRecurse(this.stackedSubjects);
    }

    loadSubjects(){
        Promise.resolve(ajaxUtil.get('/subject/all', { })).then(resp => {
            this.subjects = resp.results.map(s => new Subject(s)).reduce((hash, s) => (hash[s._id] = s, hash), {});

            let s = this.subjects['565bb7e37365ef7636df64fa'];
        });
    }
    loadBooks(bookSearch = {}, publicUserId = ''){
        Promise.resolve(ajaxUtil.get('/book/searchBooks', {
            /*
            search: bookSearch.search,
            subjects: Object.keys(bookSearch.subjects || {}),
            tags: Object.keys(bookSearch.tags || {}),
            searchChildSubjects: bookSearch.searchChildSubjects,
            sort: bookSearch.sort,
            sortDirection: bookSearch.sortDirection,
            author: bookSearch.author,
            publisher: bookSearch.publisher,
            pages: bookSearch.pages,
            pagesOperator: bookSearch.pagesOperator,
            userId: publicUserId
            */
        })).then(resp => {
            this.books = resp.results.map(book => adjustBookForDisplay(book));
        });
    }

    constructor(){
        this.bookSearch = new BookSearch();
        this.loadBooks();
        this.loadSubjects();
    }
}

function adjustBookForDisplay(rawBook){
    let book = new Book(rawBook);
    book.subjectObjects = (book.subjects || []).map(_id => ({ _id, name: 'soon' })); //.map(s => subjectsHash[s]).filter(s => s);
    book.tagObjects = (book.tags || []).map(_id => ({ _id, name: 'soon' })); //.map(s => tagHash[s]).filter(s => s);
    book.authors = book.authors || [];

    let d = new Date(+book.dateAdded);
    book.dateAddedDisplay = `${(d.getMonth()+1)}/${d.getDate()}/${d.getFullYear()}`;
    return book;
}

const instance = new Store();

export default instance;