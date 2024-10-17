import type { EditorialReview, PreviewPacket } from "$data/types";

import { integer, serial, timestamp, boolean, json, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 50 }).notNull(),
  dateAdded: timestamp("dateadded").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  isbn: varchar("isbn", { length: 25 }),
  pages: integer("pages"),
  isRead: boolean("isread").notNull(),

  similarBooks: json("similarbooks").$type<string[] | null>(),
  similarBooksLastSync: timestamp("similarbookslastsync"),
  similarBooksLastSyncSuccess: boolean("similarbookslastsyncsuccess"),
  similarBooksLastSyncFailureReason: text("similarbookslastsyncfailurereason"),
  mobileImage: varchar("mobileimage", { length: 250 }),
  mobileImagePreview: json("mobileimagepreview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("smallimage", { length: 250 }),
  smallImagePreview: json("smallimagepreview").$type<string | PreviewPacket | null>(),
  mediumImage: varchar("mediumimage", { length: 250 }),
  mediumImagePreview: json("mediumimagepreview").$type<string | PreviewPacket | null>(),
  publicationDate: varchar("publicationdate", { length: 30 }),
  publisher: varchar("publisher", { length: 100 }),
  editorialReviews: json("editorialreviews").$type<EditorialReview[]>()
});

export const similarBooks = pgTable("similar_books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  authorsLastManualSync: timestamp("authorslastmanualsync"),
  isbn: varchar("isbn", { length: 25 }).notNull(),

  mobileImage: varchar("mobileimage", { length: 250 }),
  mobileImagePreview: json("mobileimagepreview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("smallimage", { length: 250 }),
  smallImagePreview: json("smallimagepreview").$type<string | PreviewPacket | null>()
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  textColor: varchar("textcolor", { length: 255 }),
  backgroundColor: varchar("backgroundcolor", { length: 255 })
});

export const booksTags = pgTable("books_tags", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  tag: integer("tag").notNull()
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }),
  textColor: varchar("textcolor", { length: 255 }),
  backgroundColor: varchar("backgroundcolor", { length: 255 })
});

export const booksSubjects = pgTable("books_subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("userid", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  subject: integer("subject").notNull()
});

export const userInfoCache = pgTable("user_info_cache", {
  userId: varchar("userid", { length: 50 }).notNull(),
  name: varchar("name", { length: 50 }),
  provider: varchar("provider", { length: 50 }),
  email: varchar("email", { length: 50 }),
  avatar: varchar("avatar", { length: 50 }),
  aliasUserId: varchar("aliasuserid", { length: 50 }),
  lastSync: integer("lastsync").notNull()
});
