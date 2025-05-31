import playwright from "playwright";
import puppeteer, { Page, type Browser, type ElementHandle } from "puppeteer-core";
import { v4 as uuidv4 } from "uuid";

const BD_ZONE = process.env.BRIGHT_DATA_ZONE;
const BD_KEY = process.env.BRIGHT_DATA_KEY;

const BRIGHT_DATA_URL = `wss://${BD_ZONE}:${BD_KEY}@brd.superproxy.io:9222`;

async function getPuppeteerBrowser() {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `${BRIGHT_DATA_URL}?session=${uuidv4()}`
  });

  return browser;
}

async function getPuppeteerPage(browser: Browser) {
  const page = await browser.newPage();
  if (true) {
    await page.setRequestInterception(true);
    page.on("request", req => {
      const blockedResourceTypes = ["image", "stylesheet", "media", "font"];
      if (blockedResourceTypes.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  return page;
}

async function getPlaywrightBrowser() {
  const headless = false;
  return playwright.chromium.launch({
    headless
  }) as any as Browser;
}

export async function getPlaywrightPage(browser: Browser) {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    referer: "https://www.amazon.com/",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
  });

  return page;
}

export async function init(type: "puppeteer" | "playwright") {
  let browser: Browser;
  let page: Page;

  if (type === "puppeteer") {
    browser = await getPuppeteerBrowser();
    page = await getPuppeteerPage(browser);
  } else {
    browser = await getPlaywrightBrowser();
    page = await getPlaywrightPage(browser);
  }

  const dispose = async () => {
    try {
      await page?.close();
    } catch (er) {}
    try {
      await browser?.close();
    } catch (er) {}
    try {
      await browser?.disconnect();
    } catch (er) {}
  };

  return { browser, page, dispose };
}
