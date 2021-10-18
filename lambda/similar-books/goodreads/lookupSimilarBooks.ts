import fetch from "node-fetch";
import { parseString } from "xml2js";

export async function lookupSimilarBooks(isbn, grKey): Promise<any[]> {
  if (!isbn) {
    return [];
  }

  try {
    const raw = await fetch(`https://www.goodreads.com/book/isbn/${isbn}?format=xml&key=${grKey}`);
    const resp = await raw.text();

    return new Promise(function (resolve, reject) {
      parseString(resp, (err, result) => {
        try {
          err && resolve([]);

          let book = result?.GoodreadsResponse?.book?.[0];
          if (!book) {
            resolve([]);
          }

          let similarBooks = book.similar_books?.[0]?.book;
          if (!Array.isArray(similarBooks)) {
            resolve([]);
          }
          resolve(similarBooks.map(projectResponse).filter(x => x));
        } catch (er) {
          resolve([]);
        }
      });
    });
  } catch (er) {
    console.log("ERROR", er);
    return [];
  }
}

function projectResponse(book) {
  try {
    let authorsRaw = book.authors;
    let authors = [];
    if (Array.isArray(authorsRaw)) {
      try {
        authors = authorsRaw.flatMap(a => (a.author || []).flatMap(a => a.name));
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
