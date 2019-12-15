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
const runHook = processHook.bind(this, hooksObj, "SubjectsDeleted");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import SubjectsDeletedMetadata from "./SubjectsDeleted";

async function loadSubjectsDeleteds(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "SubjectsDeleted", "queryPreAggregate", aggregationPipeline, {
    db,
    root,
    args,
    context,
    ast
  });
  let SubjectsDeleteds = await dbHelpers.runQuery(db, "subjectsDeleted", aggregationPipeline);
  await processHook(hooksObj, "SubjectsDeleted", "adjustResults", SubjectsDeleteds);
  SubjectsDeleteds.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(SubjectsDeleteds, SubjectsDeletedMetadata);
}

export const SubjectsDeleted = {};

export default {
  Query: {
    async getSubjectsDeleted(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectsDeletedMetadata, "SubjectsDeleted");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadSubjectsDeleteds(db, aggregationPipeline, root, args, context, ast, "SubjectsDeleted");

      return {
        SubjectsDeleted: results[0] || null
      };
    },
    async allSubjectsDeleteds(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectsDeletedMetadata, "SubjectsDeleteds");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.SubjectsDeleteds = await loadSubjectsDeleteds(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "subjectsDeleted", [
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
