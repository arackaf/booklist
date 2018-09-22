import { queryUtilities, processHook, dbHelpers } from "mongo-graphql-starter";
import hooksObj from "../../graphQL-custom/hooks.js";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, setUpOneToManyRelationships, setUpOneToManyRelationshipsForUpdate, getUpdateObject, constants, cleanUpResults } = queryUtilities;
import { ObjectId } from "mongodb";
import BookMetadata from "./Book";
import { loadBookSummarys } from "../BookSummary/resolver";
import BookSummaryMetadata from "../BookSummary/BookSummary";
import flatMap from "lodash.flatmap";
import DataLoader from "dataloader";

export async function loadBooks(db, queryPacket, root, args, context, ast) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    $sort ? { $sort } : null, 
    { $project },
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item);

  await processHook(hooksObj, "Book", "queryPreAggregate", aggregateItems, root, args, context, ast);
  let Books = await dbHelpers.runQuery(db, "books", aggregateItems);
  await processHook(hooksObj, "Book", "adjustResults", Books);
  Books.forEach(o => {
    if (o._id){
      o._id = "" + o._id;
    }
  });
  cleanUpResults(Books, BookMetadata);
  return Books;
}

export const Book = {
  async similarBooks(obj, args, context, ast) {
    if (context.__Book_similarBooksDataLoader == null) {
      let db = await context.__mongodb;
      context.__Book_similarBooksDataLoader = new DataLoader(async keyArrays => {
        let $match = { asin: { $in: flatMap(keyArrays || [], ids => ids.map(id => "" + id)) } };
        let queryPacket = decontructGraphqlQuery(args, ast, BookSummaryMetadata, constants.useCurrentSelectionSet, { force: ["asin"] });
        let { $project, $sort, $limit, $skip } = queryPacket;
        
        let aggregateItems = [
          { $match }, 
          $sort ? { $sort } : null,
          { $project },
        ].filter(item => item);
        let results = await dbHelpers.runQuery(db, "amazonReference", aggregateItems);
        cleanUpResults(results, BookSummaryMetadata);

        let finalResult = keyArrays.map(keyArr => []);
        let keySets = keyArrays.map(keyArr => new Set(keyArr.map(asin => "" + asin)));

        for (let result of results){
          for (let i = 0; i < keyArrays.length; i++){
            if (keySets[i].has(result.asin + "")){
              finalResult[i].push(result);
            }
          }
        }
        return finalResult;
      });
    }
    return context.__Book_similarBooksDataLoader.load(obj.similarItems || []);
  }

}

export default {
  Query: {
    async getBook(root, args, context, ast) {
      await processHook(hooksObj, "Book", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookMetadata, "Book");
      await processHook(hooksObj, "Book", "queryMiddleware", queryPacket, root, args, context, ast);
      let results = await loadBooks(db, queryPacket, root, args, context, ast);

      return {
        Book: results[0] || null
      };
    },
    async allBooks(root, args, context, ast) {
      await processHook(hooksObj, "Book", "queryPreprocess", root, args, context, ast);
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let queryPacket = decontructGraphqlQuery(args, ast, BookMetadata, "Books");
      await processHook(hooksObj, "Book", "queryMiddleware", queryPacket, root, args, context, ast);
      let result = {};

      if (queryPacket.$project) {
        result.Books = await loadBooks(db, queryPacket, root, args, context, ast);
      }

      if (queryPacket.metadataRequested.size) {
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")) {
          let countResults = await dbHelpers.runQuery(db, "books", [{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }]);  
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    }
  },
  Mutation: {
    async createBook(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let newObject = await newObjectFromArgs(args.Book, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      let requestMap = parseRequestedFields(ast, "Book");
      let $project = requestMap.size ? getMongoProjection(requestMap, BookMetadata, args) : null;

      if ((newObject = await dbHelpers.processInsertion(db, newObject, { typeMetadata: BookMetadata, hooksObj, root, args, context, ast })) == null) {
        return { Book: null };
      }
      await setUpOneToManyRelationships(newObject, args.Book, BookMetadata, { db, hooksObj, root, args, context, ast });
      let result = $project ? (await loadBooks(db, { $match: { _id: newObject._id }, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        success: true,
        Book: result
      }
    },
    async updateBook(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery(args._id ? { _id: args._id } : {}, ast, BookMetadata, "Book");
      let updates = await getUpdateObject(args.Updates || {}, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Book", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { Book: null };
      }
      if (!$match._id) {
        throw "No _id sent, or inserted in middleware";
      }
      await setUpOneToManyRelationshipsForUpdate([args._id], args, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "books", $match, updates);
      await processHook(hooksObj, "Book", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? (await loadBooks(db, { $match, $project, $limit: 1 }, root, args, context, ast))[0] : null;
      return {
        Book: result,
        success: true
      };
    },
    async updateBooks(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      context.__mongodb = db;
      let { $match, $project } = decontructGraphqlQuery({ _id_in: args._ids }, ast, BookMetadata, "Books");
      let updates = await getUpdateObject(args.Updates || {}, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Book", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await setUpOneToManyRelationshipsForUpdate(args._ids, args, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });
      await dbHelpers.runUpdate(db, "books", $match, updates, { multi: true });
      await processHook(hooksObj, "Book", "afterUpdate", $match, updates, root, args, context, ast);
      
      let result = $project ? await loadBooks(db, { $match, $project }, root, args, context, ast) : null;
      return {
        Books: result,
        success: true
      };
    },
    async updateBooksBulk(root, args, context, ast) {
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let { $match } = decontructGraphqlQuery(args.Match, ast, BookMetadata);
      let updates = await getUpdateObject(args.Updates || {}, BookMetadata, { db, dbHelpers, hooksObj, root, args, context, ast });

      if (await processHook(hooksObj, "Book", "beforeUpdate", $match, updates, root, args, context, ast) === false) {
        return { success: true };
      }
      await dbHelpers.runUpdate(db, "books", $match, updates, { multi: true });
      await processHook(hooksObj, "Book", "afterUpdate", $match, updates, root, args, context, ast);

      return { success: true };
    },
    async deleteBook(root, args, context, ast) {
      if (!args._id) {
        throw "No _id sent";
      }
      let db = await (typeof root.db === "function" ? root.db() : root.db);
      let $match = { _id: ObjectId(args._id) };
      
      if (await processHook(hooksObj, "Book", "beforeDelete", $match, root, args, context, ast) === false) {
        return false;
      }
      await dbHelpers.runDelete(db, "books", $match);
      await processHook(hooksObj, "Book", "afterDelete", $match, root, args, context, ast);
      return true;
    }
  }
};