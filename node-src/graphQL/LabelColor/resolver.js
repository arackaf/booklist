import { queryUtilities, processHook } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject, constants } = queryUtilities;
import { ObjectId } from "mongodb";
import LabelColorMetadata from "./LabelColor";
import * as dbHelpers from "../dbHelpers";

export async function loadLabelColors(db, queryPacket) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    { $project },
    $sort ? { $sort } : null, 
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  let LabelColors = await dbHelpers.runQuery(db, "labelColors", aggregateItems);
  await processHook(hooksObj, "LabelColor", "adjustResults", LabelColors);
  return LabelColors;
}

export const LabelColor = {


}

export default {
  Query: {
    async allLabelColors(root, args, context, ast) {
      await processHook(hooksObj, "LabelColor", "queryPreprocess", root, args, context, ast);
      let db = await root.db;
      context.__mgqlsdb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, LabelColorMetadata, "LabelColors");
      await processHook(hooksObj, "LabelColor", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.LabelColors = await loadLabelColors(db, queryPacket);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "labelColors", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {

  }
};