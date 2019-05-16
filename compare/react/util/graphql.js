import { setDefaultClient, Client } from "micro-graphql-react";

export const graphqlClient = new Client({
  endpoint: "https://mylibrary.io/graphql-public"
});

setDefaultClient(graphqlClient);
