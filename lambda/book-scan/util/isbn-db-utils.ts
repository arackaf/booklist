import { toUtf8 } from "@aws-sdk/util-utf8-node";

import { getOpenLibraryCoverUri } from "./bookCoverHelpers";
import { IS_DEV } from "./environment";
import { invoke } from "./invokeLambda";
import { getSecrets } from "./getSecrets";
import { ScanItem } from "./data-helpers";
import { EditorialReview } from "../drizzle/types";

const COVER_PROCESSING_LAMBDA = `process-book-cover-${IS_DEV ? "dev" : "live"}-processCover`;

type BookLookupResult = {
  title: string;
  pages: number | null;
  authors: string[];
  isbn10: string | null;
  isbn13: string | null;
  publisher: string | null;
  publicationDate: string | null;
  image: string | null;
  editorialReviews: EditorialReview[];
} & ImageData;

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

export async function finishBookInfo(book: BookLookupResult, userId: string) {
  console.log("Processing:", JSON.stringify(book));

  let isbn = book.isbn13 || book.isbn10;

  if (book.image) {
    console.log("Processing image");
    try {
      let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: book.image, userId });
      let bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));

      console.log("Book covers downloaded", bookCoverResults);

      if (bookCoverResults == null) {
        console.log("No book covers from ISBN DB");
        let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: getOpenLibraryCoverUri(isbn), userId });
        bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));

        console.log("Processed ook covers from", bookCoverResults);
        Object.assign(book, bookCoverResults);
      }
    } catch (err) {
      console.log("Error processing image", err);
    }
  }
}

export const brightDataLookup = async (scanItems: ScanItem[]): Promise<BookLookupResult[]> => {
  const secrets = await getSecrets();
  const BRIGHT_DATA_API_KEY = secrets["bright-data-key"];
  const isbns = [...new Set(scanItems.map(entry => entry.isbn))];

  const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
    method: "POST",
    body: JSON.stringify(isbns.map(isbn => ({ url: `https://www.amazon.com/dp/${isbn}` }))),
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  const { snapshot_id } = resp;

  return pollForSnapshot(snapshot_id, BRIGHT_DATA_API_KEY);
};

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const pollForSnapshot = async (snapshotId: string, BRIGHT_DATA_API_KEY: string): Promise<BookLookupResult[]> => {
  for (let i = 0; i < 20; i++) {
    await wait(5000);

    const progress = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    if (progress.status !== "running") {
      continue;
    }

    if (progress.status === "ready") {
      const snapshotData = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json());

      return snapshotData.data.map(book => {
        let pages = parseInt(book.product_info?.["Print length"], 10) ?? null;
        if (isNaN(pages)) {
          pages = null;
        }
        const publisher = book.product_info?.Publisher ?? null;
        const publicationDate = book.product_info?.["Publication date"] ?? null;

        let isbn10 = book.product_info?.["ISBN-10"] ?? null;
        let isbn13 = book.product_info?.["ISBN-13"] ?? null;

        if (isbn10) {
          isbn10 = isbn10.replace(/-/g, "");
        }
        if (isbn13) {
          isbn13 = isbn13.replace(/-/g, "");
        }

        const editorialReviews = [];

        if (book.description_html || book.description) {
          editorialReviews.push({
            source: "Description",
            content: book.description_html || book.description
          });
        }

        return {
          title: book.title ?? "",
          pages,
          authors: [book.brand],
          isbn10,
          isbn13,
          publisher,
          publicationDate,
          image: book.images[0] ?? null,
          editorialReviews: [],
          ...getEmptyImageData()
        } satisfies BookLookupResult;
      });
    }

    throw new Error("Snapshot failed with status: " + progress.status);
  }
};

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
