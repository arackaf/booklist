require("dotenv").config();

import pg from "pg";
import { Client } from "@planetscale/database";

const { Client: PgClient } = pg;

function migrateTable() {}

async function migrate() {
  const pgClient = new PgClient({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    database: "my-library"
  });
  await pgClient.connect();

  const mySqlConnectionFactory = new Client({
    url: process.env.MYSQL_CONNECTION_STRING
  });
  const mySqlConn = mySqlConnectionFactory.connection();

  await pgClient.query(`TRUNCATE TABLE books`);

  async function migrateTable(table: string, columns: string[], config = ({} = {} as any)) {
    const { json = [], boolean = [] } = config;
    const result = await mySqlConn.execute(`SELECT * FROM ${table} ORDER BY id ASC LIMIT 1`);

    const getValue = (obj: any, col: string) => {
      if (json.includes(col)) {
        return JSON.stringify(obj[col]) ?? '""';
      }
      if (boolean.includes(col)) {
        return obj[col] === 1 ? true : false;
      }
      return obj[col];
    };

    async function flush(objects: any[]) {
      let placeholderVal = 1;
      const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${objects
        .map(o => `(${columns.map(c => `$${placeholderVal++}`).join(", ")})`)
        .join(", ")}`;
      const variables = objects.flatMap(o => columns.map(c => getValue(o, c)));

      console.log({
        query,
        variables
      });

      await pgClient.query(query, variables);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    let i = 1;
    let buffer: any[] = [];
    for (const row of result.rows) {
      buffer.push(row);
      if (i % 10 === 0) {
        await flush(buffer);
        buffer = [];
      }
      i++;
    }
    if (buffer.length) {
      await flush(buffer);
    }
  }

  try {
    await migrateTable(
      "books",
      [
        "id",
        "userId",
        "dateAdded",
        "title",
        "authors",
        "isbn",
        "pages",
        "isRead",
        "similarBooks",
        "similarBooksLastSync",
        "similarBooksLastSyncSuccess",
        "similarBooksLastSyncFailureReason",
        "mobileImage",
        "mobileImagePreview",
        "smallImage",
        "smallImagePreview",
        "mediumImage",
        "mediumImagePreview",
        "publicationDate",
        "publisher",
        "editorialReviews"
      ],
      {
        json: ["authors", "similarBooks", "mobileImagePreview", "smallImagePreview", "mediumImagePreview", "editorialReviews"],
        boolean: ["isRead", "similarBooksLastSyncSuccess"]
      }
    );
  } finally {
    pgClient.end();
  }
}

migrate();
