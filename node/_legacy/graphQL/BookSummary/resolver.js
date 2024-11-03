import { insertUtilities, queryUtilities, projectUtilities, updateUtilities, processHook, dbHelpers, resolverHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const runHook = processHook.bind(this, hooksObj, "BookSummary");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import BookSummaryMetadata from "./BookSummary.js";

async function loadBookSummarys(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "BookSummary", "queryPreAggregate", aggregationPipeline, {
    db,
    root,
    args,
    context,
    ast
  });
  let BookSummarys = await dbHelpers.runQuery(db, "bookSummaries", aggregationPipeline);
  await processHook(hooksObj, "BookSummary", "adjustResults", BookSummarys);
  BookSummarys.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(BookSummarys, BookSummaryMetadata);
}

export const BookSummary = {};

export default {
  Query: {
    async getBookSummary(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookSummaryMetadata, "BookSummary");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadBookSummarys(db, aggregationPipeline, root, args, context, ast, "BookSummary");

      return {
        BookSummary: results[0] || null
      };
    },
    async allBookSummarys(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookSummaryMetadata, "BookSummarys");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.BookSummarys = await loadBookSummarys(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "bookSummaries", [$match, { $group: { _id: null, count: { $sum: 1 } } }]);
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async updateBookSummary(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "BookSummary", BookSummaryMetadata, { update: true });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, BookSummaryMetadata, "BookSummary");
        let updates = await getUpdateObject(args.Updates || {}, BookSummaryMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, BookSummaryMetadata, {
          ...gqlPacket,
          db,
          session
        });
        await dbHelpers.runUpdate(db, "bookSummaries", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? (await loadBookSummarys(db, [{ $match }, { $project }, { $limit: 1 }], root, args, context, ast))[0] : null;
        return resolverHelpers.mutationSuccessResult({ BookSummary: result, transaction, elapsedTime: 0 });
      });
    }
  }
};
