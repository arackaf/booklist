import { getSecrets } from "./getSecrets";

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

type RatingResult = {
  isbn10: string | null;
  isbn13: string | null;
  rating: number | null;
  reviewsCount: number | null;
};

export const getRatingsData = async (isbns: string[]): Promise<RatingResult[]> => {
  const secrets = await getSecrets();
  const BRIGHT_DATA_API_KEY = secrets["bright-data-key"];

  const snapshotId = await getBrightDataSnapshotId(
    `https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`,
    JSON.stringify(isbns.map(isbn => ({ url: `https://www.amazon.com/dp/${isbn}` })))
  );

  const snapshotResult = await pollForSnapshot(snapshotId, BRIGHT_DATA_API_KEY);
  return getRatingsDataResultFromScrapeResult(snapshotResult);
};

const getBrightDataSnapshotId = async (url: string, body: string): Promise<string> => {
  const secrets = await getSecrets();
  const BRIGHT_DATA_API_KEY = secrets["bright-data-key"];

  const resp = await fetch(url, {
    method: "POST",
    body,
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  const { snapshot_id: snapshotId } = resp;
  console.log("Snapshot ID:", snapshotId);

  if (!snapshotId) {
    throw new Error("No snapshot ID returned from Bright Data");
  }

  return snapshotId;
};

export const pollForSnapshot = async (snapshotId: string, apiKey: string): Promise<any> => {
  for (let i = 0; i < 40; i++) {
    await wait(i < 20 ? 5000 : 10000);

    const progress = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    console.log("Snapshot progress:", progress);

    if (progress.status === "running") {
      continue;
    }

    if (progress.status === "ready") {
      const snapshotData = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json());

      console.log("Snapshot data:", snapshotData);
      return snapshotData;
    }
    throw new Error("Snapshot failed with status: " + progress.status);
  }
  throw new Error("Snapshot timed out");
};

export const getRatingsDataResultFromScrapeResult = (snapshotResult: any): RatingResult[] => {
  const snapshotData = Array.isArray(snapshotResult) ? snapshotResult : [];

  return snapshotData
    .filter(item => !item.error)
    .map(item => {
      const productDetails = item.product_details ?? [];

      let isbn10 = getProductDetailData("ISBN-10", productDetails);
      let isbn13 = getProductDetailData("ISBN-13", productDetails);

      if (isbn10) isbn10 = isbn10.replace(/-/g, "");
      if (isbn13) isbn13 = isbn13.replace(/-/g, "");

      let reviewsCount: number | null = parseFloat(item.reviews_count);
      let rating: number | null = null;

      if (!reviewsCount) {
        reviewsCount = null;
      } else {
        rating = parseFloat(item.rating);
        if (!rating) {
          reviewsCount = null;
          rating = null;
        }
      }

      return { isbn10, isbn13, rating, reviewsCount };
    });
};

const getProductDetailData = (type: string, productDetails: { type: string; value: any }[]) => {
  const productDetail = productDetails.find(detail => detail.type === type);
  return productDetail ? productDetail.value : null;
};
