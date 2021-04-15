const { MongoClient, ObjectID } = require("mongodb");
const getSecrets = require("./getSecrets");

module.exports = async () => {
  const secrets = await getSecrets();
  const connString = secrets["mongo-connection-string"];
  const dbName = secrets["db-name"];

  return MongoClient.connect(connString, { useNewUrlParser: true }).then(client => client.db(dbName));
};
