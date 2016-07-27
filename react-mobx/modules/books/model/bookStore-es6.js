import { observable, computed } from 'mobx';

import BooksLoader from './bookLoader';

class BookStore{
    constructor(){
        this._booksLoader = new BooksLoader();
        this._booksLoader.load();
    }
    @computed get books(){ return this._booksLoader.books; }
    @computed get rawBooks(){ return this._booksLoader.rawBooks; }
}

export default new BookStore();
