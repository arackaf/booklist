import { queryUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../../graphQL-custom/hooksPublic.js";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, setUpOneToManyRelationships, setUpOneToManyRelationshipsForUpdate, getUpdateObject, constants, cleanUpResults } = queryUtilities;
import { ObjectId } from "mongodb";
import LabelColorMetadata from "./LabelColor";

export async function loadLabelColors(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "LabelColor", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let LabelColors = await dbHelpers.runQuery(db, "labelColors", aggregateItems);
  await processHook(hooksObj, "LabelColor", "adjustResults", LabelColors);
  LabelColors.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(LabelColors, LabelColorMetadata);
  return LabelColors;
}

export const LabelColor = {


}

export default {
  Query: {
    async allLabelColors(root, args, context, ast) {
      await processHook(hooksObj, "LabelColor", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, LabelColorMetadata, "LabelColors");
      await processHook(hooksObj, "LabelColor", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.LabelColors = await loadLabelColors(db, queryPacket, root, args, context, ast);
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