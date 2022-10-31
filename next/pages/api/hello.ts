import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "../../lib/getSessionApi";
import { NextRequest } from "next/server";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  //console.log("in api, session:", { session });

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
      console.log("SUCCESS", res);
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
      console.log("SUCCESS", res);
    })
    .catch(err => {
      console.log({ err });
    });

  res.status(200).json({ name: "Hello World", session });
}
