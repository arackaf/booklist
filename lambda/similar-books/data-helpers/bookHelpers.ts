import getDbConnection from "../../util/getDbConnection";

export async function booksWithoutSimilarity($limit: number = 1) {
  let db = await getDbConnection();
  try {
    let dateReference = +new Date() - 1000 * 60 * 60 * 24 * 60;
    let query = {
      $and: [
        { userId: { $ne: "5b57f71b6871ae00145198ff" } },
        { $or: [{ similarItems: { $exists: false } }, { similarItemsLastUpdate: { $lt: dateReference } }] }
      ]
    };
    let project = { _id: 1, isbn: 1 };

    let books = await db
      .collection("books")
      .aggregate([{ $match: query }, { $project: project }, { $limit }])
      .toArray();

    return books;
  } catch (err) {
    console.log(err);
  }
}

export async function addSimilarBookInfoPlaceholder(book) {
  let db = await getDbConnection();
  await db.collection("books").updateOne({ _id: book._id }, { $set: { similarItems: null, similarItemsLastUpdate: +new Date() } });
}

export async function updateBookSimilarity(book, results) {
  let db = await getDbConnection();
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
  } catch (er) {
    console.log("ERROR updating similarity", er);
  }
}
