import getDbConnection from "../../util/getDbConnection";
import { ObjectId } from "mongodb";

import { downloadBookCover, resizeIfNeeded, saveCoverToS3 } from "../../util/bookCoverHelpers";

export async function booksWithoutSimilarity($limit: number = 20) {
  try {
    let db = await getDbConnection();
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

    console.log("Returning books without similarity", books);
    return books;
  } catch (err) {
    console.log("Error loading books without similarity", err);
    return [];
  }
}

export async function addPlaceholder(books) {
  let db = await getDbConnection();
  await db
    .collection("books")
    .update(
      { _id: { $in: books.map(b => ObjectId(b._id)) } },
      { $set: { similarItems: null, similarItemsLastUpdate: +new Date() } },
      { multi: true }
    );
}

export async function updateSimilarityInfo(book, results) {
  let db = await getDbConnection();
  try {
    await db.collection("books").updateOne(
      { _id: ObjectId(book._id) },
      {
        $set: { similarItems: results.map(result => result.isbn), similarItemsLastUpdate: +new Date() }
      }
    );

    for (let book of results) {
      console.log("Testing", book);
      let existingEntry = await db.collection("bookSummaries").findOne({ isbn: book.isbn });
      if (!existingEntry) {
        console.log("Not found, saving");

        if (!/nophoto/i.test(book.smallImage)) {
          let res = await downloadBookCover(book.smallImage, 1000);
          if (res?.fullName) {
            let { fileName, fullName } = res;
            let newPath = await resizeIfNeeded(fileName);

            if (newPath) {
              let s3Key = await saveCoverToS3(newPath, `bookCovers/bookSummary/${fileName}`);
              book.smallImage = s3Key;
            }
          }
        }
        await db.collection("bookSummaries").insertOne(book);
      } else {
        console.log("Already exists, not saving");
      }
    }
  } catch (er) {
    console.log("ERROR updating similarity", er);
  }
}

function useKeyDown() {}

export { useKeyDown as unstable_useKeyDown };
