const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

// @see https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-gitlabci
// @see https://qiita.com/masaminh/items/eb9188c15de60b6b1de6#%E3%83%8F%E3%83%9E%E3%81%A3%E3%81%9F%E5%86%85%E5%AE%B9

exports.outputPdf = async (params) => {
  const startTime = performance.now();
  // return await Promise.all(targets.map((target) => openAndSave(target)));
  const ret = await openAndSave(params);
  console.log(`outputPdf: ${performance.now() - startTime}`);
  return ret;
};

const defaultPdfOption = {
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
};

const openAndSave = async ({ key, content, option }) => {
  const startTime = performance.now();

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });

  console.log(`openAndSave: puppeteer.launch: ${performance.now() - startTime}`);

  try {
    const startTime1 = performance.now();
    const page = await browser.newPage();
    console.log(`openAndSave: browser.newPage: ${performance.now() - startTime1}`);
    const startTime2 = performance.now();

    await page.setContent(content, {
      waitUntil: ["domcontentloaded", "networkidle0"],
    });
    console.log(`openAndSave: page.setContent: ${performance.now() - startTime2}`);
    const startTime3 = performance.now();

    const params = { ...defaultPdfOption, ...option?.pdf };
    let pdf;
    if (process.env.DEBUG) {
      const tmpPath = `/tmp/${key}`;
      fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
      pdf = await page.pdf({ path: tmpPath, ...params });
    } else {
      pdf = await page.pdf(params);
    }
    console.log(`openAndSave: page.pdf: ${performance.now() - startTime3}`);

    return { pdf, key };

    // await page.goto("https://jp.quora.com/");
    // await page.screenshot({ path: `/tmp/_${Date.now()}.png` });
    // return await page.pdf({ path: `/tmp/pdfTest.pdf` });
  } finally {
    browser.close();
  }
};
