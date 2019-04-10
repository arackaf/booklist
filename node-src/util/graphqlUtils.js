import { makeExecutableSchema } from "graphql-tools";
import schema from "../graphQL/schema";
import resolvers from "../graphQL/resolver";

import schemaPublic from "../graphQL-public/graphQL/schema";
import resolversPublic from "../graphQL-public/graphQL/resolver";

import { getDbConnection } from "./dbUtils";

const IS_DEV = process.env.IS_DEV;

export function getGraphqlSchema(dbPromise) {
  dbPromise = dbPromise || getDbConnection();

  const root = { client: IS_DEV ? null : dbPromise.then(({ client }) => client), db: dbPromise.then(({ db }) => db) };
  const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

  return { root, executableSchema };
}

export function getPublicGraphqlSchema(dbPromise) {
  dbPromise = dbPromise || getDbConnection();

  const rootPublic = { client: IS_DEV ? null : dbPromise.then(({ client }) => client), db: dbPromise.then(({ db }) => db) };
  const executableSchemaPublic = makeExecutableSchema({ typeDefs: schemaPublic, resolvers: resolversPublic });

  return { rootPublic, executableSchemaPublic };
}
