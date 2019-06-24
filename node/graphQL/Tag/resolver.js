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
const runHook = processHook.bind(this, hooksObj, "Tag");
const { decontructGraphqlQuery, cleanUpResults } = queryUtilities;
const { setUpOneToManyRelationships, newObjectFromArgs } = insertUtilities;
const { getMongoProjection, parseRequestedFields } = projectUtilities;
const { getUpdateObject, setUpOneToManyRelationshipsForUpdate } = updateUtilities;
import { ObjectId } from "mongodb";
import TagMetadata from "./Tag";

export async function loadTags(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match },
    $sort ? { $sort } : null,
    { $project },
    $skip != null ? { $skip } : null,
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Tag", "queryPreAggregate", aggregateItems, { db, root, args, context, ast });
  let Tags = await dbHelpers.runQuery(db, "tags", aggregateItems);
  await processHook(hooksObj, "Tag", "adjustResults", Tags);
  Tags.forEach(o => {
    if (o._id) {
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Tags, TagMetadata);
  return Tags;
}

export const Tag = {};

export default {
  Query: {
    async getTag(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagMetadata, "Tag");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let results = await loadTags(db, queryPacket, root, args, context, ast);

      return {
        Tag: results[0] || null
      };
    },
    async allTags(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      await runHook("queryPreprocess", { db, root, args, context, ast });
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, TagMetadata, "Tags");
      await runHook("queryMiddleware", queryPacket, { db, root, args, context, ast });
      let result = {};

      if (queryPacket.$project) {
        result.Tags = await loadTags(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "tags", [
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
    async createTag(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Tag", TagMetadata, {
        create: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let newObject = await newObjectFromArgs(args.Tag, TagMetadata, { ...gqlPacket, db, session });
        let requestMap = parseRequestedFields(ast, "Tag");
        let $project = requestMap.size ? getMongoProjection(requestMap, TagMetadata, args) : null;

        newObject = await dbHelpers.processInsertion(db, newObject, {
          ...gqlPacket,
          typeMetadata: TagMetadata,
          session
        });
        if (newObject == null) {
          return { Tag: null, success: false };
        }
        await setUpOneToManyRelationships(newObject, args.Tag, TagMetadata, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (await loadTags(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ Tag: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTag(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Tag", TagMetadata, {
        update: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, TagMetadata, "Tag");
        let updates = await getUpdateObject(args.Updates || {}, TagMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        if (!$match._id) {
          throw "No _id sent, or inserted in middleware";
        }
        await setUpOneToManyRelationshipsForUpdate([args._id], args, TagMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "tags", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project
          ? (await loadTags(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0]
          : null;
        return resolverHelpers.mutationSuccessResult({ Tag: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTags(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Tag", TagMetadata, {
        update: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, TagMetadata, "Tags");
        let updates = await getUpdateObject(args.Updates || {}, TagMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        await setUpOneToManyRelationshipsForUpdate(args._ids, args, TagMetadata, { ...gqlPacket, db, session });
        await dbHelpers.runUpdate(db, "tags", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });
        await resolverHelpers.mutationComplete(session, transaction);

        let result = $project ? await loadTags(db, { $match, $project }, root, args, context, ast) : null;
        return resolverHelpers.mutationSuccessResult({ Tags: result, transaction, elapsedTime: 0 });
      });
    },
    async updateTagsBulk(root, args, context, ast) {
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Tag", TagMetadata, {
        update: true
      });
      return await resolverHelpers.runMutation(session, transaction, async () => {
        let { $match } = decontructGraphqlQuery(args.Match, ast, TagMetadata);
        let updates = await getUpdateObject(args.Updates || {}, TagMetadata, { ...gqlPacket, db, session });

        if ((await runHook("beforeUpdate", $match, updates, { ...gqlPacket, db, session })) === false) {
          return resolverHelpers.mutationCancelled({ transaction });
        }
        await dbHelpers.runUpdate(db, "tags", $match, updates, { session });
        await runHook("afterUpdate", $match, updates, { ...gqlPacket, db, session });

        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      });
    },
    async deleteTag(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let gqlPacket = { root, args, context, ast, hooksObj };
      let { db, session, transaction } = await resolverHelpers.startDbMutation(gqlPacket, "Tag", TagMetadata, {
        delete: true
      });
      try {
        let $match = { _id: ObjectId(args._id) };

        if ((await runHook("beforeDelete", $match, { ...gqlPacket, db, session })) === false) {
          return { success: false };
        }
        await dbHelpers.runDelete(db, "tags", $match);
        await runHook("afterDelete", $match, { ...gqlPacket, db, session });
        return await resolverHelpers.finishSuccessfulMutation(session, transaction);
      } catch (err) {
        await resolverHelpers.mutationError(err, session, transaction);
        return { success: false };
      } finally {
        resolverHelpers.mutationOver(session);
      }
    }
  }
};
