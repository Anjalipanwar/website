// Dev helper: node scripts/shoot.mjs <name> <width> <height> [scrollY|#id] [waitMs] [reduce]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [name, w = '1440', h = '900', target = '0', wait = '3200', reduce] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: reduce ? 'reduce' : 'no-preference', hasTouch: +w < 800, isMobile: +w < 800 });
page.on('console', m => m.type() === 'error' && console.log('console error:', m.text()));
page.on('pageerror', e => console.log('page error:', e.message));
await page.goto(process.env.URL ?? 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(+wait);
if (target !== '0') {
  const y = target.startsWith('#')
    ? await page.evaluate(sel => document.querySelector(sel).getBoundingClientRect().top + scrollY, target)
    : +target;
  // scroll in steps so scrubbed animations and Lenis keep up
  const from = await page.evaluate(() => scrollY);
  for (let i = 1; i <= 12; i++) { await page.evaluate(v => window.scrollTo(0, v), from + ((y - from) * i) / 12); await page.waitForTimeout(60); }
  await page.waitForTimeout(900);
}
if (process.env.HOVER) { await page.hover(process.env.HOVER); await page.waitForTimeout(900); }
await page.screenshot({ path: `shots/${name}.png` });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
console.log(name, 'scrollY', await page.evaluate(() => Math.round(scrollY)), 'x-overflow', overflow);
await browser.close();
