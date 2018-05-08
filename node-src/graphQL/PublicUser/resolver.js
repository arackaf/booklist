import { queryUtilities, processHook } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject, constants } = queryUtilities;
import { ObjectId } from "mongodb";
import PublicUserMetadata from "./PublicUser";
import * as dbHelpers from "../dbHelpers";

export async function loadPublicUsers(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "PublicUser", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let PublicUsers = await dbHelpers.runQuery(db, "users", aggregateItems);
  await processHook(hooksObj, "PublicUser", "adjustResults", PublicUsers);
  return PublicUsers;
}

export const PublicUser = {


}

export default {
  Query: {
    async getPublicUser(root, args, context, ast) {
      await processHook(hooksObj, "PublicUser", "queryPreprocess", root, args, context, ast);
      let db = await root.db;
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, PublicUserMetadata, "PublicUser");
      await processHook(hooksObj, "PublicUser", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadPublicUsers(db, queryPacket, root, args, context, ast);

      return {
        PublicUser: results[0] || null
      };
    },
    async allPublicUsers(root, args, context, ast) {
      await processHook(hooksObj, "PublicUser", "queryPreprocess", root, args, context, ast);
      let db = await root.db;
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, PublicUserMetadata, "PublicUsers");
      await processHook(hooksObj, "PublicUser", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.PublicUsers = await loadPublicUsers(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "users", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {

  }
};