import React from "react";
import { getSession } from "../../../lib/getSessionRsc";

export default async function () {
  const session = await getSession();

  const foo = await fetch("http://localhost:3000/api/hello", { credentials: "include" });
  const foo2 = await fetch("http://localhost:3000/api/hello", { credentials: "same-origin" });
  const res = await foo.json();

  console.log("rsc", { session });
  console.log("rsc api", { res });
  return <main style={{ margin: "50px" }}>Yo RSC!!!</main>;
}
