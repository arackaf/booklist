import { httpPost, httpGet, route, nonRoutable, controller } from "easy-express-controllers";
import BookDAO from "../dataAccess/bookDAO";
import bookEntryQueueManager from "../app-helpers/bookEntryQueueManager";

@controller({ defaultVerb: "post" })
class bookController {
  async saveFromIsbn({ isbn }) {
    const userId = this.request.user.id;

    try {
      let addingItem = { userId, isbn };
      await bookEntryQueueManager.addPendingBook(userId, addingItem);

      this.send({ success: true });
    } catch (er) {
      this.send({ failure: true });
    }
  }
  async deleteBook({ _id }) {
    let bookDao = new BookDAO(this.request.user.id);
    await bookDao.deleteBook(_id);
    this.send({ success: true });
  }
  async offlineSync(params) {
    if (!this.request.user.id) {
      this.send({});
    }
    let bookDao = new BookDAO(this.request.user.id);
    let { books } = await bookDao.offlineSync({ ...params });

    this.send({ books, userId: this.request.user.id });
  }
  async setRead({ _ids, isRead }) {
    let bookDao = new BookDAO(this.request.user.id);
    await bookDao.setRead(_ids, isRead);

    this.send({ success: true });
  }
  @httpGet
  async loadDetails({ _id }) {
    let bookDao = new BookDAO(this.request.user.id);
    let book = await bookDao.loadBookDetails(_id);
    if (book) {
      this.send({ success: true, editorialReviews: book.editorialReviews || [] });
    } else {
      this.send({ success: false });
    }
  }
}

export default bookController;
