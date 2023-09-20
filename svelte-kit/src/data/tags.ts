import { and, eq } from "drizzle-orm";
import { booksTags, tags } from "./drizzle-schema";
import { db, executeDrizzle, executeQuery } from "./dbUtils";
import type { Tag, TagEditFields } from "./types";

export const allTags = async (userId: string = ""): Promise<Tag[]> => {
  if (!userId) {
    return [];
  }

  try {
    return await executeQuery("read tags", `SELECT * FROM tags USE INDEX (idx_user_name) WHERE userId = ? ORDER BY name;`, [userId]);
  } catch (err) {
    console.log("Error reading tags", err);
    return [];
  }
};

export const saveTag = async (userId: string, id: number, subject: TagEditFields) => {
  const { name, backgroundColor, textColor } = subject;

  if (id) {
    return updateSingleTag(userId, id, { name, backgroundColor, textColor });
  } else {
    return insertSingleTag(userId, { name, backgroundColor, textColor });
  }
};

const insertSingleTag = async (userId: string, tag: TagEditFields) => {
  return executeDrizzle(
    "insert tag",
    db.insert(tags).values({
      name: tag.name,
      textColor: tag.textColor,
      backgroundColor: tag.backgroundColor,
      userId
    })
  );
};

const updateSingleTag = async (userId: string, id: number, updates: TagEditFields) => {
  return executeDrizzle(
    "update tag",
    db
      .update(tags)
      .set({
        name: updates.name,
        textColor: updates.textColor,
        backgroundColor: updates.backgroundColor
      })
      .where(and(eq(tags.id, id), eq(tags.userId, userId)))
  );
};

export const deleteSingleTag = async (userId: string, id: number) => {
  const tag = await getTag(userId, id);
  if (!tag) {
    return;
  }
  return executeDrizzle(
    "delete tag",
    db.transaction(async tx => {
      await tx.delete(tags).where(eq(tags.id, id));
      await tx.delete(booksTags).where(eq(booksTags.tag, id));
    })
  );
};

const getTag = async (userId: string, id: number) => {
  const res = await executeDrizzle(
    "get subject",
    db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), eq(tags.userId, userId)))
  );

  return res[0];
};
