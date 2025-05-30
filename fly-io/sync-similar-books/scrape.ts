import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";
import puppeteer, { type Browser, type ElementHandle } from "puppeteer-core";
import playwright from "playwright";

// aws runtime arn:aws:lambda:us-east-1::runtime:0cdcfbdefbc5e7d3343f73c2e2dd3cba17d61dea0686b404502a0c9ce83931b9

// https://www.amazon.com/Programming-TypeScript-Making-JavaScript-Applications/dp/1492037656/ref=sr_1_5?crid=1EYSNI5TQD8HI&keywords=typescript&qid=1655178647&sprefix=ty%2Caps%2C517&sr=8-5

const BD_ZONE = process.env.BRIGHT_DATA_ZONE;
const BD_KEY = process.env.BRIGHT_DATA_KEY;

const BRIGHT_DATA_URL = `wss://${BD_ZONE}:${BD_KEY}@brd.superproxy.io:9222`;

const client = new LambdaClient({
  region: "us-east-1"
});

export async function getBookRelatedItems(isbn: string, bookTitle: string) {
  const browser = await getBrowser();

  try {
    //const page = await getPage(browser);
    return await doScrape(browser, isbn, bookTitle);
  } catch (er) {
    console.log("Error", er);
  } finally {
    await browser?.close();
  }
}

export async function getBrowser() {
  // const headless = true;
  // return playwright.chromium.launch({
  //   headless
  // }) as any as Browser;

  const browser = await puppeteer.connect({
    browserWSEndpoint: BRIGHT_DATA_URL
  });

  return browser;
}

// export async function getPage(browser: Browser) {
//   return browser.newPage({
//     extraHTTPHeaders: {
//       "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
//       accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//       "sec-fetch-site": "same-origin",
//       "sec-fetch-mode": "navigate",
//       "sec-fetch-user": "?1",
//       "sec-fetch-dest": "document",
//       referer: "https://www.amazon.com/",
//       "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
//     }
//   });
// }

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function doScrape(browser: Browser, isbn: string, bookTitle: string, capctaDone: boolean = false) {
  console.log("Original title", bookTitle);
  const titleForUrl = bookTitle
    .replace(/\//g, "")
    .replace(/\s+/g, "-")
    .replace(/[^(\w-)]/g, "");

  console.log("Title for url", titleForUrl);

  const urlToUse = `https://www.amazon.com/${titleForUrl}/dp/${isbn}`;
  console.log("Attempting url", urlToUse);

  const page = await browser.newPage();
  await page.goto(urlToUse, { waitUntil: "domcontentloaded", timeout: 60000 });

  await wait(100);

  if (!process.env.stage && !capctaDone) {
    await wait(15000);
  } else {
    await wait(4000 * Math.random());
  }

  const entireHtml = await page.content();

  const title = await page.title();
  if (/page not found/i.test(title)) {
    console.log("Page not found when syncing related items");
    console.log("Entire HTML\n\n", entireHtml, "\n\n");
    return null;
  }

  for (let i = 1; i <= 15; i++) {
    try {
      const scrollAmount = i * 300;
      await page.evaluate(scrollAmount => window.scrollTo(0, scrollAmount), scrollAmount);
      await wait(500);
      let allCarousels = await page.$$("[data-a-carousel-options]");
      console.log("Scroll", i, "carousels found", allCarousels.length);
      if (i >= 4 && allCarousels.length) {
        break;
      }
    } catch (er) {
      console.log("Error", er);
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
        console.log("Entire page:\n");
        console.log(entireHtml);
      }
    } catch (er) {
      console.log("Second attemt failed");
    }
  }

  const allBookResults = new Map();

  for (const carousel of allCarousels) {
    console.log("Processing carousel");

    const headerEl = await carousel.$(".a-carousel-heading");

    if (headerEl == null) {
      console.log("No carousel heading found");
      continue;
    } else {
      const results = await processCarousel(carousel);
      console.log("Found", results.length, "in", (await headerEl.evaluate(el => el.textContent)).replace(/\n/g, " "));

      for (const book of results) {
        if (!allBookResults.has(book.isbn)) {
          allBookResults.set(book.isbn, book);
        }
      }
    }
  }

  const allResults = [...allBookResults.values()];
  //await processImages(allResults);

  return allResults;
}

async function processImages(books: any[]) {
  for (const book of books) {
    const command = new InvokeCommand({
      FunctionName: "process-book-cover-live-processCover",
      Payload: fromUtf8(JSON.stringify({ url: book.img, userId: "similar-books" }))
    });
    const response = await client.send(command);

    if (response.Payload) {
      try {
        const respJson = JSON.parse(toUtf8(response.Payload));

        delete book.img;
        book.smallImage = respJson.smallImage;
        book.smallImagePreview = respJson.smallImagePreview;
        book.mobileImage = respJson.mobileImage;
        book.mobileImagePreview = respJson.mobileImagePreview;
      } catch (er) {
        console.log("Error syncing book cover");
      }
    } else {
      console.log("can't process");
    }
  }
}

async function processCarousel(carousel: ElementHandle<Element>) {
  let page = 1;
  let results = [];
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
    // needed for use with Playwright - harmless in Puppeteer
    // @ts-ignore
    await nextPageLink.click({ force: true });
    await wait(5000);
  } while (page <= 6);

  return results;
}

async function getResults(carousel: ElementHandle<Element>) {
  const resultsMap = new Map();

  const cards = await carousel.$$("li.a-carousel-card");

  for (const card of cards) {
    const bookInfo = await getBookInfo(card);
    if (bookInfo && !resultsMap.get(bookInfo.isbn)) {
      resultsMap.set(bookInfo.isbn, bookInfo);
    }
  }

  return [...resultsMap.values()];
}

async function getBookInfo(card: ElementHandle<HTMLLIElement>) {
  const coreBookData = await getCoreData(card);
  if (!coreBookData) {
    return null;
  } else {
    const author = await getAuthor(card);
    if (author) {
      return { ...coreBookData, author };
    } else {
      console.log("No author found");
      return null;
    }
  }
}

async function getCoreData(card: ElementHandle<HTMLLIElement>) {
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
  if (isbn && title && img && title != "Shop the Store on Amazon") {
    console.log("Results found", { isbn, title, img });
    return { isbn: isbn.toUpperCase(), title: title.trim() };
  }
}

async function getAuthor(card: ElementHandle<HTMLLIElement>) {
  const author = await card.$$(".a-size-small");
  for (const a of author) {
    return a.evaluate(el => el.textContent);
  }
}
