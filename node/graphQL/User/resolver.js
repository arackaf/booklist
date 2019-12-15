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
const runHook = processHook.bind(this, hooksObj, "User");
const { decontructGraphqlQuery, cleanUpResults, dataLoaderId } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import UserMetadata from "./User";
import BookMetadata from "../Book/Book";
import flatMap from "lodash.flatmap";
import DataLoader from "dataloader";

async function loadUsers(db, aggregationPipeline, root, args, context, ast) {
  await processHook(hooksObj, "User", "queryPreAggregate", aggregationPipeline, { db, root, args, context, ast });
  let Users = await dbHelpers.runQuery(db, "users", aggregationPipeline);
  await processHook(hooksObj, "User", "adjustResults", Users);
  Users.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  return cleanUpResults(Users, UserMetadata);
}

export const User = {
  async books(obj, args, context, ast) {
    if (obj.books) {
      await processHook(hooksObj, "Book", "adjustResults", obj.books);
      return cleanUpResults(obj.books, BookMetadata);
    }

    let dataLoaderName = dataLoaderId(ast);
    if (context[dataLoaderName] == null) {
      let db = await context.__mongodb;
      context[dataLoaderName] = new DataLoader(async keys => {
        let $match = { userId: { $in: keys.filter(id => id).map(id => "" + id) } };
        let queryPacket = decontructGraphqlQuery(args, ast, BookMetadata, null, { force: ["userId"] });
        let { $project, $sort, $limit, $skip } = queryPacket;

        let aggregateItems = [{ $match }, $sort ? { $sort } : null, { $project }].filter(item => item);
        let results = await dbHelpers.runQuery(db, "books", aggregateItems);
        cleanUpResults(results, BookMetadata);
        let finalResult = keys.map(keyArr => []);

        let keyLookup = new Map([]);
        for (let i = 0; i < keys.length; i++) {
          keyLookup.set("" + keys[i], finalResult[i]);
        }
        for (let result of results) {
          let resultEntry = keyLookup.get(result.userId);
          if (resultEntry) {
            resultEntry.push(result);
          }
        }
        for (let items of finalResult) {
          await processHook(hooksObj, "Book", "adjustResults", items);
        }
        return finalResult;
      });
    }
    return context[dataLoaderName].load(obj._id || []);
  }
};

export default {
  Query: {
    async getUser(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "User");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadUsers(db, aggregationPipeline, root, args, context, ast, "User");

      return {
        User: results[0] || null
      };
    },
    async allUsers(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "Users");
      let { aggregationPipeline } = queryPacket;
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Users = await loadUsers(db, aggregationPipeline, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let $match = aggregationPipeline.find(item => item.$match);
          let countResults = await dbHelpers.runQuery(db, "users", [
            $match,
            { $group: { _id: null, count: { $sum: 1 } } }
          ]);
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async updateUser(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "User", UserMetadata, {
        update: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, UserMetadata, "User");
        let updates = await getUpdateObject(args.Updates || {}, UserMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, UserMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "users", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (await loadUsers(db, [{ $match }, { $project }, { $limit: 1 }], root, args, context, ast))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ User: result, transaction, elapsedTime: 0 });
      });
    }
  }
};
