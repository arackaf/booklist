import { executeCommand, executeQuery, mySqlConnectionFactory } from "./dbUtils";
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
  return executeCommand(
    "insert tag",
    `
    INSERT INTO tags (name, textColor, backgroundColor, userId)
    VALUES (?, ?, ?, ?)
  `,
    [tag.name, tag.textColor, tag.backgroundColor, userId]
  );
};

const updateSingleTag = async (userId: string, id: number, updates: TagEditFields) => {
  return executeCommand(
    "update tag",
    `
    UPDATE tags 
    SET name = ?, textColor = ?, backgroundColor = ?
    WHERE id = ? AND userId = ?`,
    [updates.name, updates.textColor, updates.backgroundColor, id, userId]
  );
};

export const deleteSingleTag = async (userId: string, id: string) => {
  return executeCommand("delete tag", `DELETE FROM tags WHERE id = ? AND userId = ?`, [id, userId]);
};
