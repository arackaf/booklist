import { pgTable, index, serial, varchar, timestamp, json, integer, boolean, text, uniqueIndex, bigint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const books = pgTable(
  "books",
  {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    dateAdded: timestamp("date_added", { mode: "string" }).notNull(),
    title: varchar({ length: 250 }).notNull(),
    authors: json(),
    isbn: varchar({ length: 25 }),
    pages: integer(),
    isRead: boolean("is_read").notNull(),
    similarBooks: json("similar_books"),
    similarBooksLastSync: timestamp("similar_books_last_sync", { mode: "string" }).default("1990-01-01 00:00:00").notNull(),
    similarBooksLastSyncSuccess: boolean("similar_books_last_sync_success"),
    similarBooksLastSyncFailureReason: text("similar_books_last_sync_failure_reason"),
    syncEligible: boolean("sync_eligible").generatedAlwaysAs(sql`
CASE
    WHEN ((char_length((isbn)::text) = 10) OR (char_length((isbn)::text) = 13)) THEN true
    ELSE false
END`),
    mobileImage: varchar("mobile_image", { length: 250 }),
    mobileImagePreview: json("mobile_image_preview"),
    smallImage: varchar("small_image", { length: 250 }),
    smallImagePreview: json("small_image_preview"),
    mediumImage: varchar("medium_image", { length: 250 }),
    mediumImagePreview: json("medium_image_preview"),
    publicationDate: varchar("publication_date", { length: 30 }),
    publisher: varchar({ length: 100 }),
    editorialReviews: json("editorial_reviews")
  },
  table => [
    index("idx_dateadded_user").using("btree", table.dateAdded.desc().nullsFirst().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
    index("idx_isbn").using("btree", table.isbn.asc().nullsLast().op("text_ops")),
    index("idx_synceligible_similarbookslastsync_id").using(
      "btree",
      table.syncEligible.desc().nullsFirst().op("bool_ops"),
      table.similarBooksLastSync.asc().nullsLast().op("int4_ops"),
      table.id.asc().nullsLast().op("int4_ops")
    ),
    index("idx_user_dateadded").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops"),
      table.dateAdded.desc().nullsFirst().op("int4_ops"),
      table.id.desc().nullsFirst().op("text_ops")
    ),
    index("idx_user_pages").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.pages.asc().nullsLast().op("text_ops")),
    index("idx_user_title").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.title.asc().nullsLast().op("text_ops"))
  ]
);

export const subjects = pgTable(
  "subjects",
  {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    path: varchar({ length: 255 }),
    textColor: varchar("text_color", { length: 255 }),
    backgroundColor: varchar("background_color", { length: 255 })
  },
  table => [
    index("idx_subjects_user_name").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops"))
  ]
);

export const booksSubjects = pgTable(
  "books_subjects",
  {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }),
    book: integer().notNull(),
    subject: integer().notNull()
  },
  table => [
    uniqueIndex("idx_bookssubjects_book_subject").using(
      "btree",
      table.book.asc().nullsLast().op("int4_ops"),
      table.subject.asc().nullsLast().op("int4_ops")
    ),
    index("idx_bookssubjects_subject").using("btree", table.subject.asc().nullsLast().op("int4_ops")),
    index("idx_bookssubjects_userid_subject").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops"),
      table.subject.asc().nullsLast().op("int4_ops")
    ),
    index("idx_bookstags_book").using("btree", table.book.asc().nullsLast().op("int4_ops"))
  ]
);

export const booksTags = pgTable(
  "books_tags",
  {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }),
    book: integer().notNull(),
    tag: integer().notNull()
  },
  table => [
    index("idx_book").using("btree", table.book.asc().nullsLast().op("int4_ops")),
    uniqueIndex("idx_bookstags_book_tag").using("btree", table.book.asc().nullsLast().op("int4_ops"), table.tag.asc().nullsLast().op("int4_ops")),
    index("idx_tag").using("btree", table.tag.asc().nullsLast().op("int4_ops")),
    index("idx_userid_tag").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.tag.asc().nullsLast().op("int4_ops"))
  ]
);

export const similarBooks = pgTable(
  "similar_books",
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 250 }).notNull(),
    authors: json(),
    authorsLastManualSync: timestamp("authors_last_manual_sync", { mode: "string" }),
    isbn: varchar({ length: 25 }).notNull(),
    mobileImage: varchar("mobile_image", { length: 250 }),
    mobileImagePreview: json("mobile_image_preview"),
    smallImage: varchar("small_image", { length: 250 }),
    smallImagePreview: json("small_image_preview")
  },
  table => [
    index("idx_similarbooks_authors_last_sync").using("btree", table.authorsLastManualSync.asc().nullsLast().op("timestamp_ops")),
    index("idx_similarbooks_isbn").using("btree", table.isbn.asc().nullsLast().op("text_ops"))
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: serial().primaryKey().notNull(),
    userId: varchar("user_id", { length: 50 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    textColor: varchar("text_color", { length: 255 }),
    backgroundColor: varchar("background_color", { length: 255 })
  },
  table => [index("idx_tags_user_name").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("text_ops"))]
);

export const userInfoCache = pgTable("user_info_cache", {
  userId: varchar("user_id", { length: 50 }).primaryKey().notNull(),
  name: varchar({ length: 250 }),
  provider: varchar({ length: 50 }),
  email: varchar({ length: 250 }),
  avatar: varchar({ length: 250 }),
  aliasUserId: varchar("alias_user_id", { length: 50 }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  lastSync: bigint("last_sync", { mode: "number" }).notNull()
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});
