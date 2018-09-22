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
    async createBookSummary(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let newObject = await newObjectFromArgs(args.BookSummary, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      let requestMap = parseRequestedFields(ast, "BookSummary");
      let $project = requestMap.size ? getMongoProjection(requestMap, BookSummaryMetadata, args) : null;

      if ((newObject = await dbHelpers.processInsertion(db, newObject, { typeMetadata: BookSummaryMetadata, hooksObj, root, args, context, ast })) == null) {
        return { BookSummary: null };
      }
      await setUpOneToManyRelationships(newObject, args.BookSummary, BookSummaryMetadata, { db, hooksObj, root, args, context, ast });
      let result = $project ? (await loadBookSummarys(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        success: true,
        BookSummary: result
      }
    },
    async updateBookSummary(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, BookSummaryMetadata, "BookSummary");
      let updates = await getUpdateObject(args.Updates || {}, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "BookSummary", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { BookSummary: null };
      }
      if (!$match._id) {
        throw "No _id sent, or inserted in middleware";
      }
      await setUpOneToManyRelationshipsForUpdate([args._id], args, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "amazonReference", $match, updates);
      await processHook(hooksObj, "BookSummary", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? (await loadBookSummarys(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        BookSummary: result,
        success: true
      };
    },
    async updateBookSummarys(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, BookSummaryMetadata, "BookSummarys");
      let updates = await getUpdateObject(args.Updates || {}, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "BookSummary", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await setUpOneToManyRelationshipsForUpdate(args._ids, args, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "amazonReference", $match, updates, { multi: true });
      await processHook(hooksObj, "BookSummary", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? await loadBookSummarys(db, { $match, $project }, root, args, context, ast) : null;
      return {
        BookSummarys: result,
        success: true
      };
    },
    async updateBookSummarysBulk(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let { $match } = decontructGraphqlQuery(args.Match, ast, BookSummaryMetadata);
      let updates = await getUpdateObject(args.Updates || {}, BookSummaryMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "BookSummary", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await dbHelpers.runUpdate(db, "amazonReference", $match, updates, { multi: true });
      await processHook(hooksObj, "BookSummary", "afterUpdate", $match, updates, root, args, context, ast);

      return { success: true };
    },
    async deleteBookSummary(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let $match = { _id: ObjectId(args._id) };
      
      if (await processHook(hooksObj, "BookSummary", "beforeDelete", $match, root, args, context, ast) === false) {
        return false;
      }
      await dbHelpers.runDelete(db, "amazonReference", $match);
      await processHook(hooksObj, "BookSummary", "afterDelete", $match, root, args, context, ast);
      return true;
    }
  }
};