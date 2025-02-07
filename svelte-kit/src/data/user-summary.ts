import { SQL, and, eq, notExists, or, sql } from "drizzle-orm";
import { union } from "drizzle-orm/pg-core";
import { books, booksSubjects, booksTags, subjects, tags } from "./drizzle/schema";
import { db, executeDrizzle } from "./dbUtils";

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
    const tagsCountRank = () =>
      db
        .select({
          tag: booksTags.tag,
          count: sql<number>`COUNT(*)`.as("count"),
          rank_min: sql<number>`RANK() OVER (ORDER BY COUNT(*) ASC)`.as("rank_min"),
          rank_max: sql<number>`RANK() OVER (ORDER BY COUNT(*) DESC)`.as("rank_max")
        })
        .from(booksTags)
        .where(eq(booksTags.userId, userId))
        .groupBy(booksTags.tag)
        .as("t");

    const tagsQuery = () => {
      const subQuery = tagsCountRank();

      return db
        .select({
          label: sql<string>`CASE WHEN t.rank_min = 1 THEN 'MIN Tags' ELSE 'MAX Tags' END`.as("label"),
          count: subQuery.count,
          id: subQuery.tag
        })
        .from(subQuery)
        .where(or(eq(subQuery.rank_min, 1), eq(subQuery.rank_max, 1)));
    };

    const subjectCountRank = () =>
      db
        .select({
          subject: booksSubjects.subject,
          count: sql<number>`COUNT(*)`.as("count"),
          rank_min: sql<number>`RANK() OVER (ORDER BY COUNT(*) ASC)`.as("rank_min"),
          rank_max: sql<number>`RANK() OVER (ORDER BY COUNT(*) DESC)`.as("rank_max")
        })
        .from(booksSubjects)
        .where(eq(booksSubjects.userId, userId))
        .groupBy(booksSubjects.subject)
        .as("t");

    const subjectsQuery = () => {
      const subQuery = subjectCountRank();

      return db
        .select({
          label: sql<string>`CASE WHEN t.rank_min = 1 THEN 'MIN Subjects' ELSE 'MAX Subjects' END`.as("label"),
          count: subQuery.count,
          id: subQuery.subject
        })
        .from(subQuery)
        .where(or(eq(subQuery.rank_min, 1), eq(subQuery.rank_max, 1)));
    };

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

    const data = await executeDrizzle(
      "User summary",
      union(
        db
          .select({ label: sql<string>`'All books'`, count: sql<number>`COUNT(*)`, id: sql<number>`0` })
          .from(books)
          .where(eq(books.userId, userId)),
        subjectsQuery(),
        unusedSubjectsQuery(),
        tagsQuery(),
        unusedTagsQuery()
      )
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
