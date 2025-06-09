import { Page, type ElementHandle } from "puppeteer-core";

const CAROUSEL_PAGE_LIMIT = 4;

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type SimilarBookResult = {
  isbn: string;
  title: string;
  img: string;
  authors: string[];
};

export type RatingInfo = {
  averageReview: string | null;
  numberReviews: number | null;
};

type BookInfo = {
  isbn: string;
  title: string;
};
type ScrapeOptions = {
  scrapeSimilarBooks: boolean;
  scrapeReviewData: boolean;
};
export async function doScrape(
  page: Page,
  book: BookInfo,
  capctaDone: boolean = false,
  options: ScrapeOptions = { scrapeSimilarBooks: true, scrapeReviewData: true }
) {
  const { isbn, title } = book;
  const { scrapeSimilarBooks, scrapeReviewData } = options;

  const titleForUrl = title
    .replace(/\//g, "")
    .replace(/\s+/g, "-")
    .replace(/[^(\w-)]/g, "");

  const urlToUse = `https://www.amazon.com/${titleForUrl}/dp/${isbn}`;
  console.log("Attempting url", urlToUse);

  await page.goto(urlToUse, { waitUntil: "domcontentloaded", timeout: 60000 });

  await wait(100);

  if (!capctaDone) {
    await wait(15000);
  } else {
    await wait(4000 * Math.random());
  }

  const entireHtml = await page.content();

  const pageTitle = await page.title();
  if (/page not found/i.test(pageTitle)) {
    console.log("Page not found when syncing related items");
    console.log("Entire HTML\n\n", entireHtml, "\n\n");
    return null;
  }

  let averageReview: string | null = null;
  let numberReviews: number | null = null;

  if (scrapeReviewData) {
    ({ averageReview, numberReviews } = await getRatingInfo(page));
  }
  let similarBooks: SimilarBookResult[] = [];
  if (scrapeSimilarBooks) {
    similarBooks = await getSimilarItems(page);
  }

  return { similarBooks, averageReview, numberReviews };
}

export async function getRatingInfo(page: Page): Promise<RatingInfo> {
  let averageReview: string | null = null;
  let numberReviews: number | null = null;

  const ratingsElement = await page.$("#averageCustomerReviews");
  if (ratingsElement) {
    const reviewAverageParentEl = await ratingsElement.$("a.a-popover-trigger");
    if (reviewAverageParentEl) {
      const reviewAverageEl = await reviewAverageParentEl.$(":scope > span");
      if (reviewAverageEl) {
        averageReview = await reviewAverageEl.evaluate(el => el.textContent.trim());
        const reviewCountEl = await ratingsElement.$("#acrCustomerReviewLink > span");
        if (reviewCountEl) {
          let reviewCountStr = await reviewCountEl.evaluate(el => el.textContent.replace(/\(|\)/g, "").replace(/,/g, "").trim());
          numberReviews = parseInt(reviewCountStr, 10);
        }
      }
    }
  }

  return { averageReview, numberReviews };
}

export async function getSimilarItems(page: Page): Promise<SimilarBookResult[]> {
  for (let i = 1; i <= 15; i++) {
    try {
      const scrollAmount = i * 300;
      await page.evaluate(scrollAmount => window.scrollTo(0, scrollAmount), scrollAmount);
      await wait(500);
      let allCarousels = await page.$$("[data-a-carousel-options]");
      if (i >= 4 && allCarousels.length) {
        console.log("Scroll", i, "carousels found", allCarousels.length);
        break;
      }
    } catch (er) {
      console.log("Error", er);
    }
  }

  console.log("Removing iframes");
  await wait(1000);
  const iframes = await page.$$("iframe");
  for (const iframe of iframes) {
    try {
      await iframe.evaluate(el => el.remove());
    } catch (er) {
      console.log("Error removing iframe", er);
    }
  }

  let allCarousels = await page.$$("[data-a-carousel-options]");
  console.log("Found", allCarousels.length, "carousels");
  if (!allCarousels.length) {
    console.log("Trying again ...");
    try {
      await page.waitForSelector("[data-a-carousel-options]", { timeout: 5000 });
      allCarousels = await page.$$("[data-a-carousel-options]");
      console.log("Second attempt found:", allCarousels.length, "carousels");

      if (!allCarousels.length) {
        console.log("No carousels found:\n");
      }
    } catch (er) {
      console.log("Second attemt failed");
    }
  }

  const allBookResults = new Map();

  for (const carousel of allCarousels) {
    console.log("Processing carousel");
    try {
      const headerEl = await carousel.$(".a-carousel-heading");

      if (headerEl == null) {
        console.log("No carousel heading found");
        continue;
      } else {
        const headerText = (await headerEl.evaluate(el => el.textContent)).replace(/\n/g, " ");
        console.log("Processing carousel", headerText);
        const results = await processCarousel(carousel);
        console.log("Found", results.length, "in", headerText);

        for (const book of results) {
          if (!allBookResults.has(book.isbn)) {
            allBookResults.set(book.isbn, book);
          }
        }
      }
    } catch (er) {
      console.log("Error processing carousel", er);
    }
  }

  return [...allBookResults.values()];
}

async function processCarousel(carousel: ElementHandle<Element>): Promise<SimilarBookResult[]> {
  let page = 1;
  let results: SimilarBookResult[] = [];
  do {
    let currentPage = await getResults(carousel);
    if (!currentPage.length) {
      break;
    }
    results.push(...currentPage);

    const nextPageLink = await carousel.$("a.a-carousel-goto-nextpage");
    if (!nextPageLink) {
      console.log("Page", page, "was the last page found");
      break;
    }
    page++;
    console.log("Clicking to next page", page);
    try {
      // needed for use with Playwright - harmless in Puppeteer
      // @ts-ignore
      await nextPageLink.click({ force: true });
      await wait(5000);
    } catch (er) {
      console.log("Error clicking to next page", er);
    }
  } while (page < CAROUSEL_PAGE_LIMIT);

  return results;
}

async function getResults(carousel: ElementHandle<Element>): Promise<SimilarBookResult[]> {
  const resultsMap = new Map<string, SimilarBookResult>();

  let cards: any[];
  do {
    cards = await carousel.$$("li.a-carousel-card");

    for (const card of cards) {
      const bookInfo = await getBookInfo(card);
      if (bookInfo && !resultsMap.get(bookInfo.isbn)) {
        resultsMap.set(bookInfo.isbn, bookInfo);
      }
    }
  } while (!cards.length);

  return [...resultsMap.values()];
}

async function getBookInfo(card: ElementHandle<HTMLLIElement>): Promise<SimilarBookResult | null> {
  const coreBookData = await getCoreData(card);
  if (!coreBookData) {
    return null;
  } else {
    const authors = await getAuthor(card);
    if (authors.length) {
      return { ...coreBookData, authors };
    } else {
      console.log("No author found");
      return null;
    }
  }
}

type CoreBookData = {
  isbn: string;
  title: string;
  img: string;
};
async function getCoreData(card: ElementHandle<HTMLLIElement>): Promise<CoreBookData | null> {
  let isbn = "";
  let img = "";
  let title = "";

  const anchors = await card.$$("a");
  for (const a of anchors) {
    const href = await a.evaluate(el => el.getAttribute("href"));

    if (href) {
      const match = href.match(/\/dp\/([a-zA-Z0-9]+)\//);

      if (match) {
        const isbnMaybe = match[1];
        if (isbnMaybe.length >= 10 && [...isbnMaybe.slice(0, 9)].every(c => !isNaN(c as any))) {
          if (!isbn) {
            isbn = isbnMaybe;
          } else if (isbn !== isbnMaybe) {
            continue;
          }

          const imgMaybe = (await a.$$("img"))[0];
          if (imgMaybe) {
            const src = await imgMaybe.evaluate(el => el.getAttribute("src"));

            const paths = src.split("/");
            paths[paths.length - 1] = paths[paths.length - 1].replace(/\..*(\..*)$/, (match, ext) => ext);

            img = paths.join("/");
          } else if (!title) {
            title = await a.evaluate(el => el.textContent);
          }
        }
      }
    }
  }
  if (title?.indexOf("Shop the Store") !== -1) {
    console.log("skipping");
    return null;
  }
  if (isbn && title && img) {
    console.log("Found", isbn, " - ", title);
    return { isbn: isbn.toUpperCase(), title: title.trim(), img };
  }

  const sponsoredData = await card.$("[data-adfeedbackdetails]");
  if (sponsoredData) {
    const sponsoredDataText = await sponsoredData.evaluate(el => el.getAttribute("data-adfeedbackdetails"));
    if (!sponsoredDataText) {
      return null;
    }
    console.log("Sponsored Data Found");

    try {
      const sponsoredDataJson = JSON.parse(sponsoredDataText);
      title = sponsoredDataJson.title;
      isbn = sponsoredDataJson.isbn || sponsoredDataJson.asin;
    } catch (er) {
      console.log("Error parsing sponsored data", er);
    }

    if (!isbn) {
      console.log("No title or ISBN found in sponsored data");
      return null;
    }

    const img = await card.$("a img");
    if (!img) {
      console.log("No image found in sponsored data");
      return null;
    }
    if (!title) {
      title = await img.evaluate(el => el.getAttribute("alt"));
    }
    if (title?.indexOf("Shop the Store") !== -1) {
      console.log("skipping");
      return null;
    }
    const src = await img.evaluate(el => el.getAttribute("src"));
    if (!src) {
      console.log("No image source found in sponsored data");
    }
    console.log("Found", isbn, " - ", title);
    return { isbn: isbn.toUpperCase(), title: title.trim(), img: src };
  }
}

async function getAuthor(card: ElementHandle<HTMLLIElement>) {
  const author = await card.$$(".a-size-small");
  const reuslt: string[] = [];
  for (const a of author) {
    reuslt.push(await a.evaluate(el => el.textContent.trim()));
  }

  return reuslt;
}
