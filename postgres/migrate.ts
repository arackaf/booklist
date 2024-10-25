require("dotenv").config();

import pg from "pg";
import { Client } from "@planetscale/database";

function camelToSnake(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

const { Client: PgClient } = pg;

type TableMigrationConfig = {
  json?: string[];
  boolean?: string[];
  key?: string;
};

const pgClient = new PgClient({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  database: "my-library"
});

const mySqlConnectionFactory = new Client({
  url: process.env.MYSQL_CONNECTION_STRING
});

const getValue = (obj: any, col: string, config: TableMigrationConfig) => {
  if ((config.json ?? []).includes(col)) {
    return JSON.stringify(obj[col]) ?? '""';
  }
  if ((config.boolean ?? []).includes(col)) {
    return obj[col] === 1 ? true : false;
  }
  return obj[col];
};

async function flush(table: string, columns: string[], objects: any[], config: TableMigrationConfig) {
  let placeholderVal = 1;
  const query = `INSERT INTO ${table} (${columns.map(camelToSnake).join(", ")}) VALUES ${objects
    .map(o => `(${columns.map(c => `$${placeholderVal++}`).join(", ")})`)
    .join(", ")}`;
  const variables = objects.flatMap(o => columns.map(c => getValue(o, c, config)));

  await pgClient.query(query, variables);
  console.log(`Inserted ${objects.length} rows into ${table}: ${objects.map(o => o[config.key ?? "id"]).join(", ")}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function migrateTable(table: string, columns: string[], config: TableMigrationConfig = {}) {
  const mySqlConn = mySqlConnectionFactory.connection();

  await pgClient.query(`TRUNCATE TABLE ${table}`);

  const { key = "id" } = config;
  const result = await mySqlConn.execute(`SELECT * FROM ${table} ORDER BY ${key} ASC`);

  let i = 1;
  let buffer: any[] = [];
  for (const row of result.rows) {
    buffer.push(row);
    if (i % 10 === 0) {
      await flush(table, columns, buffer, config);
      buffer = [];
    }
    i++;
  }
  if (buffer.length) {
    await flush(table, columns, buffer, config);
  }
}

async function migrate() {
  await pgClient.connect();

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
