import { env } from "$env/dynamic/private";
import type { Book, Subject, Tag } from "./types";

export const runSingleUpdate = runRequest.bind(null, "updateOne");
export const runMultiUpdate = runRequest.bind(null, "updateMany");
const runAggregate = runRequest.bind(null, "aggregate");

export const updateSingleBook = (filter: object, update: object) => {
  return runSingleUpdate("books", {
    filter,
    update
  })
    .then(res => res.json())
    .catch(err => {
      console.log({ err });
    });
};

export const updateMultipleBooks = (filter: object, update: object) => {
  return runMultiUpdate("books", {
    filter,
    update
  })
    .then(res => res.json())
    .catch(err => {
      console.log({ err });
    });
};

type MongoQueryResponse<T> = {
  documents: T[];
};

export const queryBooks = <TProjection = Book>(body: object) => runQuery<TProjection>("books", body);
export const querySubjects = (body: object) => runQuery<Subject>("subjects", body);
export const queryTags = (body: object) => runQuery<Tag>("tags", body);

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
