require("dotenv").config();

import pg from "pg";
import { Client } from "@planetscale/database";

const { Client: PgClient } = pg;

/*
 WHERE EXISTS (
  SELECT 1
  FROM json_array_elements_text(authors) AS author
  WHERE author LIKE '%Bob%'
)
*/

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

  async function migrateTable(table: string, columns: string[], config = {} as any) {
    await pgClient.query(`TRUNCATE TABLE ${table}`);

    const { json = [], boolean = [], key = "id" } = config;
    const result = await mySqlConn.execute(`SELECT * FROM ${table} ORDER BY ${key} ASC`);

    const getValue = (obj: any, col: string) => {
      if (json.includes(col)) {
        return JSON.stringify(obj[col]) ?? '""';
      }
      if (boolean.includes(col)) {
        return obj[col] === 1 ? true : false;
      }
      return obj[col];
    };

    async function flush(objects: any[], keyField: string) {
      let placeholderVal = 1;
      const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${objects
        .map(o => `(${columns.map(c => `$${placeholderVal++}`).join(", ")})`)
        .join(", ")}`;
      const variables = objects.flatMap(o => columns.map(c => getValue(o, c)));

      await pgClient.query(query, variables);
      console.log(`Inserted ${objects.length} rows into ${table}: ${objects.map(o => o[keyField]).join(", ")}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    let i = 1;
    let buffer: any[] = [];
    for (const row of result.rows) {
      if (i > 50) {
        return;
      }

      buffer.push(row);
      if (i % 10 === 0) {
        await flush(buffer, key);
        buffer = [];
      }
      i++;
    }
    if (buffer.length) {
      await flush(buffer, key);
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

    await migrateTable("books_subjects", ["id", "userId", "book", "subject"], {});
    await migrateTable("books_tags", ["id", "userId", "book", "tag"], {});
    await migrateTable(
      "similar_books",
      ["id", "title", "authors", "authorsLastManualSync", "isbn", "mobileImage", "mobileImagePreview", "smallImage", "smallImagePreview"],
      {
        json: ["authors", "mobileImagePreview", "smallImagePreview"]
      }
    );

    await migrateTable("subjects", ["id", "userId", "name", "path", "textColor", "backgroundColor"], {});
    await migrateTable("tags", ["id", "userId", "name", "textColor", "backgroundColor"], {});

    await migrateTable("user_info_cache", ["userId", "name", "provider", "email", "avatar", "aliasUserId", "lastSync"], {
      key: "userId"
    });
  } finally {
    pgClient.end();
  }
}

migrate();
