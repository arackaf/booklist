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
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import BooksDeletedMetadata from "./BooksDeleted";

export async function loadBooksDeleteds(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match },
    $sort ? { $sort } : null,
    { $project },
    $skip != null ? { $skip } : null,
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "BooksDeleted", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let BooksDeleteds = await dbHelpers.runQuery(db, "booksDeleted", aggregateItems);
  await processHook(hooksObj, "BooksDeleted", "adjustResults", BooksDeleteds);
  BooksDeleteds.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  cleanUpResults(BooksDeleteds, BooksDeletedMetadata);
  return BooksDeleteds;
}

export const BooksDeleted = {};

export default {
  Query: {
    async getBooksDeleted(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BooksDeletedMetadata, "BooksDeleted");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadBooksDeleteds(db, queryPacket, root, args, context, ast);

      return {
        BooksDeleted: results[0] || null
      };
    },
    async allBooksDeleteds(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BooksDeletedMetadata, "BooksDeleteds");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.BooksDeleteds = await loadBooksDeleteds(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "booksDeleted", [
            { $match: queryPacket.$match },
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
