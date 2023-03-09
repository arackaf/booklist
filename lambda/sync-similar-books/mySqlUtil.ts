import mysql from "mysql";
import { getSecrets } from "../util/getSecrets";

export async function getMySqlConnection() {
  const secrets = await getSecrets();

  const { host, user, password } = splitMysqlConnectionString(secrets["mysql-connection-live"]);

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
