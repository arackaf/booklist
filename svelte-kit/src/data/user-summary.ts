import { SQL, and, asc, desc, eq, sql } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";
import { books, booksSubjects, booksTags, subjects, tags } from "./drizzle-schema";
import { db } from "./dbUtils";

type SubjectOrTagEntry = {
  books: number;
  ids: number[];
} | null;

export type UserSummary = {
  allBooksCount: number;
  minUsedSubject: SubjectOrTagEntry;
  maxUsedSubject: SubjectOrTagEntry;
  minUsedTag: SubjectOrTagEntry;
  maxUsedTag: SubjectOrTagEntry;
};

export const userSummary = async (userId: string): Promise<UserSummary | null> => {
  try {
    const tagsCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksTags, eq(books.id, booksTags.book))
        .groupBy(booksTags.tag);

    const tagsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql.raw(`'${value} Tags'`) as SQL<string>, count: sql<number>`COUNT(*)`, id: booksTags.tag })
        .from(books)
        .innerJoin(booksTags, and(eq(books.id, booksTags.book), eq(books.userId, userId)))
        .groupBy(booksTags.tag)
        .having(
          eq(
            sql`COUNT(*)`,
            tagsCounts()
              .orderBy(value === "MAX" ? desc(sql`COUNT(*)`) : asc(sql`COUNT(*)`))
              .limit(1)
          )
        );

    const subjectCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksSubjects, eq(books.id, booksSubjects.book))
        .groupBy(booksSubjects.subject);

    const subjectsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql.raw(`'${value} Subjects'`) as SQL<string>, count: sql<number>`COUNT(*)`, id: booksSubjects.subject })
        .from(books)
        .innerJoin(booksSubjects, and(eq(books.id, booksSubjects.book), eq(books.userId, userId)))
        .groupBy(booksSubjects.subject)
        .having(
          eq(
            sql`COUNT(*)`,
            subjectCounts()
              .orderBy(value === "MAX" ? desc(sql`COUNT(*)`) : asc(sql`COUNT(*)`))
              .limit(1)
          )
        );

    const data = await union(
      db
        .select({ label: sql<string>`'All books'`, count: sql<number>`COUNT(*)`, id: sql<number>`0` })
        .from(books)
        .where(eq(books.userId, userId)),
      subjectsQuery("MIN"),
      subjectsQuery("MAX"),
      tagsQuery("MIN"),
      tagsQuery("MAX")
    );

    type DataItem = (typeof data)[0];

    const projectEntries = (entries: DataItem[]): SubjectOrTagEntry => {
      if (!entries.length) {
        return null;
      }

      return {
        books: entries[0].count,
        ids: entries.map(entry => entry.id)
      };
    };

    await new Promise(res => setTimeout(res, 3000));

    return {
      allBooksCount: data.find(entry => entry.label === "All books")!.count,
      minUsedTag: projectEntries(data.filter(entry => entry.label === "MIN Tags")),
      maxUsedTag: projectEntries(data.filter(entry => entry.label === "MIN Tags")),
      minUsedSubject: projectEntries(data.filter(entry => entry.label === "MIN Subjects")),
      maxUsedSubject: projectEntries(data.filter(entry => entry.label === "MIN Subjects"))
    };
  } catch (err) {
    console.log("Error reading user summary", err);
    return null;
  }
};
