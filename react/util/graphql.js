import { setDefaultClient, Client } from "micro-graphql-react";

const prod = /mylibrary\.io/.test(location.host);

export const graphqlClient = new Client({
  endpoint: prod ? "https://graphql.mylibrary.io" : "http://graphql.lvh.me:3001",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);
