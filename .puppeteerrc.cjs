const {join} = require('path');

// @see https://pptr.dev/guides/configuration#changing-the-default-cache-directory

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};