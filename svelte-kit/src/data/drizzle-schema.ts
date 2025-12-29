import { integer, serial, timestamp, boolean, json, pgTable, varchar, numeric, date, text } from "drizzle-orm/pg-core";
import type { EditorialReview, PreviewPacket } from "./types";

export * from "./auth-schema";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  dateAdded: timestamp("date_added").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  isbn: varchar("isbn", { length: 25 }),
  pages: integer("pages"),
  isRead: boolean("is_read").notNull(),

  similarBooks: json("similar_books").$type<string[] | null>(),
  mobileImage: varchar("mobile_image", { length: 250 }),
  mobileImagePreview: json("mobile_image_preview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("small_image", { length: 250 }),
  smallImagePreview: json("small_image_preview").$type<string | PreviewPacket | null>(),
  mediumImage: varchar("medium_image", { length: 250 }),
  mediumImagePreview: json("medium_image_preview").$type<string | PreviewPacket | null>(),
  publicationDate: varchar("publication_date", { length: 30 }),
  publisher: varchar("publisher", { length: 100 }),
  editorialReviews: json("editorial_reviews").$type<EditorialReview[]>(),
  averageReview: numeric("average_review", { precision: 2, scale: 1 }),
  numberReviews: integer("number_reviews"),
  amazonSyncEligible: boolean("amazon_sync_eligible"),
  lastAmazonSync: date("last_amazon_sync"),
  lastAmazonSyncSuccess: boolean("last_amazon_sync_success"),
  lastAmazonSyncError: text("last_amazon_sync_error")
});

export const similarBooks = pgTable("similar_books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors").$type<string[]>(),
  authorsLastManualSync: timestamp("authors_last_manual_sync"),
  isbn: varchar("isbn", { length: 25 }).notNull(),

  mobileImage: varchar("mobile_image", { length: 250 }),
  mobileImagePreview: json("mobile_image_preview").$type<string | PreviewPacket | null>(),
  smallImage: varchar("small_image", { length: 250 }),
  smallImagePreview: json("small_image_preview").$type<string | PreviewPacket | null>(),
  unprocessedImage: text("unprocessed_image")
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  textColor: varchar("text_color", { length: 255 }),
  backgroundColor: varchar("background_color", { length: 255 })
});

export const booksTags = pgTable("books_tags", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  tag: integer("tag").notNull()
});

export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  path: varchar("path", { length: 255 }),
  textColor: varchar("text_color", { length: 255 }),
  backgroundColor: varchar("background_color", { length: 255 })
});

export const booksSubjects = pgTable("books_subjects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  book: integer("book").notNull(),
  subject: integer("subject").notNull()
});

export const userInfoCache = pgTable("user_info_cache", {
  userId: varchar("user_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 50 }),
  provider: varchar("provider", { length: 50 }),
  email: varchar("email", { length: 50 }),
  avatar: varchar("avatar", { length: 50 }),
  aliasUserId: varchar("alias_user_id", { length: 50 }),
  lastSync: integer("last_sync").notNull()
});

type BookInfo = {
  title: string;
  authors: string[];
  smallImage: string;
  smallImagePreview: PreviewPacket;
};

export const bookScans = pgTable("book_scans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  isbn: varchar("isbn", { length: 50 }).notNull(),
  dateAdded: timestamp("date_added").notNull().defaultNow(),
  status: varchar("status", { length: 50 }),
  bookInfo: json("book_info").$type<BookInfo | null>()
});
