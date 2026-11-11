// Generates public/og.png, the PNG favicons and the placeholder public/resume.pdf.
// Run with `npm run assets` (builds first, then screenshots the built site).
// Needs Playwright available to Node: `npm i -D playwright && npx playwright install chromium`.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
const { chromium } = createRequire(import.meta.url)('playwright');

const server = await preview({ preview: { port: 4179, host: '127.0.0.1' } });
const browser = await chromium.launch();

// Open Graph image: the hero, fully marked up, at 1200×630
const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
await og.goto('http://127.0.0.1:4179/', { waitUntil: 'networkidle' });
await og.addStyleTag({
  content: `
    nav ul, #top .btn, #top .link-mark, #top .t-lead, #top > div:last-child { display: none !important; }
    #top .frame-main { justify-content: flex-start !important; padding-top: 9.5rem !important; }
    .t-hero { font-size: 7.6rem !important; }`,
});
await og.evaluate(() => document.fonts.ready);
await og.waitForTimeout(500);
await og.screenshot({ path: 'public/og.png' });

// PNG favicons from the SVG
const svg = readFileSync('public/favicon.svg', 'utf8');
for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await p.screenshot({ path: `public/${file}`, omitBackground: true });
  await p.close();
}

// Placeholder résumé so the button works until the real PDF replaces it
const pdf = await browser.newPage();
await pdf.setContent(`<body style="font: 16px/1.5 system-ui; color:#1C1B3A; padding: 3rem">
  <h1 style="font-size: 2.5rem; margin: 0">Anjali Panwar</h1>
  <p>Résumé placeholder. Replace this file at <code>public/resume.pdf</code> with the real PDF.</p>
  <p>anjalipanwar.com</p></body>`);
await pdf.pdf({ path: 'public/resume.pdf', format: 'A4' });

await browser.close();
await server.close();
console.log('wrote public/og.png, favicons, resume.pdf');
