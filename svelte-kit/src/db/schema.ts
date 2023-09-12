import { int, datetime, tinyint, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const books = mysqlTable("books", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 50 }).notNull(),
  dateAdded: datetime("dateAdded").notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  authors: json("authors"),
  isbn: varchar("isbn", { length: 25 }),
  pages: int("pages"),
  isRead: tinyint("isRead").notNull()
});
