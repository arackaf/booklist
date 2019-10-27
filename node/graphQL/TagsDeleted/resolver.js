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
const runHook = processHook.bind(this, hooksObj, "TagsDeleted");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import TagsDeletedMetadata from "./TagsDeleted";

async function loadTagsDeleteds(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "TagsDeleted", "queryPreAggregate", aggregationPipeline, {
    db,
    root,
    args,
    context,
    ast
  });
  let TagsDeleteds = await dbHelpers.runQuery(db, "tagsDeleted", aggregationPipeline);
  await processHook(hooksObj, "TagsDeleted", "adjustResults", TagsDeleteds);
  TagsDeleteds.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(TagsDeleteds, TagsDeletedMetadata);
}

export const TagsDeleted = {};

export default {
  Query: {
    async getTagsDeleted(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagsDeletedMetadata, "TagsDeleted");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadTagsDeleteds(db, aggregationPipeline, root, args, context, ast, "TagsDeleted");

      return {
        TagsDeleted: results[0] || null
      };
    },
    async allTagsDeleteds(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagsDeletedMetadata, "TagsDeleteds");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.TagsDeleteds = await loadTagsDeleteds(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "tagsDeleted", [
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
