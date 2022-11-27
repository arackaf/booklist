import { setDefaultClient, Client } from "micro-graphql-react";

const prod = /mylibrary\.io/.test(location.host);

const endpoint = window.location.href.indexOf("userId=") === -1 ? "/graphql" : "/gqlraw";

export const graphqlClient = new Client({
  endpoint,
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);
