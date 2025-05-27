import mysql from "mysql";
//import { getSecrets } from "../util/getSecrets";

const getSecrets = () => {
  return {} as any;
};

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

  const today = new Date();
  today.setMonth(today.getMonth() - 6);

  const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  try {
    const books =
      ((await query(
        mySqlConnection,
        `
        SELECT id, title, isbn
        FROM books
        USE INDEX (idx_syncEligible_similarBooksLastSync_id)
        WHERE syncEligible = 1 AND similarBooksLastSync < ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [dateStr]
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
