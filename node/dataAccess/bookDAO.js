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
}

export default BookDAO;
