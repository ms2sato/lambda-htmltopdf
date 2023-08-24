#!/usr/bin/env node
const fs = require("fs");

const targets = [
  {
    key: "debug1.pdf",
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
  },
  {
    key: "debug2.pdf",
    content: `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>[2]test:日本語:Your awesome PDF report template</h1>
        <h2 class="title">title</h2>
      </body>
    </html>`,
  },
];

fs.writeFileSync("./test/body.json", JSON.stringify({ targets }, null, 2));
