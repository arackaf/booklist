import { queryUtilities, processHook } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject, constants } = queryUtilities;
import { ObjectId } from "mongodb";
import PublicUserMetadata from "./PublicUser";
import * as dbHelpers from "../dbHelpers";

export async function loadPublicUsers(db, queryPacket) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

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
      let results = await loadPublicUsers(db, queryPacket);

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
        result.PublicUsers = await loadPublicUsers(db, queryPacket);
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
    async createPublicUser(root, args, context, ast) {
      let db = await root.db;
      context.__mongodb = db;
      let newObject = await newObjectFromArgs(args.PublicUser, PublicUserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      let requestMap = parseRequestedFields(ast, "PublicUser");
      let $project = requestMap.size ? getMongoProjection(requestMap, PublicUserMetadata, args) : null;

      if ((newObject = await dbHelpers.processInsertion(db, newObject, { typeMetadata: PublicUserMetadata, hooksObj, root, args, context, ast })) == null) {
        return { PublicUser: null };
      }
      let result = $project ? (await loadPublicUsers(db, { $match: { _id: newObject._id }, $project, $limit: 1 }))[0] : null;
      return {
        success: true,
        PublicUser: result
      }
    },
    async updatePublicUser(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await root.db;
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery({ _id: args._id }, ast, PublicUserMetadata, "PublicUser");
      let updates = await getUpdateObject(args.Updates || {}, PublicUserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "PublicUser", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { PublicUser: null };
      }
      await dbHelpers.runUpdate(db, "users", $match, updates);
      await processHook(hooksObj, "PublicUser", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? (await loadPublicUsers(db, { $match, $project, $limit: 1 }))[0] : null;
      return {
        PublicUser: result,
        success: true
      };
    },
    async updatePublicUsers(root, args, context, ast) {
      let db = await root.db;
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, PublicUserMetadata, "PublicUsers");
      let updates = await getUpdateObject(args.Updates || {}, PublicUserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "PublicUser", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await dbHelpers.runUpdate(db, "users", $match, updates, { multi: true });
      await processHook(hooksObj, "PublicUser", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? await loadPublicUsers(db, { $match, $project }) : null;
      return {
        PublicUsers: result,
        success: true
      };
    },
    async updatePublicUsersBulk(root, args, context, ast) {
      let db = await root.db;
      let { $match } = decontructGraphqlQuery(args.Match, ast, PublicUserMetadata);
      let updates = await getUpdateObject(args.Updates || {}, PublicUserMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "PublicUser", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await dbHelpers.runUpdate(db, "users", $match, updates, { multi: true });
      await processHook(hooksObj, "PublicUser", "afterUpdate", $match, updates, root, args, context, ast);

      return { success: true };
    },
    async deletePublicUser(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await root.db;
      let $match = { _id: ObjectId(args._id) };
      
      if (await processHook(hooksObj, "PublicUser", "beforeDelete", $match, root, args, context, ast) === false) {
        return false;
      }
      await dbHelpers.runDelete(db, "users", $match);
      await processHook(hooksObj, "PublicUser", "afterDelete", $match, root, args, context, ast);
      return true;
    }
  }
};