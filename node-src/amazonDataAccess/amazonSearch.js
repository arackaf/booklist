import uuid from "uuid/v4";
import del from "del";

var awsCredentials = {
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  assocId: process.env.ASSOC_ID
};

var OperationHelper = require("apac").OperationHelper,
  opHelper = new OperationHelper(awsCredentials),
  { nodeCallback } = require("../app-helpers/nodeHelpers.js");

export default class AmazonSearch {
  constructor() {}
  lookupBook(isbn, userId) {
    return new Promise(function(resolve, reject) {
      opHelper
        .execute("ItemLookup", {
          SearchIndex: "Books",
          IdType: "ISBN",
          ResponseGroup: "ItemAttributes,EditorialReview,Images",
          ItemId: isbn
        })
        .then(({ result }) => {
          if (
            !result.ItemLookupResponse ||
            !result.ItemLookupResponse.Items ||
            !result.ItemLookupResponse.Items.Item ||
            !result.ItemLookupResponse.Items.Item.ItemAttributes
          ) {
            let itemsArray = result.ItemLookupResponse.Items.Item;

            if (Array.isArray(itemsArray)) {
              //multiple sent back - pick the best
              let books = itemsArray.filter(i => {
                if (!i.ItemAttributes) return false;
                let binding = ("" + i.ItemAttributes.Binding).toLowerCase();
                return binding == "paperback" || binding == "hardcover";
              });
              if (books.length === 1) {
                resolve(projectResponse(books[0], userId));
              } else if (books.length === 0) {
                resolve({ failure: true });
              } else {
                //merge them I guess
                let item = {
                  ItemAttributes: books.reduce((attrs, item) => Object.assign(attrs, item.ItemAttributes || {}), {}),
                  EditorialReviews: books[0].EditorialReviews
                };

                item.SmallImage = books.map(item => item.SmallImage).find(s => s);
                item.MediumImage = books.map(item => item.MediumImage).find(m => m);

                for (let i = 1; i < books.length; i++) {
                  if (editorialReviewsCount(books[i]) > editorialReviewsCount(item.EditorialReviews)) {
                    item.EditorialReviews = books[i].EditorialReviews;
                  }
                }

                resolve(projectResponse(item, userId));

                function editorialReviewsCount(EditorialReviews) {
                  if (!EditorialReviews || !EditorialReviews.EditorialReview) return 0;
                  if (typeof EditorialReviews.EditorialReview === "object") {
                    return 1;
                  } else if (Array.isArray(EditorialReviews.EditorialReview)) {
                    return EditorialReviews.EditorialReview.length;
                  }
                  return 0;
                }
              }
            } else {
              resolve({ failure: true });
            }
          } else {
            resolve(projectResponse(result.ItemLookupResponse.Items.Item, userId));
          }
        })
        .catch(err => {
          resolve({ failure: true });
        });
    });
  }
}

async function projectResponse(item, userId) {
  let attributes = item.ItemAttributes;
  let result = {
    title: safeAccess(attributes, "Title"),
    isbn: safeAccess(attributes, "ISBN"),
    ean: safeAccess(attributes, "EAN"),
    pages: +safeAccess(attributes, "NumberOfPages") || undefined,
    smallImage: safeAccess(safeAccessObject(item, "SmallImage"), "URL"),
    mediumImage: safeAccess(safeAccessObject(item, "MediumImage"), "URL"),
    publicationDate: safeAccess(attributes, "PublicationDate"),
    publisher: safeAccess(attributes, "Publisher"),
    authors: safeArray(attributes, attributes => attributes.Author),
    editorialReviews: safeArray(item, item => item.EditorialReviews.EditorialReview)
  };

  if (typeof result.pages === "undefined") {
    delete result.pages;
  }

  if (/^http:\/\//.test(result.smallImage)) {
    try {
      let newImage = await convertFile(result.smallImage, userId);
      result.smallImage = newImage;
    } catch (e) {}
  }

  return result;

  function safeArray(item, lambda) {
    try {
      let val = lambda(item);
      if (!val) {
        return [];
      } else if (Array.isArray(val)) {
        return val;
      } else {
        return [val];
      }
    } catch (err) {
      return [];
    }
  }

  function safeAccess(obj, path) {
    return obj[path] || "";
  }

  function safeAccessObject(obj, path) {
    return obj[path] || {};
  }
}

function convertFile(url, userId) {
  return new Promise((res, rej) => {
    let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });
    let ext = path.extname(url);
    let uniqueId = uuid();
    let fileName = "file-" + uniqueId + ext;
    let file = fs.createWriteStream(fileName);
    let fullName = "./conversions/" + fileName;

    request(url)
      .pipe(file)
      .on("finish", () => {
        file.close();

        fs.readFile(fullName, (err, data) => {
          if (err) {
            return rej(err);
          }
          let params = {
            Key: `bookCovers/${userId}/converted-cover-${uniqueId}${ext}`,
            Body: data
          };

          s3bucket.upload(params, function(err) {
            try {
              del.sync(fullName);
            } catch (e) {}

            if (err) rej(err);
            else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
          });
        });
      });
  });
}
