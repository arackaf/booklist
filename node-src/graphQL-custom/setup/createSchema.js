import { createGraphqlSchema } from "mongo-graphql-starter";
import * as projectSetup from "./projectSetup";

import path from "path";
import del from "del";

del.sync(path.resolve("../../graphQL"), { force: true });

createGraphqlSchema(projectSetup, path.resolve("../../"), { hooks: path.resolve(__dirname, "../hooks.js") });
