import { httpPost, route, nonRoutable } from 'easy-express-controllers';
import AmazonSearch from '../amazonDataAccess/AmazonSearch.js';
import amazonOperationQueue from '../amazonDataAccess/amazonOperationQueue';
import BookDAO from '../dataAccess/bookDAO';
import pendingBookEntryDAO from '../dataAccess/pendingBookEntryDAO';
import bookEntryQueueManager from '../app-helpers/bookEntryQueueManager';

class bookController{
    constructor(){}
    @httpPost
    async saveFromIsbn({ isbn }){
        const userId = this.request.user.id;

        try {
            let addingItem = {userId, isbn};
            await bookEntryQueueManager.addPendingBook(userId, addingItem);

            this.send({success: true});
        } catch(er) {
            this.send({ failure: true })
        }
    }
    @httpPost
    async deleteBook({ _id }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.deleteBook(_id);
        this.send({ success: true });
    }
    @httpPost
    async saveManual({ book }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.saveManual(book);
        this.send({ success: true });
    }
    @httpPost
    async update({ book }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.update(book);
        this.send({ success: true });
    }
    @httpPost
    async searchBooks(params){
        let bookDao = new BookDAO(this.request.user ? this.request.user.id : null),
            bookResults = await bookDao.searchBooks({ ...params });

        this.send({ results: bookResults });
    }
    @httpPost
    async setRead({ _ids, isRead }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.setRead(_ids, isRead);

        this.send({ success: true })
    }
}

export default bookController;