import type { EditorialReview, PreviewPacket } from "$data/types";

import { integer, serial, timestamp, boolean, json, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 50 }).notNull(),
  dateAdded: timestamp("dateAdded").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  isbn: varchar("isbn", { length: 25 }),
  pages: integer("pages"),
  isRead: boolean("isRead").notNull(),

  similarBooks: json("similarBooks").$type<string[] | null>(),
  similarBooksLastSync: timestamp("similarBooksLastSync"),
  similarBooksLastSyncSuccess: boolean("similarBooksLastSyncSuccess"),
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

export const similarBooks = pgTable("similar_books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  authorsLastManualSync: timestamp("authorsLastManualSync"),
  isbn: varchar("isbn", { length: 25 }).notNull(),

  mobileImage: varchar("mobileImage", { length: 250 }),
  mobileImagePreview: json("mobileImagePreview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("smallImage", { length: 250 }),
  smallImagePreview: json("smallImagePreview").$type<string | PreviewPacket | null>()
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  textColor: varchar("textColor", { length: 255 }),
  backgroundColor: varchar("backgroundColor", { length: 255 })
});

export const booksTags = pgTable("books_tags", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  tag: integer("tag").notNull()
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }),
  textColor: varchar("textColor", { length: 255 }),
  backgroundColor: varchar("backgroundColor", { length: 255 })
});

export const booksSubjects = pgTable("books_subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  subject: integer("subject").notNull()
});

export const userInfoCache = pgTable("user_info_cache", {
  userId: varchar("userId", { length: 50 }).notNull(),
  name: varchar("name", { length: 50 }),
  provider: varchar("provider", { length: 50 }),
  email: varchar("email", { length: 50 }),
  avatar: varchar("avatar", { length: 50 }),
  aliasUserId: varchar("aliasUserId", { length: 50 }),
  lastSync: integer("lastSync").notNull()
});
