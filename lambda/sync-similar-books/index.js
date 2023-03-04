const playwright = require("playwright");
// const playwright = require("playwright-aws-lambda");

//const { parse } = require("node-html-parser");
const fs = require("fs");

module.exports.handler = async () => {
  const browser = await playwright.chromium.launch({
    // const browser = await playwright.launchChromium({
    headless: true // setting this to true will not run the UI
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

  await page.waitForTimeout(5000);
  //for (let i = 0; i < 20; i++) {
  await page.evaluate(async () => {
    window.scrollTo(0, 800);
  });
  await page.waitForTimeout(100);
  //}
  await page.waitForTimeout(5000);

  const pageMarkup = await page.content();
  //fs.writeFileSync("./foo.htm", pageMarkup);
  //console.log(pageMarkup);

  //const frequentlyBought = queryable.querySelectorAll("Frequently bought together");

  //page.click()

  //const freqBoughtHeader = await page.textContent("Frequently bought together");
  const freqContainer = await page.locator(':text("Frequently bought together") + div');

  const anchors = await freqContainer.locator("a").all();

  for (const a of anchors) {
    const href = await a.getAttribute("href");
    console.log({ href });

    (await a.elementHandle()).scrollIntoViewIfNeeded();
  }

  const XXX = await page.getByText("Products related", { exact: false }).elementHandle();
  console.log({ XXX });

  // const relatedContainer = await page.getByText("Products related", { exact: false }).all();

  // const el = await relatedContainer[0].elementHandle();
  // const parent = await el.$("xpath=..");
  // const cl = await parent.getAttribute("class");
  // console.log({ cl });

  // const sib = await parent.$(" + *:first");
  // const cl2 = await sib.getAttribute("class");

  // console.log({ cl2 });
  // const queryable = parse(pageMarkup);

  fs.writeFileSync("./foo.htm", pageMarkup);
  await browser.close();
};
