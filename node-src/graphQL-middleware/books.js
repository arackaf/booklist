import moment from "moment";

export default class BooksMiddleware {
  async queryPreprocess(root, args, context, ast) {
    args.userId = args.publicUserId || context.user.id;
    if (args.PAGE_SIZE > 100) {
      args.PAGE_SIZE = 100; //don't allow user to request too much data
    }
    //bump it so we know if there's more results to page
    args.PAGE_SIZE++;

    let subjects = args.subjects_containsAny || [];
    if (args.searchChildSubjects && subjects.length) {
      let db = await root.db;
      let allPaths = subjects.map(s => `,${s},`).join("|");
      let childIds = (await db
        .collection("subjects")
        .find({ path: { $regex: allPaths } /*, userId: userIdToUse*/ }, { _id: 1 })
        .toArray()).map(o => "" + o._id);

      subjects.push(...childIds);
    }
  }
  queryMiddleware(queryPacket, root, args, context, ast) {
    let { $project, $sort } = queryPacket;
    $project.titleLower = { $toLower: "$title" };
    if (typeof $sort.title !== "undefined") {
      $sort.titleLower = $sort.title;
      delete $sort.title;
    }
  }
  beforeInsert(objToBeInserted, root, args, context, ast) {}
  afterInsert(newObj, root, args, context, ast) {}
  beforeUpdate(match, updates, root, args, context, ast) {}
  afterUpdate(match, updates, root, args, context, ast) {}
  beforeDelete(match, root, args, context, ast) {}
  afterDelete(match, root, args, context, ast) {}
  adjustResults(results) {
    results.forEach(book => {
      book.dateAdded = +book._id.getTimestamp();
      if (/\d{4}-\d{2}-\d{2}/.test(book.publicationDate)) {
        book.publicationDate = moment(book.publicationDate).format("MMMM Do YYYY");
      }
      if (/http:\/\/my-library-cover-uploads/.test(book.smallImage)) {
        book.smallImage =
          "https://s3.amazonaws.com/my-library-cover-uploads/" +
          book.smallImage.replace(/http:\/\/my-library-cover-uploads.s3-website-us-east-1.amazonaws.com\//, "");
      }
    });
  }
}
