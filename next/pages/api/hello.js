import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import { getToken } from "next-auth/jwt";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const token = await getToken({ req });

  console.log("in api, session:", { session });
  console.log("in api, token:", { token });

  res.status(200).json({ name: "John Doe" });
}
