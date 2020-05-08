import { controller } from "easy-express-controllers";
import bookEntryQueueManager from "../app-helpers/bookEntryQueueManager";

const { graphql } = require("graphql");
import { executableSchema, root } from "../../startApp";

import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

import orderBy from "lodash.orderby";
import request from "request";
import path from "path";
import uuid from "uuid/v4";

import findBooksQuery from "../graphql-queries/findBooks";
import findRecommendationQuery from "../graphql-queries/findRecommendations";
import findRecommendationMatches from "../graphql-queries/findRecommendationMatches";

import { downloadBookCover, removeFile, resizeIfNeeded, saveCoverToS3 } from "../util/bookCovers/bookCoverHelpers";

import { ObjectId } from "mongodb";
import { getDbConnection } from "../util/dbUtils";

import Jimp from "jimp";

function downloadBookCoverLocal(url, minSizeToAccept) {
  console.log("A", url);
  debugger;
  let ext = path.extname(url) || ".jpg";

  console.log("B");
  let uniqueId = uuid();
  console.log("C");
  let fileName = "file-" + uniqueId + ext;
  console.log("D");
  let fullName = path.resolve("./conversions/" + fileName);
  console.log("E");

  return new Promise(res => {
    //mkdirp.sync(path.resolve("./conversions"));
    //let file = fs.createWriteStream(fullName);

    console.log("F");
    request({ uri: url, encoding: null }, function(err, resp, body) {
      console.log("G"); //, { err, resp, body });
      try {
        console.log(body.length);
      } catch (er) {
        console.log("err", er);
      }
      res(body);
    });
  }).catch(err => err);
}

//     .pipe(file)
//       .on("finish", () => {
//         file.close();

//         let stats = fs.statSync(fullName);
//         let fileSizeInBytes = stats.size;

//         if (fileSizeInBytes < minSizeToAccept) {
//           removeFile(fullName);
//           res(null);
//         }

//         fs.readFile(fullName, (err, data) => {
//           if (err) {
//             removeFile(fullName);

//             return res(null);
//           }
//           res({ fullName, fileName });
//         });
//       })
//       .on("error", () => {
//         removeFile(fullName);

//         res(null);
//       });
//   });
// }

class BookController {
  async saveFromIsbn({ isbn }) {
    const userId = this.request.user.id;

    try {
      let addingItem = { userId, isbn };
      await bookEntryQueueManager.addPendingBook(userId, addingItem);

      this.send({ success: true });
    } catch (er) {
      this.send({ failure: true });
    }
  }
  async getRecommendations(params) {
    try {
      let userId = params.publicUserId || this.request.user.id;

      let resp = await graphql(executableSchema, findBooksQuery, root, this.request, { ids: params.bookIds, publicUserId: params.publicUserId });
      let books = resp.data.allBooks.Books;
      let isbnMap = new Map([]);
      books.forEach(book => {
        (book.similarItems || []).forEach(isbn => {
          if (!isbnMap.has(isbn)) {
            isbnMap.set(isbn, 0);
          }
          isbnMap.set(isbn, isbnMap.get(isbn) + 1);
        });
      });

      let isbns = [...isbnMap.keys()];

      let results = await graphql(executableSchema, findRecommendationQuery, root, this.request, { isbns });
      let resultRecommendations = results.data.allBookSummarys.BookSummarys;
      let resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.isbn, b]));
      let isbnsOrdered = orderBy(
        [...isbnMap.entries()].map(([isbn, count]) => ({ isbn, count })),
        ["count"],
        ["desc"]
      );
      let potentialRecommendations = isbnsOrdered.map(b => resultRecommendationLookup.get(b.isbn)).filter(b => b);

      let potentialIsbns = potentialRecommendations.map(b => b.isbn).filter(x => x);

      let matches = (
        await graphql(executableSchema, findRecommendationMatches, root, this.request, {
          userId,
          isbns: potentialIsbns
        })
      ).data.allBooks.Books;

      let matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));
      let matchingEans = new Set(matches.map(m => m.ean).filter(x => x));

      let finalResults = potentialRecommendations.filter(m => (!m.isbn || !matchingIsbns.has(m.isbn)) && (!m.ean || !matchingEans.has(m.ean)));

      this.send({ results: finalResults });
    } catch (err) {
      console.log("err", err);
    }
  }
  async newSmallImage({ _id, url }) {
    this.sizeAndSetImage({ _id, url, width: 50, imgKey: "smallImage" });
  }
  async newMediumImage({ _id, url }) {
    this.sizeAndSetImage({ _id, url, width: 106, imgKey: "mediumImage" });
  }
  async sizeAndSetImage({ _id, url, imgKey, width }) {
    try {
      var userId = this.request.user.id;
      var fileBody = await downloadBookCoverLocal(url, 750);
      console.log("00");

      if (!fileBody) {
        console.log("01");
        this.send({ failure: true, msg: "failure during download" });
      }
    } catch (err2) {
      console.log("02");
      this.send({ err2 });
    }

    console.log("03");
    //return new Promise(res => {
    try {
      debugger;
      Jimp.read(fileBody, (err, image) => {
        console.log(1);
        if (err || !image) {
          console.log(2);
          return this.send({ err, image });
          //return res(null);
        }

        try {
          console.log(3);
          //image.exifRotate();
          console.log(4);
          if (image.bitmap.width > width) {
            console.log(5);
            image.resize(width, Jimp.AUTO);
            console.log(6);

            image.getBuffer(image.getMIME(), (err, body) => {
              console.log(7);
              if (err) {
                console.log(8);
                return this.send({ err });
                // return res(CorsResponse({ error: true, message: err }));
              }

              console.log(9);
              debugger;
              let s3bucket = new AWS.S3({ params: { Bucket: "my-library-cover-uploads" } });

              let params = {
                Key: `__NEW_TEST__/junk_fileName`,
                Body: body
              };

              try {
                debugger;
                s3bucket.upload(params, function(err) {
                  debugger;
                  console.log(params, err);
                  if (err) this.send({ err });
                  else this.send({ url: `https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}` });
                });
              } catch (a) {
                console.log({ aws_error: a });
              }

              //let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId}/${fileName}`);
              //return res(uploadToS3(newName, body));
            });

            //image.write(resizedDestination, err => {
            //if (err) {
            //return res(null);
            //}
            //res(resizedDestination);
            //});
          } else {
            //return res(pathToFileUploaded);
          }
        } catch (err) {
          this.send({ err });
          //return res(null);
        }
        // });
      });
    } catch (error) {
      console.log(999);
      console.log({ error });
    }

    //let { fileName, fullName } = res;
    //let newPath = await resizeIfNeeded(fileName, width);

    //if (!newPath) {
    //this.send({ failure: true, msg: "failure during resize" });
    //}

    //let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId}/${fileName}`);

    //removeFile(fullName);
    //removeFile(newPath);

    // this.send({ url: s3Key });
    this.send({});
  }
}
controller({ defaultVerb: "post" })(BookController);

export default BookController;
