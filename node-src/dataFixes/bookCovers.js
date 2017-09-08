import DAO from "../dataAccess/dao";
import AmazonSearch from "../amazonDataAccess/amazonSearch";

module.exports = async function fixBookCovers() {
  try {
    let db = await DAO.init();
    let books = await db
      .collection("books")
      .find({ smallImage: /http:\/\/ecx/, isbn: /.+/ })
      .toArray();

    if (!books.length) {
      console.log("done");
      return;
    }

    for (let book of books) {
      console.log("Fetching", book.title, book.isbn);
      let amazonResult = await getFreshInfo(book);

      let dbUpdate = {};
      if (amazonResult.smallImage && /https:\/\/./.test(amazonResult.smallImage)) {
        dbUpdate.smallImage = amazonResult.smallImage;
      }
      if (amazonResult.mediumImage && /https:\/\/./.test(amazonResult.mediumImage)) {
        dbUpdate.mediumImage = amazonResult.mediumImage;
      }
      if (dbUpdate.smallImage || dbUpdate.mediumImage) {
        await db.collection("books").update({ _id: book._id }, { $set: dbUpdate }, { upsert: false });
        console.log(book.title, "updated");
      }
    }
    console.log("DONE");
  } catch (err) {
    console.log(err);
  }
};

async function getFreshInfo(book) {
  let amazon = new AmazonSearch();
  return Promise.all([amazon.lookupBook(book.isbn), new Promise(res => setTimeout(res, 1300))])
    .then(([amazonResult]) => amazonResult)
    .catch(err => console.log(err));
}
