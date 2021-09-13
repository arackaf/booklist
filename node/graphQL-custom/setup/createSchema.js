import { createGraphqlSchema } from "mongo-graphql-starter";
import * as projectSetup from "./projectSetup";

import path from "path";
import del from "del";

del.sync(path.resolve("../../graphQL"), { force: true });

createGraphqlSchema(projectSetup, path.resolve("../../"), {
  typings: path.resolve("../../../react/graphql-typings.ts"),
  hooks: path.resolve("../hooks.js"),
  schemaAdditions: [path.resolve("../custom-content/user/schema.gql"), path.resolve("../custom-content/recently-scanned/schema.gql")],
  resolverAdditions: [path.resolve("../custom-content/user/resolver.js"), path.resolve("../custom-content/recently-scanned/resolver.js")]
});
