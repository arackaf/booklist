const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

type SnapshotResult = {
  isbn10: string | null;
  isbn13: string | null;
  rating: number | null;
  reviewsCount: number | null;
};

export const pollForSnapshot = async (snapshotId: string, apiKey: string): Promise<SnapshotResult[]> => {
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
      })
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []));

      console.log("Snapshot data:", snapshotData);

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
    }

    throw new Error("Snapshot failed with status: " + progress.status);
  }

  throw new Error("Snapshot timed out");
};

const getProductDetailData = (type: string, productDetails: { type: string; value: any }[]) => {
  const productDetail = productDetails.find(detail => detail.type === type);
  return productDetail ? productDetail.value : null;
};
