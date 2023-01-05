import { env } from "$env/dynamic/private";
import type { Book } from "./types";

export const runSingleUpdate = runRequest.bind(null, "updateOne");
export const runMultiUpdate = runRequest.bind(null, "updateMany");
export const runAggregate = runRequest.bind(null, "aggregate");

type MongoQueryResponse<T> = {
  documents: T[];
};

export const queryBooks = (body: object) => runQuery<Book>("books", body);

const runQuery = <T>(table: string, body: object) => {
  return runAggregate(table, body).then((res: MongoQueryResponse<T>) => res.documents);
};

export function runRequest(action: string, collection: string, body: object) {
  return fetch(`${env.MONGO_URL}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection,
      database: "my-library",
      dataSource: "Cluster0",
      ...body
    })
  })
    .then(res => res.json())
    .catch(err => {
      // TODO
      console.log({ err });
    });
}
