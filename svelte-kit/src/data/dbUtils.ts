import { Client, type Transaction, type ExecutedQuery, type Connection } from "@planetscale/database";

import { MYSQL_CONNECTION_STRING } from "$env/static/private";

export const mySqlConnectionFactory = new Client({
  url: MYSQL_CONNECTION_STRING
});

export type TransactionItem = (tx: Transaction, previous: null | ExecutedQuery) => Promise<ExecutedQuery | ExecutedQuery[]>;
export const runTransaction = async (...ops: TransactionItem[]): ReturnType<Connection["transaction"]> => {
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

export type SubjectEditFields = {
  name: string;
  path: string | null;
  parentId: number | null;
  originalParentId: string | null;
  textColor: string;
  backgroundColor: string;
};

export const getInsertLists = (lists: any[]) => Array.from({ length: lists.length }, () => "(?)").join(", ");
