const { query, getLastId, mySqlConnection } = require("./db-utils");

const similarBookFields = ["title", "authors", "isbn", "smallImage", "smallImagePreview"];

module.exports = async function insertSimilarBook(books) {
  const valuesPlaceholders = Array.from({ length: books.length }, () => "(?)").join(", ");
  const values = books.map(book => [book.title, JSON.stringify(book.authors), book.isbn, book.smallImage, JSON.stringify(book.smallImagePreview)]);

  await query(`INSERT INTO similar_books (${similarBookFields.join(", ")}) VALUES ${valuesPlaceholders}`, values);
};
