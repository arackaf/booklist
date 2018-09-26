import { MongoClient } from "mongodb";

export default () => {
  let connString = process.env.IS_PUBLIC ? process.env.MONGO_PUBLIC : process.env.MONGO_CONNECTION;
  let dbName = process.env.IS_PUBLIC ? process.env.DB_NAME_PUBLIC : process.env.DB_NAME;
  return MongoClient.connect(
    connString,
    { useNewUrlParser: true }
  ).then(client => client.db(dbName));
};

export const connectPublic = () => {
  return MongoClient.connect(
    process.env.MONGO_CONNECTION || process.env.MONGO_PUBLIC,
    { useNewUrlParser: true }
  ).then(client => client.db(process.env.DB_NAME_PUBLIC));
};
