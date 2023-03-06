import { mySqlConnectionFactory } from "./dbUtils";
import type { TagEditFields } from "./types";

export const allTags = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  const httpStart = +new Date();

  try {
    const conn = mySqlConnectionFactory.connection();

    const tagsResp = (await conn.execute(`SELECT * FROM tags USE INDEX (idx_user_name) WHERE userId = ? ORDER BY name;`, [userId])) as any;
    const tags = tagsResp.rows;

    const httpEnd = +new Date();
    console.log("MySQL tags time", httpEnd - httpStart);

    return tags;
  } catch (err) {
    console.log("Error reading tags", err);
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
  const conn = mySqlConnectionFactory.connection();
  conn.execute(
    `
    INSERT INTO tags (name, textColor, backgroundColor, userId)
    VALUES (?, ?, ?, ?)
  `,
    [tag.name, tag.textColor, tag.backgroundColor, userId]
  );
};

const updateSingleTag = async (userId: string, id: number, updates: TagEditFields) => {
  const conn = mySqlConnectionFactory.connection();
  conn.execute(
    `
    UPDATE tags 
    SET name = ?, textColor = ?, backgroundColor = ?
    WHERE id = ? AND userId = ?
  `,
    [updates.name, updates.textColor, updates.backgroundColor, id, userId]
  );
};

export const deleteSingleTag = async (userId: string, id: string) => {
  const conn = mySqlConnectionFactory.connection();
  conn.execute(
    `
    DELETE FROM tags 
    WHERE id = ? AND userId = ?
  `,
    [id, userId]
  );
};
