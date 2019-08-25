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
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import UserMetadata from "./User";
import { loadBooks } from "../Book/resolver";
import BookMetadata from "../Book/Book";
import flatMap from "lodash.flatmap";
import DataLoader from "dataloader";

export async function loadUsers(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match },
    $sort ? { $sort } : null,
    { $project },
    $skip != null ? { $skip } : null,
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "User", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Users = await dbHelpers.runQuery(db, "users", aggregateItems);
  await processHook(hooksObj, "User", "adjustResults", Users);
  Users.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Users, UserMetadata);
  return Users;
}

export const User = {
  async books(obj, args, context, ast) {
    if (context.__User_booksDataLoader == null) {
      let db = await context.__mongodb;
      context.__User_booksDataLoader = new DataLoader(async keys => {
        let $match = { userId: { $in: keys.filter(id => id).map(id => "" + id) } };
        let queryPacket = decontructGraphqlQuery(args, ast, BookMetadata, null, { force: ["userId"] });
        let { $project, $sort, $limit, $skip } = queryPacket;

        let aggregateItems = [{ $match }, $sort ? { $sort } : null, { $project }].filter(item => item);
        let results = await dbHelpers.runQuery(db, "books", aggregateItems);
        cleanUpResults(results, BookMetadata);
        let finalResult = keys.map(keyArr => []);

        for (let result of results) {
          let keyLookup = new Set([result.userId + ""]);
          for (let i = 0; i < keys.length; i++) {
            if (keyLookup.has("" + keys[i])) {
              finalResult[i].push(result);
            }
          }
        }
        return finalResult;
      });
    }
    return context.__User_booksDataLoader.load(obj._id || []);
  }
};

export default {
  Query: {
    async getUser(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "User");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadUsers(db, queryPacket, root, args, context, ast);

      return {
        User: results[0] || null
      };
    },
    async allUsers(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, UserMetadata, "Users");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Users = await loadUsers(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "users", [
            { $match: queryPacket.$match },
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
          ? (await loadUsers(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ User: result, transaction, elapsedTime: 0 });
      });
    }
  }
};
