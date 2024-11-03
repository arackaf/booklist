const { MongoClient } = require("mongodb");
const { DEV, PROD, DB_NAME } = require("./connection-strings");

module.exports.connect = async () => {
  const client = await MongoClient.connect(DEV);
  const db = await client.db(DB_NAME);

  return [client, db];
};
