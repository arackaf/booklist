import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import UserMetadata from "./User";

export async function loadUsers(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "User", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let Users = await dbHelpers.runQuery(db, "users", aggregateItems);
  await processHook(hooksObj, "User", "adjustResults", Users);
  Users.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Users, UserMetadata);
  return Users;
}

export const User = {


}

export default {
  Query: {
    async getUser(root, args, context, ast) {
      await processHook(hooksObj, "User", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "User");
      await processHook(hooksObj, "User", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadUsers(db, queryPacket, root, args, context, ast);

      return {
        User: results[0] || null
      };
    },
    async allUsers(root, args, context, ast) {
      await processHook(hooksObj, "User", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "Users");
      await processHook(hooksObj, "User", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.Users = await loadUsers(db, queryPacket, root, args, context, ast);
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
    async updateUser(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, UserMetadata, "User");
      let updates = await getUpdateObject(args.Updates || {}, UserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "User", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { User: null };
      }
      if (!$match._id) {
        throw "No _id sent, or inserted in middleware";
      }
      await setUpOneToManyRelationshipsForUpdate([args._id], args, UserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "users", $match, updates);
      await processHook(hooksObj, "User", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? (await loadUsers(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        User: result,
        success: true
      };
    }
  }
};