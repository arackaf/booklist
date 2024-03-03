import { SQL, and, asc, desc, eq, notExists, sql } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";
import { books, booksSubjects, booksTags, subjects, tags } from "./drizzle-schema";
import { db } from "./dbUtils";

export type SubjectOrTagSummaryEntry = {
  books: number;
  ids: number[];
};

export type UserSummary = {
  allBooksCount: number;
  minUsedSubjects: SubjectOrTagSummaryEntry | null;
  maxUsedSubjects: SubjectOrTagSummaryEntry | null;
  unusedSubjects: SubjectOrTagSummaryEntry | null;
  minUsedTags: SubjectOrTagSummaryEntry | null;
  maxUsedTags: SubjectOrTagSummaryEntry | null;
  unusedTags: SubjectOrTagSummaryEntry | null;
};

export const userSummary = async (userId: string): Promise<UserSummary | null> => {
  try {
    const tagsCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksTags, eq(books.id, booksTags.book))
        .where(eq(books.userId, userId))
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
        .where(eq(books.userId, userId))
        .groupBy(booksSubjects.subject);

    const subjectCountRank = (value: "MAX" | "MIN") =>
      db
        .select({
          subject: sql`books_subjects.subject`.as("subject"),
          count: sql<number>`COUNT(*)`.as("count"),
          rank: sql<number>`RANK() OVER (ORDER BY COUNT(*) ${sql.raw(value === "MIN" ? "ASC" : "DESC")})`.as("rank")
        })
        .from(books)
        .innerJoin(booksSubjects, and(eq(books.id, booksSubjects.book), eq(books.userId, userId)))
        .groupBy(sql`books_subjects.subject`)
        .as("t");

    const subjectsQuery = (value: "MAX" | "MIN") => {
      const subQuery = subjectCountRank(value);
      return db
        .select({ label: sql.raw(`'${value} Subjects'`) as SQL<string>, count: subQuery.count, id: subQuery.subject })
        .from(subQuery)
        .where(eq(subQuery.rank, 1));
    };

    const subjectsQueryOld = (value: "MAX" | "MIN") =>
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

    const unusedSubjectsQuery = () =>
      db
        .select({ label: sql.raw(`'Unused Subjects'`) as SQL<string>, count: sql<number>`0`, id: subjects.id })
        .from(subjects)
        .where(
          and(
            eq(subjects.userId, userId),
            notExists(
              db
                .select({ _: sql`0` })
                .from(booksSubjects)
                .where(and(eq(booksSubjects.subject, subjects.id), eq(subjects.userId, userId)))
            )
          )
        );

    const unusedTagsQuery = () =>
      db
        .select({ label: sql.raw(`'Unused Tags'`) as SQL<string>, count: sql<number>`0`, id: tags.id })
        .from(tags)
        .where(
          and(
            eq(tags.userId, userId),
            notExists(
              db
                .select({ _: sql`0` })
                .from(booksTags)
                .where(eq(booksTags.tag, tags.id))
            )
          )
        );

    console.log("\n\n");
    //console.log(subjectsQuery("MIN").toSQL());
    console.log("\n\n");

    const data = await union(
      db
        .select({ label: sql<string>`'All books'`, count: sql<number>`COUNT(*)`, id: sql<number>`0` })
        .from(books)
        .where(eq(books.userId, userId)),
      subjectsQuery("MIN"),
      subjectsQuery("MAX"),
      unusedSubjectsQuery(),
      tagsQuery("MIN"),
      tagsQuery("MAX"),
      unusedTagsQuery()
    );

    type DataItem = (typeof data)[0];

    const projectEntries = (entries: DataItem[]): SubjectOrTagSummaryEntry | null => {
      if (!entries.length) {
        return null;
      }

      return {
        books: entries[0].count,
        ids: entries.map(entry => entry.id)
      };
    };
    const projectUnusedEntries = (entries: DataItem[]): SubjectOrTagSummaryEntry | null => {
      if (!entries.length) {
        return null;
      }

      return {
        books: 0,
        ids: entries.map(entry => entry.id)
      };
    };

    await new Promise(res => setTimeout(res, 30));

    const result = {
      allBooksCount: data.find(entry => entry.label === "All books")!.count,
      minUsedTags: projectEntries(data.filter(entry => entry.label === "MIN Tags")),
      maxUsedTags: projectEntries(data.filter(entry => entry.label === "MAX Tags")),
      unusedSubjects: projectUnusedEntries(data.filter(entry => entry.label === "Unused Subjects")),
      minUsedSubjects: projectEntries(data.filter(entry => entry.label === "MIN Subjects")),
      maxUsedSubjects: projectEntries(data.filter(entry => entry.label === "MAX Subjects")),
      unusedTags: projectUnusedEntries(data.filter(entry => entry.label === "Unused Tags"))
    };

    if (result.minUsedTags?.ids) {
      const maxTags = new Set(result.maxUsedTags?.ids);
      result.minUsedTags.ids = result.minUsedTags.ids.filter(id => !maxTags.has(id));
      if (!result.minUsedTags.ids.length) {
        result.minUsedTags = null;
      }
    }
    if (result.minUsedSubjects?.ids) {
      const maxSubjects = new Set(result.maxUsedSubjects?.ids);
      result.minUsedSubjects.ids = result.minUsedSubjects.ids.filter(id => !maxSubjects.has(id));
      if (!result.minUsedSubjects.ids.length) {
        result.minUsedSubjects = null;
      }
    }

    return result;
  } catch (err) {
    console.log("Error reading user summary", err);
    return null;
  }
};
