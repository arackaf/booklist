import mysql from "mysql";
import { getSecrets } from "../util/getSecrets";

export async function getMySqlConnection() {
  const secrets = await getSecrets();

  const stage = process.env.stage || "live";
  const { host, user, password } = splitMysqlConnectionString(secrets[`mysql-connection`]);

  const mySqlConnection = mysql.createConnection({
    host,
    user,
    password,
    ssl: {
      rejectUnauthorized: false
    }
  });
  mySqlConnection.connect();

  return mySqlConnection;
}

export async function getBook(id: number) {
  const mySqlConnection = await getMySqlConnection();

  try {
    const books =
      ((await query(
        mySqlConnection,
        `    
          SELECT id, title, isbn
          FROM books
          WHERE id = ?`,
        [id]
      )) as any[]) || [];

    return books[0];
  } finally {
    mySqlConnection?.end();
  }
}

export async function getNextBookToSync() {
  const mySqlConnection = await getMySqlConnection();

  try {
    const books =
      ((await query(
        mySqlConnection,
        `    
          SELECT id, title, isbn
          FROM books
          WHERE (similarBooksLastSync IS NULL OR DATEDIFF(NOW(), similarBooksLastSync) > 60) AND (CHAR_LENGTH(isbn) = 10 OR CHAR_LENGTH(isbn) = 13)
          ORDER BY id
          LIMIT 1`
      )) as any[]) || [];

    return books[0];
  } finally {
    mySqlConnection?.end();
  }
}

function splitMysqlConnectionString(connString) {
  connString = connString.replace("mysql://", "");
  connString = connString.replace(/\/.*$/, "");

  const [userPwd, host] = connString.split("@");
  const [user, password] = userPwd.split(":");

  return { host, user, password };
}

export function query<T>(mySqlConnection, ...args): Promise<T[]> {
  return new Promise((res, rej) => {
    mySqlConnection.query(...args, (err, results) => {
      if (err) {
        rej(err);
      } else {
        res(results);
      }
    });
  });
}
