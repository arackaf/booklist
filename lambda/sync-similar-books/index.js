//const playwright = require("playwright");
const playwright = require("playwright-aws-lambda");

//const { parse } = require("node-html-parser");

module.exports.handler = async () => {
  // const browser = await playwright.chromium.launch({
  const browser = await playwright.launchChromium({
    headless: true // setting this to true will not run the UI
  });

  const page = await browser.newPage();
  await page.goto("https://www.amazon.com/dp/1492080519");
  await page.waitForTimeout(5000);

  const pageMarkup = await page.content();
  //console.log(pageMarkup);

  //const freqBoughtHeader = await page.textContent("Frequently bought together");
  const freqContainer = await page.locator(':text("Frequently bought together") + div');

  const anchors = await freqContainer.locator("a").all();

  for (const a of anchors) {
    const href = await a.getAttribute("href");
    console.log({ href });
  }

  //const queryable = parse(pageMarkup);
  //const frequentlyBought = queryable.querySelectorAll("Frequently bought together");

  //page.click()

  // fs.writeFileSync("./foo.htm", pageMarkup);
  await browser.close();
};
