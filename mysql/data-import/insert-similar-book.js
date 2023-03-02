const { query, getLastId, mySqlConnection } = require("./db-utils");

const similarBookFields = ["title", "authors", "isbn", "smallImage", "smallImagePreview"];

module.exports = async function insertSimilarBook(book) {
  if (!book.title) {
    console.log("No title skipping");
    return;
  }
  await query(`INSERT INTO similar_books (${similarBookFields.join(", ")}) VALUES (${similarBookFields.map(() => "?").join(", ")})`, [
    book.title,
    JSON.stringify(book.authors),
    book.isbn,
    book.smallImage,
    JSON.stringify(book.smallImagePreview)
  ]);
  console.log("Similar book inserted");
};
