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

// Dismiss any popup by clicking backdrop or popup button
for (let i = 0; i < 5; i++) {
  try {
    const backdrop = await page.$('#overlay-backdrop');
    const isVisible = await backdrop?.evaluate(el => window.getComputedStyle(el).display !== 'none' && el.offsetParent !== null);
    if (isVisible) {
      // Click a popup button to dismiss
      const popupBtn = await page.$('.popup button, .popup .btn, #main-popup button');
      if (popupBtn) { await popupBtn.click(); await new Promise(r => setTimeout(r, 800)); }
      else { await backdrop.click(); await new Promise(r => setTimeout(r, 800)); }
    } else break;
  } catch(e) { break; }
}

// Also hide the center HUD overlay for clean board view
await page.evaluate(() => {
  document.getElementById('overlay-backdrop').style.display = 'none';
  document.getElementById('center-hud').style.display = 'none';
  document.getElementById('dice-area').style.display = 'none';
  document.getElementById('turn-indicator').style.display = 'none';
  document.getElementById('game-log').style.display = 'none';
  document.getElementById('money-panel').style.display = 'none';
});

const bw = await page.evaluate(() => { const e = document.getElementById('board-wrap'); const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });

// Full board clean view
await page.screenshot({ path: path.resolve(__dirname, 'board_clean.png'), clip: { x: bw.x - 5, y: bw.y - 5, width: bw.w + 10, height: bw.h + 10 } });
// Bottom row
await page.screenshot({ path: path.resolve(__dirname, 'bottom_row.png'), clip: { x: bw.x, y: bw.y + bw.h - 110, width: bw.w, height: 115 } });
// Left column
await page.screenshot({ path: path.resolve(__dirname, 'left_col.png'), clip: { x: bw.x, y: bw.y, width: 130, height: bw.h } });
// Right column
await page.screenshot({ path: path.resolve(__dirname, 'right_col.png'), clip: { x: bw.x + bw.w - 130, y: bw.y, width: 130, height: bw.h } });
// Top row
await page.screenshot({ path: path.resolve(__dirname, 'top_row.png'), clip: { x: bw.x, y: bw.y, width: bw.w, height: 110 } });

console.log('All screenshots saved, board at:', bw);
await browser.close();
