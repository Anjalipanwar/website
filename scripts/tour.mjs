// Dev helper: full-page tour. node scripts/tour.mjs <prefix> <width> <height> [reduce]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [prefix, w = '1440', h = '900', reduce] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, reducedMotion: reduce ? 'reduce' : 'no-preference', hasTouch: +w < 800, isMobile: +w < 800 });
page.on('console', m => m.type() === 'error' && console.log('console error:', m.text()));
page.on('pageerror', e => console.log('page error:', e.message));
await page.goto(process.env.URL ?? 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('page height', total, 'x-overflow', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
let n = 0;
const step = Math.round(+h * 0.85);
for (let y = 0; y < total - +h * 0.2; y += step) {
  for (let i = 1; i <= 6; i++) { await page.evaluate(v => window.scrollTo(0, v), y - step + (step * i) / 6); await page.waitForTimeout(50); }
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots/${prefix}-${String(n++).padStart(2, '0')}.png` });
}
console.log('shots', n);
await browser.close();
