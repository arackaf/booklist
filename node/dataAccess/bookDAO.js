import { ObjectId } from "mongodb";
import DAO from "./dao";

import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

class BookDAO extends DAO {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  async saveBook(book) {
    let db = await super.open();
    try {
      book.userId = this.userId;
      let result = await db.collection("books").insertOne(book);

      super.confirmSingleResult(result);
    } finally {
      super.dispose(db);
    }
  }

  async booksWithoutSimilarity() {
    let db = await super.open();
    try {
      let query = { similarItems: { $exists: false } };
      let project = { _id: 1, isbn: 1 };

      try {
        let books = await db
          .collection("books")
          .aggregate([{ $match: query }, { $project: project }, { $limit: 10 }])
          .toArray();

        return books;
      } catch (err) {
        console.log(err);
      }
    } finally {
      super.dispose(db);
    }
  }

  async updateBookSimilarity(book, results) {
    let db = await super.open();
    try {
      await db.collection("books").updateOne(
        { _id: book._id },
        {
          $set: { similarItems: results.map(result => result.isbn), similarItemsLastUpdate: +new Date() }
        }
      );

      for (let book of results) {
        let existingEntry = await db.collection("bookSummaries").findOne({ isbn: book.isbn });
        if (!existingEntry) {
          await db.collection("bookSummaries").insertOne(book);
        }
      }
    } finally {
      super.dispose(db);
    }
  }
}

function adjustForClient(book) {
  book.dateAdded = +book._id.getTimestamp();
  if (/\d{4}-\d{2}-\d{2}/.test(book.publicationDate)) {
    book.publicationDate = moment(book.publicationDate).format("MMMM Do YYYY");
  }
  if (/http:\/\/my-library-cover-uploads/.test(book.smallImage)) {
    book.smallImage =
      "https://s3.amazonaws.com/my-library-cover-uploads/" +
      book.smallImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
  }
  return book;
}

export default BookDAO;
