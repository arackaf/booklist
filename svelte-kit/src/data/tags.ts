import { queryTags } from "./dbUtils";
import type { Hash, Tag } from "./types";

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
