import { httpPost, route, nonRoutable, controller } from "easy-express-controllers";
import BookDAO from "../dataAccess/bookDAO";

@controller({ defaultVerb: "post" })
class bookController {
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
