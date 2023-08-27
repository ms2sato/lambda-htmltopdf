#!/usr/bin/env node
const fs = require("fs");

const params = {
  key: "mydir/debug1.pdf",
  content: `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>[1]test:日本語:Your awesome PDF report template</h1>
        <h2 class="title">title</h2>
      </body>
    </html>`,
  option: {
    pdf: {
      format: "A4",
      printBackground: true,
      margin: { top: 20, left: 20, right: 20, bottom: 20 },
      displayHeaderFooter: true,
    },
    signedUrl: {
      expiresIn: "3600",
    },
  },
};

fs.writeFileSync(
  "./test/event.json",
  JSON.stringify({ body: JSON.stringify(params) }, null, 2)
);

fs.writeFileSync("./test/params.json", JSON.stringify(params, null, 2));
