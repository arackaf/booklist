import { httpPost, httpGet, route, nonRoutable, controller } from 'easy-express-controllers';
import BookDAO from '../dataAccess/bookDAO';
import bookEntryQueueManager from '../app-helpers/bookEntryQueueManager';

@controller({ defaultVerb: 'post' })
class bookController{
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
    async deleteBook({ _id }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.deleteBook(_id);
        this.send({ success: true });
    }
    async saveManual({ book }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.saveManual(book);
        this.send({ success: true });
    }
    async update({ book }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.update(book);
        this.send({ success: true });
    }
    async searchBooks(params){
        let bookDao = new BookDAO(this.request.user ? this.request.user.id : null),
            {books, count} = await bookDao.searchBooks({ ...params });

        this.send({ results: books, count });
    }
    async setRead({ _ids, isRead }){
        let bookDao = new BookDAO(this.request.user.id);
        await bookDao.setRead(_ids, isRead);

        this.send({ success: true })
    }
    @httpGet
    async loadDetails({_id}){
        let bookDao = new BookDAO(this.request.user.id);
        let book = await bookDao.loadBookDetails(_id);
        if (book){
            this.send({success: true, editorialReviews: book.editorialReviews || []});
        } else {
            this.send({success: false});
        }
    }
}

export default bookController;