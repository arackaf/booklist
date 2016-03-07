const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
const { amazonOperationQueue } = require('../amazonDataAccess/amazonOperationQueue');
const BookDAO = require('../dataAccess/bookDAO');

import pendingBookEntryDAO from '../dataAccess/pendingBookEntryDAO';

class bookController{
    constructor(){}
    @httpPost
    async saveFromIsbn(isbn){
        const userId = +this.request.user.id;

        let search = new AmazonSearch(),
            pendingEntryDao = new pendingBookEntryDAO(userId),
            p = Promise.delayed(resolve => {
                search.lookupBook(isbn).then(response => resolve(response));
            });

        let addingItem = { userId, isbn };
        await pendingEntryDao.add(addingItem);
        amazonOperationQueue.push(p);

        let bookFromAmazon = await p;
        pendingEntryDao.remove(addingItem._id);

        if (bookFromAmazon.failure){
            this.send({ failure: true });
        } else {
            let bookDao = new BookDAO(+this.request.user.id);
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
    async searchBooks(search, subjects, searchChildSubjects){
        let bookDao = new BookDAO(this.request.user.id),
            bookResults = await bookDao.searchBooks(search, subjects, searchChildSubjects);

        this.send({ results: bookResults })
    }
}

module.exports = bookController;