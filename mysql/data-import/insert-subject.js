const { query, getLastId, mySqlConnection } = require("./db-utils");

const subjectFields = ["userId", "name", "path", "color", "backgroundColor"];

module.exports = async function insertSubject(subject) {
  await query(
    `INSERT INTO subjects (${subjectFields.join(", ")}) VALUES (${subjectFields.map(() => "?").join(", ")})`,
    subjectFields.map(field => subject[field])
  );

  const lastId = await getLastId();
  return lastId;
};
