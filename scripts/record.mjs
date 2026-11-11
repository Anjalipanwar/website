// Dev helper: hero load frames + a scroll recording (shots/scroll.webm).
import { createRequire } from 'node:module';
import { renameSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const url = process.env.URL ?? 'http://127.0.0.1:4173/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: 'shots/video', size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('page error:', e.message));
await page.goto(url, { waitUntil: 'commit' });
await page.waitForSelector('.hero-inner');
const t0 = Date.now();
for (const t of [350, 1000, 1500, 2000, 2600]) {
  await page.waitForTimeout(Math.max(0, t - (Date.now() - t0)));
  await page.screenshot({ path: `shots/load-${t}.png` });
}
await page.mouse.move(640, 360);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (let y = 0; y < total; y += 420) { await page.mouse.wheel(0, 420); await page.waitForTimeout(260); }
await page.waitForTimeout(800);
const video = page.video();
await ctx.close();
renameSync(await video.path(), 'shots/scroll.webm');
await browser.close();
console.log('ok');
