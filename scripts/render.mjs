// HTML の図を PNG に書き出す。
//   node scripts/render.mjs <入力.html> <出力.png> [幅] [高さ]
// CDN（rough.js・zukai.js・zukai-icons.js・Yusei Magic）への読み込みは、このリポジトリと node_modules の
// ローカルファイルに差し替える。ネットワークが無い環境でも、チャット用と同じ HTML をそのまま書き出せる。
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = path.join(root, 'node_modules');
const [src, out, argW, argH] = process.argv.slice(2);
if (!src || !out) { console.error('usage: node scripts/render.mjs <in.html> <out.png> [width] [height]'); process.exit(2); }

const chrome = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'].find(p => p && fs.existsSync(p));
if (!chrome) { console.error('Chrome が見つからない。CHROME_PATH を指定する'); process.exit(2); }

const fontDir = path.join(nm, '@fontsource/yusei-magic');
const FAKE = 'https://zukai.local/fonts/';
const local = url => {
  if (/cdn\.jsdelivr\.net\/npm\/roughjs/.test(url)) return { file: path.join(nm, 'roughjs/bundled/rough.js'), type: 'text/javascript' };
  if (/cdn\.jsdelivr\.net\/gh\/m0rio\/zukai[^/]*\/zukai\.js/i.test(url)) return { file: path.join(root, 'zukai.js'), type: 'text/javascript' };
  if (/cdn\.jsdelivr\.net\/gh\/m0rio\/zukai[^/]*\/zukai-icons\.js/i.test(url)) return { file: path.join(root, 'zukai-icons.js'), type: 'text/javascript' };
  if (/fonts\.googleapis\.com\/css.*Yusei\+Magic/.test(url)) {
    const css = fs.readFileSync(path.join(fontDir, '400.css'), 'utf8').replace(/url\(\.\/files\//g, `url(${FAKE}`);
    return { body: css, type: 'text/css' };
  }
  if (url.startsWith(FAKE)) return { file: path.join(fontDir, 'files', path.basename(url)), type: url.endsWith('.woff2') ? 'font/woff2' : 'font/woff' };
  return null;
};

const browser = await puppeteer.launch({ executablePath: chrome, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.setRequestInterception(true);
page.on('request', req => {
  const hit = local(req.url());
  if (!hit) return req.continue();
  const headers = { 'access-control-allow-origin': '*' };
  if (hit.body != null) return req.respond({ status: 200, contentType: hit.type, headers, body: hit.body });
  if (!fs.existsSync(hit.file)) return req.respond({ status: 404, body: '' });
  req.respond({ status: 200, contentType: hit.type, headers, body: fs.readFileSync(hit.file) });
});
await page.setViewport({ width: +(argW || 1200), height: +(argH || 630), deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.resolve(src)).href, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(async () => { await document.fonts.ready; await new Promise(r => setTimeout(r, 200)); await document.fonts.ready; });
const box = await page.evaluate(() => { const v = document.querySelector('svg')?.viewBox?.baseVal; return v && v.width ? { w: v.width, h: v.height } : null; });
const w = +(argW || box?.w || 1200), h = +(argH || box?.h || 630);
await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
const hand = await page.evaluate(() => [...document.fonts].some(f => /Yusei Magic/.test(f.family) && f.status === 'loaded'));
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
await browser.close();
console.log(JSON.stringify({ out, width: w, height: h, yuseiMagic: hand, errors }));
if (errors.length || !hand) process.exit(1);
