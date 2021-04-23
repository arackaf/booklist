import { MongoClient, ObjectID } from "mongodb";
import getSecrets from "./getSecrets";

export default async () => {
  const secrets = await getSecrets();
  const connString = secrets["mongo-connection-string"];
  const dbName = secrets["db-name"];

  return MongoClient.connect(connString, { useNewUrlParser: true }).then(client => client.db(dbName));
};
