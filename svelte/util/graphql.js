import { setDefaultClient, Client } from "micro-graphql-svelte";

const endpoint = window.location.href.indexOf("userId=") === -1 ? "/graphql" : "/gqlraw";

export const graphqlClient = new Client({
  endpoint,
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);
