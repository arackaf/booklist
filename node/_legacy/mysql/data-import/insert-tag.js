const { query, getLastId, mySqlConnection } = require("./db-utils");

const tagFields = ["userId", "name", "textColor", "backgroundColor"];

module.exports = async function insertTag(tag) {
  await query(
    `INSERT INTO tags (${tagFields.join(", ")}) VALUES (${tagFields.map(() => "?").join(", ")})`,
    tagFields.map(field => tag[field])
  );

  const lastId = await getLastId();
  return lastId;
};
