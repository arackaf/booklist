import { httpPost, route, nonRoutable, controller } from "easy-express-controllers";
import BookDAO from "../dataAccess/bookDAO";

@controller({ defaultVerb: "post" })
class bookController {
  constructor() {}
  async setSubjects({ books, add, remove }) {
    try {
      let bookDao = new BookDAO(this.request.user.id);
      await bookDao.setBooksSubjects(books, add, remove);
      this.send({ success: true });
    } catch (errr) {
      console.log(errr);
    }
  }
  async setTags({ books, add, remove }) {
    try {
      let bookDao = new BookDAO(this.request.user.id);
      await bookDao.setBooksTags(books, add, remove);
      this.send({ success: true });
    } catch (errr) {
      console.log(errr);
    }
  }
}

export default bookController;
