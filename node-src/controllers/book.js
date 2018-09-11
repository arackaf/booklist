import { httpPost, httpGet, route, nonRoutable, controller } from "easy-express-controllers";
import BookDAO from "../dataAccess/bookDAO";
import bookEntryQueueManager from "../app-helpers/bookEntryQueueManager";

const { graphql } = require("graphql");
import { executableSchema, root } from "../../startApp";

import orderBy from "lodash.orderby";

import findBooksQuery from "../graphql-queries/findBooks";
import findRecommendationQuery from "../graphql-queries/findRecommendations";

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
  async getRecommendations(params) {
    try {
      let resp = await graphql(executableSchema, findBooksQuery, root, this.request, { ids: params.bookIds });
      let books = resp.data.allBooks.Books;
      let asinMap = new Map([]);
      books.forEach(book => {
        (book.similarItems || []).forEach(asin => {
          if (!asinMap.has(asin)) {
            asinMap.set(asin, 0);
          }
          asinMap.set(asin, asinMap.get(asin) + 1);
        });
      });

      let asins = [...asinMap.keys()];

      let results = await graphql(executableSchema, findRecommendationQuery, root, this.request, { asins });
      let resultRecommendations = results.data.allBookSummarys.BookSummarys;
      let resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.asin, b]));
      let asinsOrdered = orderBy([...asinMap.entries()].map(([asin, count]) => ({ asin, count })), ["count"], ["desc"]);
      let finalResults = asinsOrdered.map(b => resultRecommendationLookup.get(b.asin)).filter(b => b);
      this.send({ results: finalResults });
    } catch (err) {
      console.log("err", err);
    }
  }
}

controller({ defaultVerb: "post" })(BookController);

export default BookController;
