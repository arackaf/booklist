import { Browser, Page } from "puppeteer-core";
import { isbn13To10 } from "./util/isbn13to10";
import { query, getMySqlConnection, getNextBookToSync, getBook } from "./mySqlUtil";
import { doScrape, getBookRelatedItems } from "./scrape";
import { bookSyncFailure, bookSyncSuccess } from "./updateBook";
import { init } from "./setup";
import readline from "readline";

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

function waitForKeypress() {
  return new Promise(resolve => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve(null);
    });
  });
}

export const localSync = async () => {
  console.log("Starting sync");
  let captchaDone = true;
  try {
    let books = [
      { id: 1, title: "The Forging of the Union, 1781-1789 (New American Nation Series)", isbn: "9780060914240" },
      { id: 2, title: "Building Microservices: Designing Fine-Grained Systems", isbn: "1492034029" },
      {
        id: 3,
        title: "Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems",
        isbn: "1449373321"
      },
      { id: 4, title: "Fundamentals of Data Engineering: Plan and Build Robust Data Systems", isbn: "1098108302" }
    ];

    console.log("Got browser");

    const { page, dispose } = await init("playwright");
    for (const book of books) {
      await doSync(book, page, captchaDone);
      await new Promise(res => setTimeout(res, 2000));

      captchaDone = true;

      // console.log("Press any key to continue");
      // await waitForKeypress();
      await wait(5000);
    }
    await dispose();
  } catch (er) {
    console.log("Error: ", er);
  }
};

async function doSync(book: any, page: Page, captchaDone: boolean = false) {
  // const mySqlConnection = await getMySqlConnection();

  let { id, title, isbn } = book;
  try {
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        console.log("13 digit ISBN that can't be converted to 10 digit");
        // await bookSyncFailure(mySqlConnection, id, "13 digit ISBN that can't be converted to 10 digit");
        return;
      }
    }

    console.log("Starting related items sync for", id, isbn, title);

    if (!captchaDone && process.env.stage === "local") {
      await new Promise(res => setTimeout(res, 10000));
    }
    // this is absolutely awful but I don't have time to make it less so
    const allResults = await getBookRelatedItems(page, isbn, title);
    const { averageRating, reviewCount, similarItems } = allResults;

    if (!similarItems || !similarItems.length) {
      // await bookSyncFailure(mySqlConnection, id, "No results");
      console.log("Sync complete for", id, title, "No results found");
      return;
    } else {
      // await bookSyncSuccess(mySqlConnection, id, allResults);
    }
    console.log("Sync complete for", id, title, { averageRating, reviewCount, similarItems: similarItems.map(b => b.title) });
    return allResults;
  } catch (err) {
    console.log("Error", err);
    // await bookSyncFailure(mySqlConnection, id, `Error: ${err}`);
  } finally {
    // mySqlConnection?.end();
  }
}
