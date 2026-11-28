// brand の見本。公式アイコンの一覧。rough.js・zukai.js・zukai-icons.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', 'Zukai に同梱している公式アイコンの一覧。AWS のサービス、言語、ツールと基盤の3つのまとまり。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 950 }), C = z.C;
z.heading(40, 44, '公式アイコンは、形も色もそのまま置く');
const names = Object.keys(ZukaiIcons);
const groups = [
  ['AWS', names.filter(n => n.startsWith('aws-'))],
  ['言語', ['python', 'typescript', 'javascript', 'go', 'rust', 'java', 'kotlin', 'swift', 'ruby', 'php', 'csharp', 'cpp']],
];
groups.push(['ツール・基盤', names.filter(n => !groups.some(g => g[1].includes(n)))]);
const per = 10, cw = 112, rh = 96;
let y = 96;
for (const [title, list] of groups) {
  z.T(40, y, title, { size: 20 });
  y += 50;
  list.forEach((n, i) => {
    const x = 96 + (i % per) * cw, yy = y + Math.floor(i / per) * rh;
    z.icon(x, yy, n, { size: 48 });
    z.T(x, yy + 40, n, { size: 12, anchor: 'middle', fill: C.grey });
  });
  y += Math.ceil(list.length / per) * rh + 20;
}
