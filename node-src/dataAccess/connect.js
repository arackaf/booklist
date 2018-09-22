import { MongoClient } from "mongodb";

export default () => {
  return MongoClient.connect(
    process.env.MONGO_CONNECTION || process.env.MONGOHQ_URL,
    { useNewUrlParser: true }
  ).then(client => client.db(process.env.DB_NAME));
};
