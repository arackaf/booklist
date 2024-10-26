const { query, getLastId, mySqlConnection } = require("./db-utils");

module.exports = async function insertBookSubject(book, tag) {
  await query(`INSERT INTO books_tags (book, tag) VALUES (?, ?)`, [book, tag]);

  const lastId = await getLastId();
  return lastId;
};
