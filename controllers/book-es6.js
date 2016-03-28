const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
import amazonOperationQueue from '../amazonDataAccess/amazonOperationQueue';
import BookDAO from '../dataAccess/bookDAO';
import pendingBookEntryDAO from '../dataAccess/pendingBookEntryDAO';

class bookController{
    constructor(){}
    @httpPost
    async saveFromIsbn(isbn){
        const userId = +this.request.user.id;

        try {
            let pendingEntryDao = new pendingBookEntryDAO(userId),
                addingItem = {userId, isbn};
            await pendingEntryDao.add(addingItem);

            this.send({success: true});
        } catch(er) {
            this.send({ failure: true })
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