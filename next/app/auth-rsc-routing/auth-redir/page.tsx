import React from "react";
import { headers } from "next/headers";
import { getSession } from "../../../lib/getSessionRsc";

export default async function () {
  const cookie = headers().get("cookie");
  const foo = await fetch("http://localhost:3000/api/hello", { cache: "no-store", headers: { cookie: cookie } });

  // const foo = await fetch("http://localhost:3000/api/hello", { credentials: "include" });

  //const foo2 = await fetch("http://localhost:3000/api/hello", { credentials: "same-origin" });
  //const res = await foo.json();

  //console.log("rsc", { session });
  //console.log("rsc api", { res });
  return <main style={{ margin: "50px" }}>Yo RSC!!!</main>;
}
