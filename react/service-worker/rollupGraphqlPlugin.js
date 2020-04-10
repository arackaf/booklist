const tag = require("graphql-tag");
const { print } = require("graphql");
const fs = require("fs");

const { addTypenameTransformer } = require("persistgraphql/lib/src/queryTransformers");

module.exports = function(options) {
  return {
    name: "generic-persistgraphql",

    transform(code, id) {
      if (!/\.graphql$/.test(id)) return;

      let queryLookup = JSON.parse(fs.readFileSync(options.path));
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
};
