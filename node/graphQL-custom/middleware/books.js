import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

function clean(book) {
  let propsToTrim = ["title", "isbn", "publisher", "publicationDate"];
  propsToTrim.forEach(prop => {
    if (book.prop != null) {
      book[prop] = (book[prop] || "").substr(0, 500);
    }
  });
  if (book.authors) {
    book.authors = (book.authors || []).filter(a => a).map(a => ("" + a).substr(0, 500));
  }
}

export default class BooksMiddleware {
  async queryPreprocess({ root, args, context, ast }) {
    args.userId = args.publicUserId || (context.user && context.user.id);

    let subjects = args.subjects_containsAny || [];
    if (args.searchChildSubjects && subjects.length) {
      let db = await root.db;
      let allPaths = subjects.map(s => `,${s},`).join("|");
      let childIds = (await db
        .collection("subjects")
        .find({ path: { $regex: allPaths }, userId: args.userId }, { _id: 1 })
        .toArray()).map(o => "" + o._id);

      subjects.push(...childIds);
    }
  }
  queryMiddleware(queryPacket, { root, args, context, ast }) {
    let { $project, $sort } = queryPacket;
    if ($project.editorialReviews) {
      $project.editorialReviews = 1;
    }
    $project.titleLower = { $toLower: "$title" };
    if ($sort && typeof $sort.title !== "undefined") {
      $sort.titleLower = $sort.title;
      delete $sort.title;
    }
  }
  queryPreAggregate(aggregateItems, { root, args, context, ast }) {
    let project = aggregateItems.find(item => item.$project);
    let sort = aggregateItems.find(item => item.$sort);

    if (sort && sort.$sort.titleLower) {
      aggregateItems.splice(aggregateItems.indexOf(sort), 1);
      aggregateItems.splice(aggregateItems.indexOf(project), 1);

      aggregateItems.splice(1, 0, project, sort);
    }
  }
  async beforeInsert(book, { root, args, context, ast }) {
    clean(book);
    book.timestamp = Date.now();
    if (!book.subjects) {
      book.subjects = [];
    }
    if (!book.tags) {
      book.tags = [];
    }
    book.userId = context.user.id;
  }
  afterInsert(newObj, { root, args, context, ast }) {}
  async beforeUpdate(match, updates, { root, args, context, ast }) {
    if (updates.$set) {
      clean(updates.$set);
    } else {
      updates.$set = {};
    }
    updates.$set.timestamp = Date.now();

    match.userId = context.user.id;
  }
  afterUpdate(match, updates, { root, args, context, ast }) {}
  beforeDelete(match, { root, args, context, ast }) {
    match.userId = context.user.id;
  }
  async afterDelete(match, { root, args, context, ast }) {
    let db = await root.db;
    let ids = args._id ? [args._id] : args._ids;
    await db.collection("booksDeleted").insertMany(ids.map(_id => ({ _id, userId: context.user.id, deletedTimestamp: Date.now() })));
  }
  adjustResults(results) {
    results.forEach(book => {
      book.pages = parseInt(book.pages, 10);
      if (typeof book.pages != "number" || isNaN(book.pages)) {
        book.pages = null;
      }
      book.dateAdded = +book._id.getTimestamp();
      if (/\d{4}-\d{2}-\d{2}/.test(book.publicationDate)) {
        book.publicationDate = moment(book.publicationDate).format("MMMM Do YYYY");
      }
      if (/http:\/\/my-library-cover-uploads/.test(book.smallImage)) {
        book.smallImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.smallImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
      if (/http:\/\/my-library-cover-uploads/.test(book.mediumImage)) {
        book.mediumImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.mediumImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }

      if (Array.isArray(book.editorialReviews)) {
        book.editorialReviews = book.editorialReviews.map(entry => ({
          content: entry.Content || entry.content,
          source: entry.Source || entry.source
        }));
      }
    });
  }
}
