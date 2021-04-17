const { MongoClient, ObjectID } = require("mongodb");
const getConnection = require("./getDbConnection");

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
