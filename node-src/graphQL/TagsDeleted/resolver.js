import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import TagsDeletedMetadata from "./TagsDeleted";

export async function loadTagsDeleteds(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "TagsDeleted", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let TagsDeleteds = await dbHelpers.runQuery(db, "tagsDeleted", aggregateItems);
  await processHook(hooksObj, "TagsDeleted", "adjustResults", TagsDeleteds);
  TagsDeleteds.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(TagsDeleteds, TagsDeletedMetadata);
  return TagsDeleteds;
}

export const TagsDeleted = {


}

export default {
  Query: {
    async getTagsDeleted(root, args, context, ast) {
      await processHook(hooksObj, "TagsDeleted", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagsDeletedMetadata, "TagsDeleted");
      await processHook(hooksObj, "TagsDeleted", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadTagsDeleteds(db, queryPacket, root, args, context, ast);

      return {
        TagsDeleted: results[0] || null
      };
    },
    async allTagsDeleteds(root, args, context, ast) {
      await processHook(hooksObj, "TagsDeleted", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagsDeletedMetadata, "TagsDeleteds");
      await processHook(hooksObj, "TagsDeleted", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.TagsDeleteds = await loadTagsDeleteds(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "tagsDeleted", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {

  }
};