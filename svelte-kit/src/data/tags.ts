import { toHash } from "$lib/state/helpers";
import { deleteById, insertObject, queryTags, updateById } from "./dbUtils";
import type { TagEditFields } from "./types";

export const allTags = async (userId: string = "") => {
  if (!userId) {
    return { tags: [], tagHash: {} };
  }

  const httpStart = +new Date();

  return queryTags({
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, userId: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  })
    .then(tags => {
      const httpEnd = +new Date();
      console.log("HTTP tags time", httpEnd - httpStart);

      const tagHash = toHash(tags);

      return { tags, tagHash };
    })
    .catch(err => {
      console.log({ err });
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
