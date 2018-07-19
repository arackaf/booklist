import moment from "moment";
import path from "path";
import fs from "fs";
import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

function saveLocalImageToS3(imgPath, userId) {
  return new Promise((res, rej) => {
    fs.readFile("." + imgPath, (err, data) => {
      if (err) return rej(err);

      let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } }),
        params = {
          Key: `bookCovers/${userId || "generic"}/${path.basename(imgPath)}`,
          Body: data
        };

      s3bucket.upload(params, function(err) {
        if (err) rej(err);
        else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
      });
    });
  });
}

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
  async queryPreprocess(root, args, context, ast) {
    args.userId = "573d1b97120426ef0078aa92";
    if (!args.PAGE_SIZE || args.PAGE_SIZE > 200) {
      //bump it so we know if there's more results to page
      args.PAGE_SIZE = 50;
    }
    if (!args.PAGE) {
      args.PAGE = 1;
    }

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
  queryMiddleware(queryPacket, root, args, context, ast) {
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
  queryPreAggregate(aggregateItems, root, args, context, ast) {
    let project = aggregateItems.find(item => item.$project);
    let sort = aggregateItems.find(item => item.$sort);

    if (sort && sort.$sort.titleLower) {
      aggregateItems.splice(aggregateItems.indexOf(sort), 1);
      aggregateItems.splice(aggregateItems.indexOf(project), 1);

      aggregateItems.splice(1, 0, project, sort);
    }
  }
  async beforeInsert(book, root, args, context, ast) {
    clean(book);
    if (book.smallImage && /^\/uploads\//.test(book.smallImage)) {
      book.smallImage = await saveLocalImageToS3(book.smallImage, context.user.id);
    }
    if (!book.subjects) {
      book.subjects = [];
    }
    if (!book.tags) {
      book.tags = [];
    }
    book.userId = context.user.id;
  }
  afterInsert(newObj, root, args, context, ast) {}
  async beforeUpdate(match, updates, root, args, context, ast) {
    if (updates.$set) {
      clean(updates.$set);
    }
    match.userId = context.user.id;
    if (updates.$set && updates.$set.smallImage && /^\/uploads\//.test(updates.$set.smallImage)) {
      updates.$set.smallImage = await saveLocalImageToS3(updates.$set.smallImage, context.user.id);
    }
  }
  afterUpdate(match, updates, root, args, context, ast) {}
  beforeDelete(match, root, args, context, ast) {
    match.userId = context.user.id;
  }
  afterDelete(match, root, args, context, ast) {}
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

      if (Array.isArray(book.editorialReviews)) {
        book.editorialReviews = book.editorialReviews.map(entry => ({
          content: entry.Content || entry.content,
          source: entry.Source || entry.source
        }));
      }
    });
  }
}
