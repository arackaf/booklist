const { MongoClient, ObjectID } = require("mongodb");

const getConnection = () => {
  let connString = process.env.Mongo_Conn;
  let dbName = process.env.DB_Name;

  return MongoClient.connect(connString, { useNewUrlParser: true }).then(client => client.db(dbName));
};

module.exports = async function checkLogin(userId, loginToken) {
  if (process.env.STAGE == "dev"){
    return true;
  }

  try {
    const db = await getConnection();
    const loggedInUser = await db.collection("users").findOne({ _id: ObjectID(userId), loginToken });

    return !!loggedInUser;
  } catch (er) {
    return false;
  }
}