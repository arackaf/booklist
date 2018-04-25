const { MongoClient } = require("mongodb");

async function foo() {
  const db = await MongoClient.connect(process.env.MONGO_CONNECTION || process.env.MONGOHQ_URL);

  console.log("starting");
  let arr = await db
    .collection("books")
    .find({})
    .toArray();

  console.log("Checking - ", arr.length);
  arr.forEach(book => {
    let edRevs = book.editorialReviews;
    if (edRevs) {
      if (!Array.isArray(edRevs)) {
        console.log(book._id, "NOT ARRAY");
      } else {
        edRevs.forEach(rev => {
          let keys = new Set(Object.keys(rev));
          //if (!keys.has("Content") || !keys.has("Source")) {
          if ((!keys.has("Content") && !keys.has("content")) || (!keys.has("Source") && !keys.has("source"))) {
            console.log(book._id, "Wrong actual entries", [...keys]);
          } else {
            //console.log(book._id, "GOOD");
          }
        });
      }
    }
  });
  console.log("DONE");
}

module.exports = foo;

/*

const checkIt = require("./node-src/maintenance/checkBookDetailsStructure");
checkIt().catch(err => {
  console.log(err);
});

*/
