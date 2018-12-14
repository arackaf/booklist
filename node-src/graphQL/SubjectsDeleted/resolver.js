import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import SubjectsDeletedMetadata from "./SubjectsDeleted";

export async function loadSubjectsDeleteds(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "SubjectsDeleted", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let SubjectsDeleteds = await dbHelpers.runQuery(db, "subjectsDeleted", aggregateItems);
  await processHook(hooksObj, "SubjectsDeleted", "adjustResults", SubjectsDeleteds);
  SubjectsDeleteds.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(SubjectsDeleteds, SubjectsDeletedMetadata);
  return SubjectsDeleteds;
}

export const SubjectsDeleted = {


}

export default {
  Query: {
    async getSubjectsDeleted(root, args, context, ast) {
      await processHook(hooksObj, "SubjectsDeleted", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectsDeletedMetadata, "SubjectsDeleted");
      await processHook(hooksObj, "SubjectsDeleted", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadSubjectsDeleteds(db, queryPacket, root, args, context, ast);

      return {
        SubjectsDeleted: results[0] || null
      };
    },
    async allSubjectsDeleteds(root, args, context, ast) {
      await processHook(hooksObj, "SubjectsDeleted", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectsDeletedMetadata, "SubjectsDeleteds");
      await processHook(hooksObj, "SubjectsDeleted", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.SubjectsDeleteds = await loadSubjectsDeleteds(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "subjectsDeleted", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {

  }
};