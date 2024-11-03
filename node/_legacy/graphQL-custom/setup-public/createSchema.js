import { createGraphqlSchema } from "mongo-graphql-starter";
import * as projectSetup from "./projectSetup";

import path from "path";
import del from "del";

del.sync(path.resolve("../../graphQL-public"), { force: true });

createGraphqlSchema(projectSetup, path.resolve("../../graphQL-public"), { hooks: path.resolve(__dirname, "../hooksPublic.js") });
