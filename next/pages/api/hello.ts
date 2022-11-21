import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "../../lib/getSessionApi";
import { NextRequest } from "next/server";
import { readBooks } from "../../../data/books";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  console.log("in api, session:", { session });

  readBooks();

  fetch(process.env.MONGO_URL + "/action/findOne", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      projection: { _id: 1, title: 1, authors: 1 }
    })
  })
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(res => {
      console.log("RESULT", res);
    })
    .catch(err => {
      console.log({ err });
    });

  fetch(process.env.MONGO_URL + "/action/aggregate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      pipeline: [{ $match: { title: { $regex: "s" } } }, { $project: { _id: 1, title: 1 } }, { $sort: { title: 1 } }]
    })
  })
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(res => {
      console.log("RESULT", res);
    })
    .catch(err => {
      console.log({ err });
    });

  fetch(process.env.MONGO_URL + "/action/updateMany", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      filter: { _id: { $in: [{ $oid: "6285a6596ea0d70a0c1a24bf" }, { $oid: "62915d0e1a727bc0a9dc7903" }] } },
      update: { $set: { isRead: false } }
    })
  })
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(res => {
      console.log("RESULT", res);
    })
    .catch(err => {
      console.log({ err });
    });

  fetch(process.env.MONGO_URL + "/action/deleteOne", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection: "books",
      database: "my-library",
      dataSource: "Cluster0",
      filter: { _id: { $oid: "636020b3b2802437f40bc437" } }
    })
  })
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(res => {
      console.log("RESULT", res);
    })
    .catch(err => {
      console.log({ err });
    });

  res.status(200).json({ name: "Hello World", session });
}
