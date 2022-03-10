const { MongoClient } = require("mongodb");
const { DEV, DB_NAME } = require("./connection-strings");

module.exports.connect = async () => {
  return MongoClient.connect(DEV).then(client => client.db(DB_NAME));
};
