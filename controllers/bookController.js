'use strict';

function eventualSortOfBookSavingControllerAction() {
    var aSearch = new AmazonSearch(),
        bookDAO = new BookDAO(1);
    aSearch.lookupBook('0679764410').then(function (book) {
        return bookDAO.saveBook(book);
    }).then(function () {
        return console.log('Book Saved');
    }, function (err) {
        return console.log('Oops - error', err);
    });
}