import tag from "graphql-tag";
import { print } from "graphql";
import fs from "fs";

import { addTypenameTransformer } from "persistgraphql/lib/src/queryTransformers";

export default function (options) {
  return {
    name: "generic-persistgraphql",

    transform(code, id) {
      if (!/\.graphql$/.test(id)) return;

      let queryLookup = JSON.parse(fs.readFileSync(options.path) as any);
      let queryAsString = options.add_typename ? print(addTypenameTransformer(tag(code))) : print(tag(code));

      if (!(queryAsString in queryLookup)) {
        console.error(`Query ${queryAsString} not found`);
        throw `Query ${queryAsString} not found`;
      }

      return {
        code: `export default ${queryLookup[queryAsString]};`,
        map: null // unless you support sourcemaps somehow
      };
    }
  };
}
