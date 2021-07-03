import { createGraphqlSchema } from "mongo-graphql-starter";
import * as projectSetup from "./projectSetup";

import path from "path";
import del from "del";

del.sync(path.resolve("../../graphQL"), { force: true });

createGraphqlSchema(projectSetup, path.resolve("../../"), {
  typings: path.resolve("../../../react/graphql-typings.ts"),
  hooks: path.resolve("../hooks.js"),
  schemaAdditions: [path.resolve("../custom-content/userSchema.gql")],
  resolverAdditions: [path.resolve("../custom-content/userResolver.js")]
});
