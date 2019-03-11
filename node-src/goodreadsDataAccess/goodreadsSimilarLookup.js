import request from "request";
import uuid from "uuid/v4";
import del from "del";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import flatMap from "lodash.flatmap";

var parseString = require("xml2js").parseString;
const grKey = process.env.GOODREADS_KEY;

export default class GoodreadsSimilarityLookup {
  lookupBook(isbn) {
    return new Promise(function(resolve, reject) {
      if (!isbn) {
        return resolve([]);
      }

      request(`https://www.goodreads.com/book/isbn/${isbn}?format=xml&key=${grKey}`, {}, (err, res, body) => {
        err && resolve([]);

        try {
          parseString(body, (err, result) => {
            try {
              err && resolve([]);

              let book = result.GoodreadsResponse && result.GoodreadsResponse.book && result.GoodreadsResponse.book[0];
              if (!book) {
                resolve([]);
              }

              let similarBooks = book.similar_books && book.similar_books[0] && book.similar_books[0].book;
              if (!Array.isArray(similarBooks)) {
                resolve([]);
              }
              resolve(similarBooks.map(projectResponse).filter(x => x));
            } catch (er) {
              resolve([]);
            }
          });
        } catch (er) {
          resolve([]);
        }
      });
    });
  }
}

function projectResponse(book) {
  try {
    let authorsRaw = book.authors;
    let authors = [];
    if (Array.isArray(authorsRaw)) {
      try {
        authors = flatMap(authorsRaw, a => flatMap(a.author || [], a => a.name));
      } catch (er) {
        authors = [];
      }
    }

    return {
      title: safeItem(book, "title"),
      isbn: safeItem(book, "isbn"),
      smallImage: safeItem(book, "small_image_url"),
      mediumImage: safeItem(book, "image_url"),
      authors
    };
  } catch (er) {
    return null;
  }
}

function safeItem(obj, path, fallback = "") {
  let val = obj[path] && obj[path][0];
  return val == null ? fallback : val;
}
