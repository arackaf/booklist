import { queryUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, setUpOneToManyRelationships, setUpOneToManyRelationshipsForUpdate, getUpdateObject, constants, cleanUpResults } = queryUtilities;
import { ObjectId } from "mongodb";
import BookSummaryMetadata from "./BookSummary";

export async function loadBookSummarys(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "BookSummary", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let BookSummarys = await dbHelpers.runQuery(db, "amazonReference", aggregateItems);
  await processHook(hooksObj, "BookSummary", "adjustResults", BookSummarys);
  BookSummarys.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(BookSummarys, BookSummaryMetadata);
  return BookSummarys;
}

export const BookSummary = {


}

export default {
  Query: {
    async getBookSummary(root, args, context, ast) {
      await processHook(hooksObj, "BookSummary", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookSummaryMetadata, "BookSummary");
      await processHook(hooksObj, "BookSummary", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadBookSummarys(db, queryPacket, root, args, context, ast);

      return {
        BookSummary: results[0] || null
      };
    },
    async allBookSummarys(root, args, context, ast) {
      await processHook(hooksObj, "BookSummary", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookSummaryMetadata, "BookSummarys");
      await processHook(hooksObj, "BookSummary", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.BookSummarys = await loadBookSummarys(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "amazonReference", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {

  }
};