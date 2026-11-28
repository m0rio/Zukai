// 公式アイコンを zukai-icons.js にまとめる。
//   node scripts/build-icons.mjs
// icons.json の「名前 → 元のファイル」を読み、npm の公式 SVG を形も色も変えずに1つの .js に入れる。
//   aws   : aws-icons（AWS Architecture Icons）の architecture-service/<値>.svg
//   logos : @iconify-json/logos（gilbarbara/logos）の <値>
// アイコンを足すときは icons.json に1行足して、これを実行する。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nm = path.join(root, 'node_modules');
const list = JSON.parse(fs.readFileSync(path.join(root, 'icons.json'), 'utf8'));
const out = {};

for (const [name, file] of Object.entries(list.aws || {})) {
  const svg = fs.readFileSync(path.join(nm, 'aws-icons/icons/architecture-service', file + '.svg'), 'utf8')
    .replace(/<title>.*?<\/title>/, '').trim();
  const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
  out[name] = { w: +vb[1], h: +vb[2], svg };
}
const logos = JSON.parse(fs.readFileSync(path.join(nm, '@iconify-json/logos/icons.json'), 'utf8'));
for (const [name, key] of Object.entries(list.logos || {})) {
  const i = logos.icons[key];
  if (!i) throw new Error('logos に無い: ' + key);
  const w = i.width || logos.width, h = i.height || logos.height;
  out[name] = { w, h, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${i.body}</svg>` };
}

const names = Object.keys(out).sort();
const body = names.map(n => `  ${JSON.stringify(n)}: ${JSON.stringify(out[n])}`).join(',\n');
const js = `/*! Zukai icons — 公式アイコン（形も色も元のまま）。scripts/build-icons.mjs が icons.json から作る。手で直さない。
 *  AWS: AWS Architecture Icons（aws-icons 経由）。言語・ツール: gilbarbara/logos（CC0）。
 *  ロゴと名称は各社の商標。図の中で、その製品・サービスを指すためだけに使う。
 *  使い方: zukai.js の後に読み込み、z.icon(x, y, 'aws-lambda', { size: 64, label: 'Lambda' }) */
(function (g) {
  g.ZukaiIcons = Object.assign(g.ZukaiIcons || {}, {
${body}
  });
})(typeof window !== 'undefined' ? window : globalThis);
`;
fs.writeFileSync(path.join(root, 'zukai-icons.js'), js);
console.log(JSON.stringify({ icons: names.length, bytes: js.length }));
