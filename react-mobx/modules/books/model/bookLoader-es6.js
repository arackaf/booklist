import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class BookLoader {
    @observable books = []
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
            this.books = resp.results.map(book => this.adjustBookForDisplay(book));
        });
    }
    adjustBookForDisplay(rawBook){
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