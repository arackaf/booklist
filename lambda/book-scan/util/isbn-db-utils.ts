import { toUtf8 } from "@aws-sdk/util-utf8-node";

import { getOpenLibraryCoverUri } from "./bookCoverHelpers";
import { IS_DEV } from "./environment";
import { invoke } from "./invokeLambda";
import { getSecrets } from "./getSecrets";
import { ScanItem } from "./data-helpers";

const COVER_PROCESSING_LAMBDA = `process-book-cover-${IS_DEV ? "dev" : "live"}-processCover`;

type ImageData = {
  mobileImage: string;
  mobileImagePreview: any;
  smallImage: string;
  smallImagePreview: any;
  mediumImage: string;
  mediumImagePreview: any;
};

const getEmptyImageData = (): ImageData => ({
  mobileImage: "",
  mobileImagePreview: null,
  smallImage: "",
  smallImagePreview: null,
  mediumImage: "",
  mediumImagePreview: null
});

export async function finishBookInfo(book, userId) {
  console.log("Processing:", JSON.stringify(book));

  let isbn = book.isbn13 || book.isbn;

  let imageData: ImageData = getEmptyImageData();
  if (book.image) {
    console.log("Processing image");
    try {
      let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: book.image, userId });
      let bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));

      console.log("Book covers from ISBN DB", bookCoverResults);

      if (bookCoverResults == null) {
        console.log("No book covers from ISBN DB");
        let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: getOpenLibraryCoverUri(isbn), userId });
        bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));

        console.log("Book covers from OpenLibrary", bookCoverResults);
      }

      if (bookCoverResults != null) {
        Object.assign(imageData, bookCoverResults);
      }
    } catch (err) {
      console.log("Error processing image", err);
    }
  }

  const newBook = {
    title: book.title || book.title_long,
    isbn,
    ean: "",
    pages: book.pages,
    ...imageData,
    publicationDate: book.date_published, // TODO
    publisher: book.publisher,
    authors: book.authors || [],
    editorialReviews: [],
    subjects: [],
    userId
  };

  if (book.synopsys) {
    newBook.editorialReviews.push({
      source: "Synopsys",
      content: book.synopsys
    });
  }
  if (book.synopsis) {
    newBook.editorialReviews.push({
      source: "Synopsis",
      content: book.synopsis
    });
  }

  if (book.overview) {
    newBook.editorialReviews.push({
      source: "Overview",
      content: book.overview
    });
  }

  return newBook;
}

export const isbnDbLookup = async (scanItems: ScanItem[]) => {
  const secrets = await getSecrets();
  const isbnDbKey = secrets["isbn-db-key"];

  const isbns = [...new Set(scanItems.map(entry => entry.isbn))].join(",");

  console.log("---- BOOK LOOKUP STARTING ----", isbns);

  const isbnDbResponse = await fetch(`https://api2.isbndb.com/books`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: isbnDbKey
    },
    body: `isbns=${isbns}`
  });
  const json: any = await isbnDbResponse.json();

  const allResults = Array.isArray(json?.data) ? json.data : [];
  return allResults;
};
