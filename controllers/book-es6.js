const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
const { amazonOperationQueue } = require('../amazonDataAccess/amazonOperationQueue');
const BookDAO = require('../dataAccess/BookDAO');

class bookController{
    constructor(){}
    @httpPost
    async saveFromIsbn(isbn){
        let search = new AmazonSearch();
        let p = Promise.delayed(resolve => {
            search.lookupBook(isbn).then(response => resolve(response));
        });
        amazonOperationQueue.push(p);

        let bookFromAmazon = await p;

        if (bookFromAmazon.failure){
            this.send({ failure: true });
        } else {
            let bookDao = new BookDAO();
            await bookDao.saveBook(bookFromAmazon);
            this.send(bookFromAmazon);
        }
    }
    @httpPost
    async deleteBook(id){
        let bookDao = new BookDAO();
        await bookDao.deleteBook(id);
        this.send({ success: true });
    }
    async searchBooks(search, subjects){
        let bookDao = new BookDAO(this.request.user.id),
            bookResults = await bookDao.searchBooks(search, subjects);

        this.send({ results: bookResults })
    }
}

module.exports = bookController;