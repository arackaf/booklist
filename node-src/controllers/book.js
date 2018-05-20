import { httpPost, httpGet, route, nonRoutable, controller } from "easy-express-controllers";
import BookDAO from "../dataAccess/bookDAO";
import bookEntryQueueManager from "../app-helpers/bookEntryQueueManager";

class BookController {
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
  async offlineSync(params) {
    if (!this.request.user.id) {
      this.send({});
    }
    let bookDao = new BookDAO(this.request.user.id);
    let { books } = await bookDao.offlineSync({ ...params });

    this.send({ books, userId: this.request.user.id });
  }
}

controller({ defaultVerb: "post" })(BookController);

export default BookController;
