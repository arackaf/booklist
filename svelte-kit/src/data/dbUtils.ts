import { env } from "$env/dynamic/private";
import type { Book, Subject, Tag } from "./types";

type MongoQueryResponse<T> = {
  documents: T[];
};

export const updateSingleBook = runSingleUpdate.bind(null, "books");
export const updateMultipleBooks = runMultiUpdate.bind(null, "books");
export const updateSingleSubject = runSingleUpdate.bind(null, "subjects");

export const deleteBookById = deleteById.bind(null, "books");

export const queryBooks = <TProjection = Book>(body: object) => runQuery<TProjection>("books", body);
export const querySubjects = (body: object) => runQuery<Subject>("subjects", body);
export const queryTags = (body: object) => runQuery<Tag>("tags", body);
export const queryLabelColors = <TProjection = Book>(body: object) => runQuery<TProjection>("labelColors", body);

const runQuery = <T>(table: string, body: object) => {
  return runAggregate(table, body).then((res: MongoQueryResponse<T>) => res.documents);
};

const runAggregate = runRequest.bind(null, "aggregate");

export function runSingleUpdate(collection: string, userId: string, filter: object, update: object) {
  userId = userId || "";

  return runRequest("updateOne", collection, {
    filter: { ...filter, userId },
    update
  }).catch(err => {
    console.log({ err });
  });
}

export function runMultiUpdate(collection: string, userId: string, filter: object, update: object) {
  userId = userId || "";

  return runRequest("updateMany", collection, {
    filter: { ...filter, userId },
    update
  }).catch(err => {
    console.log({ err });
  });
}

function deleteById(collection: string, userId: string, _id: string) {
  userId = userId || "";

  return runRequest("deleteOne", collection, {
    filter: { userId, _id: { $oid: _id } }
  }).catch(err => {
    console.log({ err });
  });
}

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
      dataSource: "ServerlessInstance0",
      ...body
    })
  })
    .then(res => res.json())
    .catch(err => {
      // TODO
      console.log({ err });
    });
}
