// gantt の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '不正検知を入れるまでの工程表。4月から設計、開発、検証と進み、8月と9月の2か月を並行稼働にあて、10月の初めに切り替える。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 500 }), C = z.C;
z.heading(60, 56, '切替の前に、2か月の並行稼働を置く');

// 骨組み：時間の列と作業の行
const g = z.gantt(60, 110, 1080, ['4月', '5月', '6月', '7月', '8月', '9月', '10月'], ['設計', '開発', '検証', '並行稼働', '切替']);

// 期間：始まりと終わりを列の位置で渡す
g.bar(0, 0, 1.5);
g.bar(1, 1, 3.5);
g.bar(2, 3, 4.5);
g.bar(3, 4, 6, { main: true });
g.mark(4, 6);
