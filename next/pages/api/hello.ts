import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "../../lib/getSessionApi";
import { NextRequest } from "next/server";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  console.log("in api, session:", { session });

  res.status(200).json({ name: "Hello World", session });
}
