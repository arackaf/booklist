const { query, getLastId, mySqlConnection } = require("./db-utils");

module.exports = async function insertBookSubject(book, subject) {
  await query(`INSERT INTO books_subjects (book, subject) VALUES (?, ?)`, [book, subject]);

  const lastId = await getLastId();
  return lastId;
};
