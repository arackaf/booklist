import connectToDb from "./connect";

let db;
let dbPromise = connectToDb()
  .then(database => (db = database))
  .then(() => db)
  .catch(err => console.log("Error connecting " + err));

class DAO {
  static init() {
    return dbPromise;
  }
  open() {
    return db;
  }
  confirmSingleResult(res) {
    let numInserted = +res.result.n;
    if (!numInserted) {
      throw "Object not inserted";
    }
    if (numInserted > 1) {
      throw "Expected 1 object to be inserted.  Actual " + numInserted;
    }
  }
  dispose(db) {}
  static shutdown() {
    try {
      db.close();
    } catch (err) {}
    db = null;
  }
}

export default DAO;
