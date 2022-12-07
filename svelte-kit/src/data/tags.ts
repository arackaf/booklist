import { env } from "$env/dynamic/private";
import type { Hash, Tag } from "./types";

export const allTags = async () => {
  const httpStart = +new Date();
  return fetch(env.MONGO_URL + "/action/aggregate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "tags",
      database: "my-library",
      dataSource: "Cluster0",
      pipeline: [{ $match: { userId: "60a93babcc3928454b5d1cc6" } }, { $project: { _id: 1, name: 1, userId: 1 } }, { $sort: { name: 1 } }]
    })
  })
    .then(res => res.json())
    .then(res => {
      const httpEnd = +new Date();
      console.log("HTTP tags time", httpEnd - httpStart);

      const tags = res.documents as Tag[];
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
