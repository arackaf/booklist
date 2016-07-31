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

class Store {
    @observable books = []
    @observable subjects = []
    @computed get stackedSubjects(){
        let result = this.subjects.map(s => toJS(s));
        result.forEach(s => s.children = result.filter(sc => new RegExp(`,${s._id},$`).test(sc.path)));
        return result.filter(s => s.path == null);
    }

    loadSubjects(){
        Promise.resolve(ajaxUtil.get('/subject/all', { })).then(resp => {
            this.subjects = resp.results.map(s => new Subject(s));
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