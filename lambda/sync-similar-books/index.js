const playwright = process.env.stage ? require("playwright-aws-lambda") : require("playwright");

const mysql = require("mysql");

console.log(mysql.createConnection);
// const mySqlConnection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// const fs = require("fs");

module.exports.handler = async () => {
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

  await page.goto("https://www.amazon.com/dp/1492080519", {});

  for (let i = 1; i <= 15; i++) {
    await page.evaluate(() => window.scrollTo(0, i * 700));
    await page.waitForTimeout(1000);
  }

  //for (let i = 0; i < 20; i++) {

  //}

  const pageMarkup = await page.content();
  //fs.writeFileSync("./foo.htm", pageMarkup);
  //console.log(pageMarkup);

  //const frequentlyBought = queryable.querySelectorAll("Frequently bought together");

  //page.click()

  //const freqBoughtHeader = await page.textContent("Frequently bought together");
  // const freqContainer = await page.locator(':text("Frequently bought together") + div');

  // const hrefs = await getHrefs(freqContainer);
  // for (const href of hrefs) {
  //   console.log({ href });
  // }

  // const XXX = await page.getByText("Products related to this item", { exact: false }).elementHandle();
  const allCarousels = await page.locator("[data-a-carousel-options]").all();
  for (const carousel of allCarousels) {
    console.log("---------------------------------------");
    const carouselEl = await carousel.elementHandle();
    const headerEl = await carouselEl.$(".a-carousel-heading");

    //("").first();
    //const header = await headerEl.innerHTML();
    if (headerEl == null) {
      console.log("nuttin here");
      continue;
    } else {
      console.log({ headerText: await headerEl.innerText() });
      const results = await getResults(carousel);
      for (const href of results) {
        console.log({ href });
      }

      console.log(" ------------------------------ ");

      if (results.length) {
        const nextPage = await carousel.locator("a.a-carousel-goto-nextpage");
        // const nextPage = await carousel.locator("a.a-carousel-goto-nextpage").all();
        console.log({ nextPage });
        console.log({ click: nextPage.click });
        if (nextPage) {
          console.log("FOUND IT");

          await nextPage.click({ force: true });
          await page.waitForTimeout(5000);

          const hrefs = await getResults(carousel);
          for (const href of hrefs) {
            console.log({ href });
          }
        }
      }
    }
    // console.log(await headerEl.innerHTML());

    // const parent = await headerEl.$("xpath=..");
    // const cl1 = await parent.getAttribute("class");
    // console.log({ cl1 });

    // const sib = await parent.$("& + *:first");
    // const cl2 = await sib.getAttribute("class");

    // console.log({ cl2 });
    console.log("---------------------------------------");
  }

  // const relatedContainer = await page.getByText("Products related", { exact: false }).all();

  // const el = await relatedContainer[0].elementHandle();
  // const parent = await el.$("xpath=..");
  // const cl = await parent.getAttribute("class");
  // console.log({ cl });

  // const sib = await parent.$(" + *:first");
  // const cl2 = await sib.getAttribute("class");

  // console.log({ cl2 });
  // const queryable = parse(pageMarkup);

  // fs.writeFileSync("./foo.htm", pageMarkup);
  await browser.close();
};

async function getResults(carousel) {
  const result = [];

  const cards = await carousel.locator("li.a-carousel-card").all();

  for (const card of cards) {
    const bookInfo = await getBookInfo(card);
    console.log({ bookInfo });
  }

  return result;
}

async function getBookInfo(card) {
  const coreBookData = await getIsbnAndImg(card);
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

async function getIsbnAndImg(card) {
  let isbn = "";
  let img = "";

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

            console.log("before", src);
            const paths = src.split("/");
            paths[paths.length - 1] = paths[paths.length - 1].replace(/\..*(\..*)$/, (match, ext) => ext);

            return { img: paths.join("/"), isbn };
          }
        }
      }
    }
  }
}

async function getAuthor(card) {
  const author = await card.locator(".a-size-small").all();
  for (const a of author) {
    return a.innerText();
  }
}
