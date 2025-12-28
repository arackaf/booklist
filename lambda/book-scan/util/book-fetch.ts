import { toUtf8 } from "@aws-sdk/util-utf8-node";

import { getOpenLibraryCoverUri } from "./bookCoverHelpers";
import { IS_DEV } from "./environment";
import { invoke } from "./invokeLambda";
import { getSecrets } from "./getSecrets";
import { ScanItem } from "./data-helpers";
import { EditorialReview } from "../drizzle/types";
import { isbn13To10 } from "./isbn13to10";

const COVER_PROCESSING_LAMBDA = `process-book-cover-${IS_DEV ? "dev" : "live"}-processCover`;

export type BookLookupResult = {
  title: string;
  pages: number | null;
  authors: string[];
  isbn: string | null;
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

export const brightDataLookup = async (scanItems: ScanItem[]): Promise<BookLookupResult[]> => {
  const secrets = await getSecrets();
  const BRIGHT_DATA_API_KEY = secrets["bright-data-key"];
  const isbns = [...new Set(scanItems.map(entry => isbn13To10(entry.isbn)))];

  const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
    method: "POST",
    body: JSON.stringify(isbns.map(isbn => ({ url: `https://www.amazon.com/dp/${isbn}` }))),
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  const { snapshot_id } = resp;

  console.log("Snapshot ID Found:", snapshot_id);

  if (!snapshot_id) {
    throw new Error("No snapshot ID");
  }

  return pollForSnapshot(snapshot_id, BRIGHT_DATA_API_KEY);
};

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const getProductDetailData = (type: string, productDetails: { type: string; value: any }[]) => {
  const productDetail = productDetails.find(detail => detail.type === type);
  return productDetail ? productDetail.value : null;
};

const pollForSnapshot = async (snapshotId: string, BRIGHT_DATA_API_KEY: string): Promise<BookLookupResult[]> => {
  for (let i = 0; i < 20; i++) {
    await wait(i < 20 ? 5000 : 10000);

    const progress = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    console.log("Snapshot Progress:", progress);
    if (progress.status === "running") {
      continue;
    }

    if (progress.status === "ready") {
      const snapshotData = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []));

      console.log("Snapshot Data:", snapshotData);

      return (
        snapshotData
          .filter(item => !item.error)
          .map(book => {
            const productDetails = book.product_details ?? [];

            let pages = parseInt(getProductDetailData("Print length", productDetails));
            if (isNaN(pages)) {
              pages = null;
            }
            const publisher = getProductDetailData("Publisher", productDetails);
            const publicationDate = getProductDetailData("Publication date", productDetails);

            let isbn10 = getProductDetailData("ISBN-10", productDetails);
            let isbn13 = getProductDetailData("ISBN-13", productDetails);

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
              isbn: isbn13 || isbn10,
              isbn10,
              isbn13,
              publisher,
              publicationDate,
              image: book.images[0] ?? null,
              editorialReviews: [],
              ...getEmptyImageData()
            } satisfies BookLookupResult;
          }) ?? []
      );
    }

    throw new Error("Snapshot failed with status: " + progress.status);
  }

  throw new Error("Snapshot timed out");
};

export async function finishBookInfo(book: BookLookupResult, userId: string) {
  console.log("Processing:", JSON.stringify(book));

  let isbn = book.isbn13 || book.isbn10;

  if (book.image) {
    console.log("Processing image");
    try {
      let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: book.image, userId });
      let bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));

      if (bookCoverResults == null) {
        console.log("No book covers from Amazon. Attempting Open Library");
        let lambdaResult = await invoke(COVER_PROCESSING_LAMBDA, { url: getOpenLibraryCoverUri(isbn), userId });
        bookCoverResults = JSON.parse(toUtf8(lambdaResult.Payload));
        console.log("Processed book covers from Open Library", bookCoverResults);
      } else {
        console.log("Book covers downloaded from Amazon", bookCoverResults);
      }

      if (bookCoverResults != null) {
        Object.assign(book, bookCoverResults);
      }
    } catch (err) {
      console.log("Error processing image", err);
    }
  }
}
