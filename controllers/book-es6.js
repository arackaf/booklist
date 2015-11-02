const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
const { amazonOperationQueue } = require('../amazonDataAccess/amazonOperationQueue');
const BookDAO = require('../dataAccess/BookDAO');

class bookController{
    constructor(){}
    details(){
        this.send({ title: 'Two Roads to Sumpter' });
    }
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
}

module.exports = bookController;