import { observable, computed } from 'mobx';

import BooksLoader from './bookLoader';
import BookSearch from './bookSearch';
import SubjectLoader from './subjectLoader';

class BookStore{
    constructor(){
        this.bookSearch = new BookSearch();
        this.subjectLoader = new SubjectLoader();
        this.booksLoader = new BooksLoader();

        this.booksLoader.load();
        this.subjectLoader.load();
    }
    @computed get books(){ return this.booksLoader.books; }
}

export default new BookStore();
