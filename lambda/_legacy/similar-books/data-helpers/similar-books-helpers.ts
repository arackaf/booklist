import { ObjectId, Db } from "mongodb";

import { attemptSimilarBookCover } from "../../../util/similarBookHelpers";

export async function booksWithoutSimilarity(db: Db, $limit: number = 20) {
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

    console.log("Returning books without similarity", books);
    return books;
  } catch (err) {
    console.log("Error loading books without similarity", err);
    return [];
  }
}

export async function addPlaceholder(db: Db, books) {
  await db
    .collection("books")
    .updateMany({ _id: { $in: books.map(b => new ObjectId(b._id)) } }, { $set: { similarItems: null, similarItemsLastUpdate: +new Date() } });
}

export async function updateSimilarityInfo(db: Db, book, results) {
  try {
    await db.collection("books").updateOne(
      { _id: new ObjectId(book._id) },
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
          const urlToAttempt = book.smallImage;
          // if this fails in any way, just set it to the generic placeholder
          book.smallImage = "https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png";

          try {
            let res = await attemptSimilarBookCover(urlToAttempt, 1000);
            if (res.STATUS === "success") {
              let { preview, url } = res.image;

              book.smallImage = url;
              book.smallImagePreview = preview;
            }
          } catch (er) {
            console.log("Error downloading similar book item cover", er);
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
