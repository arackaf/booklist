const { query, getLastId, mySqlConnection } = require("./db-utils");

const bookFields = [
  "userId",
  "dateAdded",
  "title",
  "authors",
  "isbn",
  "pages",
  "isRead",
  "mobileImage",
  "mobileImagePreview",
  "smallImage",
  "smallImagePreview",
  "mediumImage",
  "mediumImagePreview",
  "publicationDate",
  "publisher",
  "similarBooks",
  "editorialReviews"
];

module.exports = async function insertBook(book) {
  await query(`INSERT INTO books (${bookFields.join(", ")}) VALUES (${bookFields.map(() => "?").join(", ")})`, [
    book.userId,
    book.dateAdded,
    book.title,
    JSON.stringify(book.authors || []),
    book.isbn,
    typeof book.pages !== "number" ? null : book.pages,
    book.isRead ?? false,
    book.mobileImage,
    JSON.stringify(book.mobileImagePreview),
    book.smallImage,
    JSON.stringify(book.smallImagePreview),
    book.mediumImage,
    JSON.stringify(book.mediumImagePreview),
    book.publicationDate,
    book.publisher,
    JSON.stringify(book.similarItems),
    JSON.stringify(book.editorialReviews)
  ]);

  const lastId = await getLastId();
  return lastId;
};
