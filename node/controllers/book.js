import { controller } from "easy-express-controllers";
import bookEntryQueueManager from "../app-helpers/bookEntryQueueManager";

const { graphql } = require("graphql");
import { executableSchema, root } from "../../startApp";

import orderBy from "lodash.orderby";

import findBooksQuery from "../graphql-queries/findBooks";
import findRecommendationQuery from "../graphql-queries/findRecommendations";
import findRecommendationMatches from "../graphql-queries/findRecommendationMatches";

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3 } from "../util/bookCovers/bookCoverHelpers";

import { ObjectId } from "mongodb";
import { getDbConnection } from "../util/dbUtils";

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
  async getRecommendations(params) {
    try {
      let resp = await graphql(executableSchema, findBooksQuery, root, this.request, { ids: params.bookIds });
      let books = resp.data.allBooks.Books;
      let isbnMap = new Map([]);
      books.forEach(book => {
        (book.similarItems || []).forEach(isbn => {
          if (!isbnMap.has(isbn)) {
            isbnMap.set(isbn, 0);
          }
          isbnMap.set(isbn, isbnMap.get(isbn) + 1);
        });
      });

      let isbns = [...isbnMap.keys()];

      let results = await graphql(executableSchema, findRecommendationQuery, root, this.request, { isbns });
      let resultRecommendations = results.data.allBookSummarys.BookSummarys;
      let resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.isbn, b]));
      let isbnsOrdered = orderBy([...isbnMap.entries()].map(([isbn, count]) => ({ isbn, count })), ["count"], ["desc"]);
      let potentialRecommendations = isbnsOrdered.map(b => resultRecommendationLookup.get(b.isbn)).filter(b => b);

      let potentialIsbns = potentialRecommendations.map(b => b.isbn).filter(x => x);

      let matches = (await graphql(executableSchema, findRecommendationMatches, root, this.request, {
        userId: this.request.user.id,
        isbns: potentialIsbns
      })).data.allBooks.Books;

      let matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));
      let matchingEans = new Set(matches.map(m => m.ean).filter(x => x));

      let finalResults = potentialRecommendations.filter(m => (!m.isbn || !matchingIsbns.has(m.isbn)) && (!m.ean || !matchingEans.has(m.ean)));

      this.send({ results: finalResults });
    } catch (err) {
      console.log("err", err);
    }
  }
  async newSmallImage({ _id, url }) {
    this.sizeAndSetImage({ _id, url, width: 50, imgKey: "smallImage" });
  }
  async newMediumImage({ _id, url }) {
    this.sizeAndSetImage({ _id, url, width: 106, imgKey: "mediumImage" });
  }
  async sizeAndSetImage({ _id, url, imgKey, width }) {
    let userId = this.request.user.id;
    let res = await downloadBookCover(url, 750);

    if (!res) {
      this.send({ failure: true, msg: "failure during download" });
    }

    let { fileName, fullName } = res;
    let newPath = await resizeIfNeeded(fileName, width);

    if (!newPath) {
      this.send({ failure: true, msg: "failure during resize" });
    }

    let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId}/${fileName}`);
    let { db, client } = await getDbConnection();

    await db.collection("books").updateOne(
      { _id: ObjectId(_id), userId },
      {
        $set: { [imgKey]: s3Key }
      }
    );

    await client.close();

    removeFile(fullName);
    removeFile(newPath);

    this.send({ url: s3Key });
  }
}

controller({ defaultVerb: "post" })(BookController);

export default BookController;
