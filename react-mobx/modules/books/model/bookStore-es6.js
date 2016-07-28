import { observable, computed } from 'mobx';

import BooksLoader from './bookLoader';
import BookSearch from './bookSearch';

class BookStore{
    constructor(){
        this.bookSearch = new BookSearch();
        this.booksLoader = new BooksLoader();
        this.booksLoader.load();
    }
    @computed get books(){ return this.booksLoader.books; }
    @computed get rawBooks(){ return this.booksLoader.rawBooks; }
}

export default new BookStore();
