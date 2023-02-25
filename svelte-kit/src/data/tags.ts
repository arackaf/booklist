import { deleteById, insertObject, mySqlConnectionFactory, queryTags, updateById } from "./dbUtils";
import type { TagEditFields } from "./types";

export const allTags = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  const httpStart = +new Date();

  try {
    const conn = mySqlConnectionFactory.connection();

    const tagsResp = (await conn.execute(`SELECT *, id as _id FROM tags USE INDEX (idx_user_name) WHERE userId = ? ORDER BY name;`, [userId])) as any;
    const tags = tagsResp.rows;

    const httpEnd = +new Date();
    console.log("MySQL tags time", httpEnd - httpStart);

    return tags;
  } catch (err) {
    console.log("Error reading tags", err);
  }
};

export const allTags__mongo = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  const httpStart = +new Date();

  return queryTags({
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, userId: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  })
    .then(tags => {
      const httpEnd = +new Date();
      console.log("HTTP tags time", httpEnd - httpStart);

      return tags;
    })
    .catch(err => {
      console.log({ err });
      return [];
    });
};

export const saveTag = async (userId: string, _id: string, subject: TagEditFields) => {
  const { name, backgroundColor, textColor } = subject;

  if (_id) {
    return updateSingleTag(userId, _id, { name, backgroundColor, textColor });
  } else {
    return insertSingleTag(userId, { name, backgroundColor, textColor });
  }
};

const insertSingleTag = async (userId: string, subject: TagEditFields) => {
  return insertObject("tags", userId, subject);
};

const updateSingleTag = async (userId: string, _id: string, updates: TagEditFields) => {
  return updateById("tags", userId, _id, {
    $set: {
      name: updates.name,
      textColor: updates.textColor,
      backgroundColor: updates.backgroundColor
    }
  });
};

export const deleteSingleTag = deleteById.bind(null, "tags");
