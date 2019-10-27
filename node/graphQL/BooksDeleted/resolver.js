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
const runHook = processHook.bind(this, hooksObj, "BooksDeleted");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import BooksDeletedMetadata from "./BooksDeleted";

async function loadBooksDeleteds(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "BooksDeleted", "queryPreAggregate", aggregationPipeline, {
    db,
    root,
    args,
    context,
    ast
  });
  let BooksDeleteds = await dbHelpers.runQuery(db, "booksDeleted", aggregationPipeline);
  await processHook(hooksObj, "BooksDeleted", "adjustResults", BooksDeleteds);
  BooksDeleteds.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(BooksDeleteds, BooksDeletedMetadata);
}

export const BooksDeleted = {};

export default {
  Query: {
    async getBooksDeleted(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BooksDeletedMetadata, "BooksDeleted");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadBooksDeleteds(db, aggregationPipeline, root, args, context, ast, "BooksDeleted");

      return {
        BooksDeleted: results[0] || null
      };
    },
    async allBooksDeleteds(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BooksDeletedMetadata, "BooksDeleteds");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.BooksDeleteds = await loadBooksDeleteds(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "booksDeleted", [
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
