import DAO from "./dao";

class CompletedEntriesDao extends DAO {
  async logCompletedEntry(userId, isbn, bookFound) {
    let db = await super.open();
    try {
      let bookInfo = { title: bookFound.title, author: bookFound.author, smallImage: bookFound.smallImage, mediumImage: bookFound.mediumImage };
      return await db.collection("completedEntries").insertOne(Object.assign({}, bookInfo, { userId, requestedIsbn: isbn, success: true }));
    } finally {
      super.dispose(db);
    }
  }
  async logFailedEntry(userId, isbn) {
    let db = await super.open();
    try {
      return await db.collection("completedEntries").insertOne(Object.assign({}, { userId, requestedIsbn: isbn, success: false }));
    } finally {
      super.dispose(db);
    }
  }
}

export default CompletedEntriesDao;
