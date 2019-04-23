import { useMemo, useReducer } from "react";

import { setDefaultClient, Client } from "micro-graphql-react";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

export const objectsToHash = objs => objs.reduce((hash, o) => ((hash[o._id] = o), hash), {});

setDefaultClient(graphqlClient);

export function isLoggedIn() {
  let logged_in = getCookie("logged_in"),
    userId = getCookie("userId");
  return { logged_in, userId };
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}
