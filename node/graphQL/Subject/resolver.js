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
const runHook = processHook.bind(this, hooksObj, "Subject");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import SubjectMetadata from "./Subject";
import ResolverExtras1 from "../../graphQL-custom/extras/subject/resolver";
const { Query: QueryExtras1, Mutation: MutationExtras1, ...OtherExtras1 } = ResolverExtras1;

async function loadSubjects(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "Subject", "queryPreAggregate", aggregationPipeline, { db, root, args, context, ast });
  let Subjects = await dbHelpers.runQuery(db, "subjects", aggregationPipeline);
  await processHook(hooksObj, "Subject", "adjustResults", Subjects);
  Subjects.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(Subjects, SubjectMetadata);
}

export const Subject = {
  ...(OtherExtras1 || {})
};

export default {
  Query: {
    async getSubject(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectMetadata, "Subject");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadSubjects(db, aggregationPipeline, root, args, context, ast, "Subject");

      return {
        Subject: results[0] || null
      };
    },
    async allSubjects(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectMetadata, "Subjects");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Subjects = await loadSubjects(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "subjects", [
            $match,
            { $group: { _id: null, count: { $sum: 1 } } }
          ]);
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    },
    ...(QueryExtras1 || {})
  },
  Mutation: {
    async createSubject(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Subject", SubjectMetadata, {
        create: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let newObject = await newObjectFromArgs(args.Subject, SubjectMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Subject");
        let $project = requestMap.size ? getMongoProjection(requestMap, SubjectMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, {
          ...gqlPacket,
          typeMetadata: SubjectMetadata,
          session
        });
        if (newObject == null) {
          return { Subject: null, success: false };
        }
        await setUpOneToManyRelationships(newObject, args.Subject, SubjectMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (await loadSubjects(
              db,
              [{ $match: { _id: newObject._id } }, { $project }, { $limit: 1 }],
              root,
              args,
              context,
              ast
            ))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ Subject: result, transaction, elapsedTime: 0 });
      });
    },
    ...(MutationExtras1 || {})
  }
};
