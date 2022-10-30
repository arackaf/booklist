import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "../../lib/getSessionApi";
import { NextRequest } from "next/server";

let x: NextRequest;

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const cookie = req.headers["cookie"];
  console.log("QQQ", cookie);

  const session2 = await getSession(cookie);

  console.log("in api, session:", { session });
  console.log("in api, session 2:", { session2 });

  res.status(200).json({ name: "Hello World", session });
}
