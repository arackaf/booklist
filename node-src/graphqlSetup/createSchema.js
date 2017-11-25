import { createGraphqlSchema } from "mongo-graphql-starter";
import projectSetup from "./projectSetup";

import path from "path";

createGraphqlSchema(projectSetup, path.resolve("../"));
