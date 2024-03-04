import type { EditorialReview, PreviewPacket } from "$data/types";
import { int, datetime, tinyint, json, mysqlTable, varchar, longtext } from "drizzle-orm/mysql-core";

export const books = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  dateAdded: datetime("dateAdded").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  isbn: varchar("isbn", { length: 25 }),
  pages: int("pages"),
  isRead: tinyint("isRead").notNull(),

  similarBooks: json("similarBooks").$type<string[] | null>(),
  similarBooksLastSync: datetime("similarBooksLastSync"),
  similarBooksLastSyncSuccess: tinyint("similarBooksLastSyncSuccess"),
  similarBooksLastSyncFailureReason: longtext("similarBooksLastSyncFailureReason"),
  mobileImage: varchar("mobileImage", { length: 250 }),
  mobileImagePreview: json("mobileImagePreview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("smallImage", { length: 250 }),
  smallImagePreview: json("smallImagePreview").$type<string | PreviewPacket | null>(),
  mediumImage: varchar("mediumImage", { length: 250 }),
  mediumImagePreview: json("mediumImagePreview").$type<string | PreviewPacket | null>(),
  publicationDate: varchar("publicationDate", { length: 30 }),
  publisher: varchar("publisher", { length: 100 }),
  editorialReviews: json("editorialReviews").$type<EditorialReview[]>()
});

export const similarBooks = mysqlTable("similar_books", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  authorsLastManualSync: datetime("authorsLastManualSync"),
  isbn: varchar("isbn", { length: 25 }).notNull(),

  mobileImage: varchar("mobileImage", { length: 250 }),
  mobileImagePreview: json("mobileImagePreview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("smallImage", { length: 250 }),
  smallImagePreview: json("smallImagePreview").$type<string | PreviewPacket | null>()
});

export const tags = mysqlTable("tags", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  textColor: varchar("textColor", { length: 255 }),
  backgroundColor: varchar("backgroundColor", { length: 255 })
});

export const booksTags = mysqlTable("books_tags", {
  id: int("id").notNull().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  book: int("book").notNull(),
  tag: int("tag").notNull()
});

export const subjects = mysqlTable("subjects", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }),
  textColor: varchar("textColor", { length: 255 }),
  backgroundColor: varchar("backgroundColor", { length: 255 })
});

export const booksSubjects = mysqlTable("books_subjects", {
  id: int("id").notNull().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  book: int("book").notNull(),
  subject: int("subject").notNull()
});
