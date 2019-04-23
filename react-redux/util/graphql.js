import { setDefaultClient, Client } from "micro-graphql-react";

export const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);
