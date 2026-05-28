import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1602, height: 1004 });
await page.goto('file://' + path.resolve(__dirname, 'index.html'), { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));
await page.click('.lb-local-link');
await new Promise(r => setTimeout(r, 1000));
const startBtns = await page.$$('button');
for (const btn of startBtns) {
  const txt = await btn.evaluate(el => el.textContent.trim());
  const visible = await btn.evaluate(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  if (txt.includes('Mulai Permainan') && visible) { await btn.click(); break; }
}
await new Promise(r => setTimeout(r, 1500));
for (let i = 0; i < 10; i++) {
  try { const c = await page.$$('.cp-card'); if (c.length > 0) { await c[0].click(); await new Promise(r => setTimeout(r, 1000)); } else break; } catch(e) { break; }
}
await new Promise(r => setTimeout(r, 2000));

// Get exact position of tile-1 (Ambon)
const tileRect = await page.evaluate(() => {
  const t = document.querySelector('[data-tile-id="1"]');
  if (!t) return null;
  const r = t.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
console.log('tile-1 rect:', tileRect);

if (tileRect) {
  // 4× zoom crop of tile-1
  await page.screenshot({
    path: '/Users/evan/Documents/monopoly/tile1_check.png',
    clip: { x: tileRect.x - 5, y: tileRect.y - 5, width: tileRect.w + 10, height: tileRect.h + 10 }
  });
}
await browser.close();
