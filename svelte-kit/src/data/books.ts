import { env } from "$env/dynamic/private";

export const updateBook = async (book: any) => {
  const { _id, title, tags, subjects } = book;

  return fetch(env.MONGO_URL + "/action/updateOne", {
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
      filter: { _id: { $oid: _id } },
      update: { $set: { title, tags, subjects } }
    })
  })
    .then(res => res.json())
    .catch(err => {
      console.log({ err });
    });
};

export const searchBooks = async (search: string) => {
  const httpStart = +new Date();
  return fetch(env.MONGO_URL + "/action/aggregate", {
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
        { $project: { _id: 1, title: 1, userId: 1, authors: 1, tags: 1, subjects: 1 } },
        { $limit: 50 },
        { $sort: { title: 1 } }
      ]
    })
  })
    .then(res => res.json())
    .then(res => {
      const httpEnd = +new Date();
      console.log("HTTP time books", httpEnd - httpStart);

      const books = res.documents;
      books.forEach((book: any) => {
        ["authors", "subjects", "tags"].forEach(arr => {
          if (!Array.isArray(book[arr])) {
            book[arr] = [];
          }
        });
      });
      return res.documents;
    })
    .catch(err => {
      console.log({ err });
    });
};
