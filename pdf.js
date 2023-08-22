const puppeteer = require("puppeteer");

// @see https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-gitlabci

exports.outputPdf = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();
  
  await page.setContent(
    `
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <h1>test:日本語:Your awesome PDF report template</h1>
  </body>
</html>`
  );

  return await page.pdf({
    path: "/tmp/pdfReport.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: 20, left: 20, right: 20, bottom: 20 },
    displayHeaderFooter: true,
  });

  // await page.goto("https://jp.quora.com/");
  // await page.screenshot({ path: `/tmp/_${Date.now()}.png` });
  // return await page.pdf({ path: `/tmp/pdfTest.pdf` });
};
