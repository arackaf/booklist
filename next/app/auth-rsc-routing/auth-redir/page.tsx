import React from "react";

import { NextAuthHandler } from "next-auth/core";
import { Session } from "next-auth";
import { headers, cookies } from "next/headers";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export const getSession = async (options = authOptions) => {
  const session = await NextAuthHandler<Session | {} | string>({
    options,
    req: {
      host: headers().get("x-forwarded-host") ?? "http://localhost:3000",
      action: "session",
      method: "GET",
      cookies: Array.from(cookies().entries()).reduce((acc, [key]) => ({ ...acc, [key]: cookies().get(key) }), {}),
      headers: headers()
    }
  });

  return session;
};

export default async function () {
  const xxx = await getSession();
  console.log(xxx);
  return <main style={{ margin: "50px" }}>Yo RSC!!!</main>;
}
