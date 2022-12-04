import { env } from "$env/dynamic/private";
import { getDbConnection } from "./dbUtils";

const { db } = await getDbConnection();

export const searchBooks = async (search: string) => {
  const nativeStart = +new Date();

  const httpStart = +new Date();
  const httpResponse = fetch(env.MONGO_URL + "/action/aggregate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      pipeline: [
        { $match: { title: { $regex: search || "", $options: "i" }, userId: "60a93babcc3928454b5d1cc6" } },
        { $project: { _id: 1, title: 1, userId: 1 } },
        { $limit: 50 },
        { $sort: { title: 1 } }
      ]
    })
  })
    .then(res => res.json())
    .then(res => {
      const httpEnd = +new Date();
      console.log("HTTP time", httpEnd - httpStart);
      return res.documents;
    })
    .catch(err => {
      console.log({ err });
    });

  const result = await db
    .collection("books")
    .aggregate([
      { $match: { title: { $regex: search || "", $options: "i" }, userId: "60a93babcc3928454b5d1cc6" } },
      { $project: { _id: 1, title: 1, userId: 1 } },
      { $limit: 50 },
      { $sort: { title: 1 } }
    ])
    .toArray();

  const nativeEnd = +new Date();

  console.log("Native time books", nativeEnd - nativeStart);
  return httpResponse;
  return result.map(b => ({ ...b, _id: b._id.toString() }));
};
