import { Client, type Transaction, type ExecutedQuery, type Connection } from "@planetscale/database";

import { MONGO_URL, MONGO_URL_API_KEY, MYSQL_CONNECTION_STRING } from "$env/static/private";

import type { Book, Subject, Tag } from "./types";

export const mySqlConnectionFactory = new Client({
  url: MYSQL_CONNECTION_STRING
});

export type TransactionItem = (tx: Transaction, previous: null | ExecutedQuery) => Promise<ExecutedQuery | ExecutedQuery[]>;
export const runTransaction = async (ops: TransactionItem[]): ReturnType<Connection["transaction"]> => {
  const conn = mySqlConnectionFactory.connection();

  return conn.transaction(async tx => {
    const transactionItems: ExecutedQuery[] = [];
    for (const op of ops) {
      const result = await op(tx, transactionItems.length ? (transactionItems.at(-1) as ExecutedQuery) : null);

      if (Array.isArray(result)) {
        transactionItems.push(...result);
      } else {
        transactionItems.push(result);
      }
    }

    return transactionItems;
  });
};

type MongoMultiQueryResponse<T> = {
  documents: T[];
};

type MongoSingleQueryResponse<T> = {
  document: T;
};

export type SubjectEditFields = {
  name: string;
  path: string | null;
  parentId: string | null;
  originalParentId: string | null;
  textColor: string;
  backgroundColor: string;
};

export const updateMultipleBooks = runMultiUpdate.bind(null, "books");

export const deleteBookById = deleteById.bind(null, "books");

export const queryBooks = <TProjection = Book>(body: object) => runQuery<TProjection>("books", body);
export const querySubjects = (body: object) => runQuery<Subject>("subjects", body);
export const queryTags = (body: object) => runQuery<Tag>("tags", body);

export const getSubject = (_id: string, userId: string) => findById<Subject>("subjects", _id, userId);

const runQuery = <T>(collection: string, body: object) => {
  return runRequest("aggregate", collection, body).then((res: MongoMultiQueryResponse<T>) => res.documents);
};

const findById = <T>(collection: string, _id: string, userId: string) => {
  userId = userId || "";
  return runRequest("findOne", collection, { filter: { _id: { $oid: _id }, userId } }).then((res: MongoSingleQueryResponse<T>) => res.document);
};

export const getInsertLists = (lists: any[]) => Array.from({ length: lists.length }, () => "(?)").join(", ");

export function insertObject<T>(collection: string, userId: string, document: Omit<T, "id">) {
  // @ts-ignore
  delete document._id;

  return runRequest("insertOne", collection, {
    document: { ...document, userId }
  }).catch(err => {
    console.log({ err });
  });
}

export function updateById(collection: string, userId: string, id: number, update: object) {
  userId = userId || "";

  return runRequest("updateOne", collection, {
    filter: { _id: { $oid: id }, userId },
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

export function deleteById(collection: string, userId: string, _id: string) {
  userId = userId || "";

  return runRequest("deleteOne", collection, {
    filter: { userId, _id: { $oid: _id } }
  }).catch(err => {
    console.log({ err });
  });
}

export function runRequest(action: string, collection: string, body: object) {
  return fetch(`${MONGO_URL}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": MONGO_URL_API_KEY
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
