import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class BookLoader {
    @observable rawBooks = []
    @computed get books(){
        debugger;
        return this.rawBooks.map(b => this.adjustBookForDisplay(b));
    }
    load(bookSearch = {}, publicUserId = ''){
        Promise.resolve(ajaxUtil.get('/book/searchBooks', {
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
        })).then(resp => {
            debugger;
            this.rawBooks = resp.results;
        });
    }
    adjustBookForDisplay(rawBook){
        debugger;
        let book = Object.assign({}, rawBook);
        book.subjectObjects = (book.subjects || []).map(_id => ({ _id, name: 'soon' })); //.map(s => subjectsHash[s]).filter(s => s);
        book.tagObjects = (book.tags || []).map(_id => ({ _id, name: 'soon' })); //.map(s => tagHash[s]).filter(s => s);
        book.authors = book.authors || [];

        let d = new Date(+book.dateAdded);
        book.dateAddedDisplay = `${(d.getMonth()+1)}/${d.getDate()}/${d.getFullYear()}`;
        return book;
    }
}

export default BookLoader;