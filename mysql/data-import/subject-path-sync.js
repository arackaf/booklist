const { query, getLastId, mySqlConnection } = require("./db-utils");

module.exports = async function subjectPathSync(subjectsLookup) {
  const subjects = await query(`SELECT id, path FROM subjects WHERE path IS NOT NULL`);

  for (const subject of subjects) {
    const { id, path } = subject;
    console.log("Subject", id, "Path starting", path);
    const subjects = path
      .split(",")
      .filter(s => s)
      .map(_id => subjectsLookup[_id]);

    const newPath = `,${subjects.join(",")},`;
    console.log("New path", newPath);

    await query(`UPDATE subjects SET path = ? WHERE id = ?`, [newPath, id]);
  }
};
