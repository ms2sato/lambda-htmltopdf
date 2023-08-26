const puppeteer = require("puppeteer");

// @see https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-gitlabci
// @see https://qiita.com/masaminh/items/eb9188c15de60b6b1de6#%E3%83%8F%E3%83%9E%E3%81%A3%E3%81%9F%E5%86%85%E5%AE%B9

exports.outputPdf = async (params) => {
  // return await Promise.all(targets.map((target) => openAndSave(target)));
  return await openAndSave(params);
};

const defaultPdfOption = {
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
};

const openAndSave = async ({ key, content, option }) => {
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

  try {
    const page = await browser.newPage();

    await page.setContent(content);

    const params = { ...defaultPdfOption, ...option?.pdf };
    const pdf = await page.pdf(
      process.env.DEBUG ? { path: `/tmp/${key}`, ...params } : params
    );

    return { pdf, key };

    // await page.goto("https://jp.quora.com/");
    // await page.screenshot({ path: `/tmp/_${Date.now()}.png` });
    // return await page.pdf({ path: `/tmp/pdfTest.pdf` });
  } finally {
    browser.close();
  }
};
