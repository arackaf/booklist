function eventualSortOfBookSavingControllerAction() {
    var aSearch = new AmazonSearch(),
        bookDAO = new BookDAO(1);
    aSearch.lookupBook('0679764410').then(book => bookDAO.saveBook(book)).then(() => console.log('Book Saved'), err => console.log('Oops - error', err));
}
