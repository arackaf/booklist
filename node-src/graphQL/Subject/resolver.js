import { queryUtilities, processHook } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject, constants } = queryUtilities;
import { ObjectId } from "mongodb";
import SubjectMetadata from "./Subject";
import * as dbHelpers from "../dbHelpers";
import ResolverExtras1 from "../../graphQL-custom/extras/subject/resolver";
const { Query: QueryExtras1, Mutation: MutationExtras1, ...OtherExtras1 } = ResolverExtras1;

export async function loadSubjects(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Subject", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let Subjects = await dbHelpers.runQuery(db, "subjects", aggregateItems);
  await processHook(hooksObj, "Subject", "adjustResults", Subjects);
  return Subjects;
}

export const Subject = {

    ...(OtherExtras1 || {})
}

export default {
  Query: {
    async getSubject(root, args, context, ast) {
      await processHook(hooksObj, "Subject", "queryPreprocess", root, args, context, ast);
      let db = await root.db;
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectMetadata, "Subject");
      await processHook(hooksObj, "Subject", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadSubjects(db, queryPacket, root, args, context, ast);

      return {
        Subject: results[0] || null
      };
    },
    async allSubjects(root, args, context, ast) {
      await processHook(hooksObj, "Subject", "queryPreprocess", root, args, context, ast);
      let db = await root.db;
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, SubjectMetadata, "Subjects");
      await processHook(hooksObj, "Subject", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.Subjects = await loadSubjects(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "subjects", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    },
    ...(QueryExtras1 || {})
  },
  Mutation: {
    async createSubject(root, args, context, ast) {
      let db = await root.db;
      context.__mongodb = db;
      let newObject = await newObjectFromArgs(args.Subject, SubjectMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      let requestMap = parseRequestedFields(ast, "Subject");
      let $project = requestMap.size ? getMongoProjection(requestMap, SubjectMetadata, args) : null;

      if ((newObject = await dbHelpers.processInsertion(db, newObject, { typeMetadata: SubjectMetadata, hooksObj, root, args, context, ast })) == null) {
        return { Subject: null };
      }
      let result = $project ? (await loadSubjects(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        success: true,
        Subject: result
      }
    },
    async deleteSubject(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await root.db;
      let $match = { _id: ObjectId(args._id) };
      
      if (await processHook(hooksObj, "Subject", "beforeDelete", $match, root, args, context, ast) === false) {
        return false;
      }
      await dbHelpers.runDelete(db, "subjects", $match);
      await processHook(hooksObj, "Subject", "afterDelete", $match, root, args, context, ast);
      return true;
    },
    ...(MutationExtras1 || {})
  }
};