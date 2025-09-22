
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const defaultPdfOption = {
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
};

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    executablePath: await chromium.executablePath(),
    defaultViewport: chromium.defaultViewport,
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote"
    ],
    env: {
      ...process.env,
      FONTCONFIG_PATH: "/tmp/fontconfig",
      HOME: "/tmp"
    },
  });
}

async function renderOnce(browser, html, pdfParams, debugFile) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.warn("pageerror:", e?.message || e));
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    if (debugFile) {
      fs.mkdirSync(path.dirname(debugFile), { recursive: true });
      return await page.pdf({ path: debugFile, ...pdfParams });
    }
    return await page.pdf(pdfParams);
  } finally {
    await page.close().catch(() => {});
  }
}

exports.outputPdf = async ({ key, content, option }) => {
  const startTime = performance.now();
  const pdfParams = { ...defaultPdfOption, ...option?.pdf };
  const debugFile = process.env.DEBUG ? `/tmp/${key || "debug.pdf"}` : undefined;

  let browser;
  try {
    browser = await launchBrowser();
    for (let i = 0; i < 2; i++) {
      try {
        const pdf = await renderOnce(browser, content, pdfParams, debugFile);
        console.log(`outputPdf: ${performance.now() - startTime}`);
        return { pdf, key };
      } catch (e) {
        const msg = String(e?.message || e);
        if (/detached Frame|Target closed|Navigation failed/i.test(msg) && i === 0) {
          console.warn("retry after transient error:", msg);
          continue;
        }
        throw e;
      }
    }
    throw new Error("unreachable");
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
};
