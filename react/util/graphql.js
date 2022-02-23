import { setDefaultClient, Client } from "micro-graphql-react";

const prod = /mylibrary\.io/.test(location.host);

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);
