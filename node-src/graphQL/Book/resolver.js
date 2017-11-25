import { middleware, preprocessor, queryUtilities } from "mongo-graphql-starter";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject } = queryUtilities;
import { ObjectId } from "mongodb";
import Book from "./Book";

export async function loadBooks(db, queryPacket){
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match }, 
    { $project },
    $sort ? { $sort } : null, 
    $skip != null ? { $skip } : null, 
    $limit != null ? { $limit } : null
  ].filter(item => item)

  let Books = await db
    .collection("books")
    .aggregate(aggregateItems)
    .toArray();
  
  return Books;
}

export default {
  Query: {
    async allBooks(root, args, context, ast) {
      await preprocessor.process(root, args, context, ast);
      let db = await root.db;
      let queryPacket = await middleware.process(
        decontructGraphqlQuery(args, ast, Book, "Books"), 
        root, 
        args, 
        context, 
        ast
      );
      
      let result = {};

      if (queryPacket.$project){
        result.Books = await loadBooks(db, queryPacket);
      }

      if (queryPacket.metadataRequested.size){
        result.Meta = {};

        if (queryPacket.metadataRequested.get("count")){
          let countResults = (await db
            .collection("books")
            .aggregate([{ $match: queryPacket.$match }, { $group: { _id: null, count: { $sum: 1 } } }])
            .toArray());
            
          result.Meta.count = countResults.length ? countResults[0].count : 0;
        }
      }

      return result;
    },
    async getBook(root, args, context, ast) {
      await preprocessor.process(root, args, context, ast);
      let db = await root.db;
      let queryPacket = await middleware.process(
        decontructGraphqlQuery(args, ast, Book, "Book"), 
        root, 
        args, 
        context, 
        ast
      );

      let results = await loadBooks(db, queryPacket);

      return {
        Book: results[0] || null
      };
    }
  },
  Mutation: {
    async createBook(root, args, context, ast) {
      let db = await root.db;
      let newObject = newObjectFromArgs(args.Book, Book);
      let requestMap = parseRequestedFields(ast, "Book");
      let $project = getMongoProjection(requestMap, Book, args);
      
      await db.collection("books").insert(newObject);
      return {
        Book: (await db
          .collection("books")
          .aggregate([{ $match: { _id: newObject._id } }, { $project }, { $limit: 1 }])
          .toArray())[0]
      };
    },
    async updateBook(root, args, context, ast) {
      if (!args._id){
        throw "No _id sent";
      }
      let db = await root.db;
      let updates = getUpdateObject(args.Book || {}, Book);

      if (updates.$set || updates.$inc || updates.$push || updates.$pull) {
        await db.collection("books").update({ _id: ObjectId(args._id) }, updates);
      }

      let requestMap = parseRequestedFields(ast, "Book");
      let $project = getMongoProjection(requestMap, Book, args);
      
      return {
        Book: (await db
          .collection("books")
          .aggregate([{ $match: { _id: ObjectId(args._id) } }, { $project }, { $limit: 1 }])
          .toArray())[0]
      }
    },
    async deleteBook(root, args, context, ast) {
      if (!args._id){
        throw "No _id sent";
      }
      let db = await root.db;

      await db.collection("books").remove({ _id: ObjectId(args._id) });
      return true;
    }
  }
};