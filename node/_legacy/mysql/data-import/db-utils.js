const mysql = require("mysql");

const mySqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});
module.exports.mySqlConnection = mySqlConnection;
mySqlConnection.connect();

function query(...args) {
  return new Promise((res, rej) => {
    mySqlConnection.query(...args, (err, results) => {
      if (err) {
        rej(err);
      } else {
        res(results);
      }
    });
  });
}

module.exports.query = query;

module.exports.getLastId = async function getLastId() {
  const lastId = await query("SELECT LAST_INSERT_ID() as id");
  return lastId[0].id;
};
