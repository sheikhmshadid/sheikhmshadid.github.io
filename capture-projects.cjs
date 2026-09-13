const { chromium } = require(process.argv[2] || 'playwright');
const path = require('node:path');
const readline = require('node:readline/promises');

// Open the real apps, let the owner sign in, then capture the chosen screens.
// Usage: node capture-projects.cjs <playwright-path> <cieve-url> <studio-url>
(async () => {
  const urls = process.argv.slice(3);
  if (urls.length !== 2 || urls.some(url => !/^https?:\/\//.test(url))) {
    throw new Error('Provide the HTTP(S) URLs for Cieve and the content studio.');
  }
  const context = await chromium.launchPersistentContext(path.join(__dirname, '.capture-profile'), {
    headless: false,
    args: ['--remote-debugging-port=9222'],
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  const input = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const pages = [];
    for (const url of urls) {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      pages.push(page);
    }
    await input.question('Sign in and select the desired screen in both tabs. Press Enter only when both screens are ready to capture.\n');
    for (const [index, page] of pages.entries()) {
      await page.evaluate(() => document.fonts.ready);
      const filename = index === 0 ? 'cieve-screenshot.png' : 'studio-screenshot.png';
      await page.screenshot({ path: path.join(__dirname, 'assets', filename), animations: 'disabled' });
      console.log(`Captured ${filename}`);
    }
  } finally {
    input.close();
    await context.close();
  }
})();
