const playwright = process.env.stage ? require("playwright-aws-lambda") : require("playwright");

const mysql = require("mysql");

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { toUtf8, fromUtf8 } = require("@aws-sdk/util-utf8");

// const mySqlConnection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const client = new LambdaClient({
  region: "us-east-1"
});

module.exports.handler = async evt => {
  const { isbn } = evt;
  const browser = process.env.stage
    ? await await playwright.launchChromium({
        headless: true
      })
    : await playwright.chromium.launch({
        headless: true
      });

  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    extraHTTPHeaders: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
    }
  });

  await page.goto(`https://www.amazon.com/dp/${isbn}`, {});

  for (let i = 1; i <= 15; i++) {
    await page.evaluate(() => window.scrollTo(0, i * 700));
    await page.waitForTimeout(1000);
  }

  const allCarousels = await page.locator("[data-a-carousel-options]").all();

  const allBookResults = new Map();

  for (const carousel of allCarousels) {
    const carouselEl = await carousel.elementHandle();
    const headerEl = await carouselEl.$(".a-carousel-heading");

    if (headerEl == null) {
      continue;
    } else {
      const results = await processCarousel(page, carousel);
      console.log("Found", results.length, "in", (await headerEl.innerText()).replace(/\n/g, " "));

      for (const book of results) {
        if (!allBookResults.has(book.isbn)) {
          allBookResults.set(book.isbn, book);
        }
      }
    }
  }

  const allResults = [...allBookResults.values()];
  for (const book of allResults) {
    const command = new InvokeCommand({
      FunctionName: "process-book-cover-live-processCover",
      Payload: fromUtf8(JSON.stringify({ url: book.img, userId: "similar-books" }))
    });
    const response = await client.send(command);

    if (response.Payload) {
      const respJson = JSON.parse(toUtf8(response.Payload));

      delete book.img;
      book.smallImage = respJson.smallImage;
      book.smallImagePreview = respJson.smallImagePreview;
      book.mobileImage = respJson.mobileImage;
      book.mobileImagePreview = respJson.mobileImagePreview;
    } else {
      console.log("can't process");
    }
  }
  console.log({ allResults });

  await browser.close();
};

async function processCarousel(page, carousel) {
  const results = await getResults(carousel);

  if (results.length) {
    const nextPage = await carousel.locator("a.a-carousel-goto-nextpage");
    // const nextPage = await carousel.locator("a.a-carousel-goto-nextpage").all();
    if (nextPage) {
      await nextPage.click({ force: true });
      await page.waitForTimeout(5000);

      const page2 = await getResults(carousel);
      results.push(...page2);
    }
  }

  return results;
}

async function getResults(carousel) {
  const result = [];
  const resultsMap = new Map();

  const cards = await carousel.locator("li.a-carousel-card").all();

  for (const card of cards) {
    const bookInfo = await getBookInfo(card);
    if (bookInfo && !resultsMap.get(bookInfo.isbn)) {
      resultsMap.set(bookInfo.isbn, bookInfo);
    }
  }

  return [...resultsMap.values()];
}

async function getBookInfo(card) {
  const coreBookData = await getCoreData(card);
  if (!coreBookData) {
    return null;
  } else {
    // TODO get author
    const author = await getAuthor(card);
    if (author) {
      return { ...coreBookData, author };
    } else {
      return null;
    }
  }
}

async function getCoreData(card) {
  let isbn = "";
  let img = "";
  let title = "";

  const anchors = await card.locator("a").all();
  for (const a of anchors) {
    const href = await a.getAttribute("href");

    if (href) {
      const match = href.match(/\/dp\/([a-zA-Z0-9]+)\//);

      if (match) {
        const isbnMaybe = match[1];
        if (isbnMaybe.length >= 10 && [...isbnMaybe.slice(0, 9)].every(c => !isNaN(c))) {
          if (!isbn) {
            isbn = isbnMaybe;
          } else if (isbn !== isbnMaybe) {
            continue;
          }

          const imgMaybe = (await a.locator("img").all())[0];
          if (imgMaybe) {
            const src = await imgMaybe.getAttribute("src");

            const paths = src.split("/");
            paths[paths.length - 1] = paths[paths.length - 1].replace(/\..*(\..*)$/, (match, ext) => ext);

            img = paths.join("/");
          } else if (!title) {
            title = await a.innerText();
          }
        }
      }
    }
  }
  if (isbn && title && img) {
    return { isbn, title: title.trim(), img };
  }
}

async function getAuthor(card) {
  const author = await card.locator(".a-size-small").all();
  for (const a of author) {
    return a.innerText();
  }
}
