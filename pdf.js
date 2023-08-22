const chromium = require("chromium");
const puppeteer = require("puppeteer");

exports.outputPdf = async () => {
  let browser = null;
  const ep = await chromium.executablePath;
  console.log("executable path ", ep);

  browser = await puppeteer.launch({
    headless: true,
    args: [...Array.from(chromium.args || []), "--no-sandbox"],
    defaultViewport: chromium.defaultViewport,
    executablePath: ep,
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(
    `<h1>test:日本語:Your awesome PDF report template</h1>`
  );

  return await page.pdf({
    path: "/tmp/pdfReport.pdf", // TAKE ATTENTION!!
    format: "A4",
    printBackground: true,
    margin: { top: 20, left: 20, right: 20, bottom: 20 },
    displayHeaderFooter: true,
  });
};
