import { deleteById, insertObject, queryTags, runSingleUpdate } from "./dbUtils";
import type { Hash, Tag, TagEditFields } from "./types";

export const allTags = async (userId: string = "") => {
  userId = userId || "";
  const httpStart = +new Date();

  return queryTags({
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, userId: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  })
    .then(tags => {
      const httpEnd = +new Date();
      console.log("HTTP tags time", httpEnd - httpStart);

      const tagHash = tags.reduce<Hash<Tag>>((hash, tag) => {
        hash[tag._id] = tag;
        return hash;
      }, {});

      return { allTags: tags, tagHash };
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
  return runSingleUpdate(
    "tags",
    userId,
    { _id: { $oid: _id } },
    {
      $set: {
        name: updates.name,
        textColor: updates.textColor,
        backgroundColor: updates.backgroundColor
      }
    }
  );
};

export const deleteSingleTag = deleteById.bind(null, "tags");
