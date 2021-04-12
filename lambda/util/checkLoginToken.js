const { MongoClient, ObjectID } = require("mongodb");
const getSecrets = require("./getSecrets");

const getConnection = async () => {
  const secrets = await getSecrets();
  const connString = secrets["mongo-connection-string"];
  const dbName = secrets["db-name"];

  return MongoClient.connect(connString, { useNewUrlParser: true }).then(client => client.db(dbName));
};

const client = getConnection();

module.exports = async (userId, loginToken) => {
  const db = await client;
  if (process.env.STAGE == "dev") {
    return true;
  }

  try {
    const loggedInUser = await db.collection("users").findOne({ _id: ObjectID(userId), loginToken });

    return !!loggedInUser;
  } catch (er) {
    return false;
  }
};
