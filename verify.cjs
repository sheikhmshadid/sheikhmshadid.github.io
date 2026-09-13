const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => {
      image.loading = 'eager';
      return image.decode();
    })));
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      assert(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
      await page.screenshot({ path: path.join(__dirname, `preview-${width}.png`), fullPage: true });
    }
    assert.equal(await page.locator('.project-shot img').count(), 2);
    assert.equal(await page.locator('.project-art, [data-film]').count(), 0);
    assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).color), 'rgb(35, 63, 201)');
    assert.equal(await page.locator('.cieve-project').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(26, 4, 3)');
    assert.equal(await page.locator('.studio-project').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(252, 252, 252)');
    const popupReady = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Open full-size Cieve screenshot', exact: true }).click();
    const popup = await popupReady;
    await popup.waitForLoadState();
    assert(popup.url().endsWith('/assets/cieve-screenshot.png'));
    await popup.close();
    await page.getByRole('link', { name: 'About', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#about');
    await page.getByRole('link', { name: 'Get in touch', exact: false }).click();
    assert.equal(new URL(page.url()).hash, '#contact');
    assert.equal(await page.locator('.contact-bottom a').getAttribute('href'), 'mailto:sheikhmshadid@gmail.com');
    assert.deepEqual(errors, []);
    console.log('Passed: four viewport widths, real screenshot loading, full-size image link, scoped project palettes, original hero color, navigation, and no browser errors.');
  } finally {
    await browser.close();
  }
})();
