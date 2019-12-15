import {
  insertUtilities,
  queryUtilities,
  projectUtilities,
  updateUtilities,
  processHook,
  dbHelpers,
  resolverHelpers
} from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const runHook = processHook.bind(this, hooksObj, "PublicUser");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import PublicUserMetadata from "./PublicUser";

async function loadPublicUsers(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "PublicUser", "queryPreAggregate", aggregationPipeline, { db, root, args, context, ast });
  let PublicUsers = await dbHelpers.runQuery(db, "users", aggregationPipeline);
  await processHook(hooksObj, "PublicUser", "adjustResults", PublicUsers);
  PublicUsers.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(PublicUsers, PublicUserMetadata);
}

export const PublicUser = {};

export default {
  Query: {
    async getPublicUser(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, PublicUserMetadata, "PublicUser");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadPublicUsers(db, aggregationPipeline, root, args, context, ast, "PublicUser");

      return {
        PublicUser: results[0] || null
      };
    },
    async allPublicUsers(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, PublicUserMetadata, "PublicUsers");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.PublicUsers = await loadPublicUsers(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "users", [
            $match,
            { $group: { _id: null, count: { $sum: 1 } } }
          ]);
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {}
};
