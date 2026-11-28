// quadrant の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '改修の優先度の4象限図。横軸は手間、縦軸は効果。検知ルールの追加と限度額の見直しは、効果が大きく手間が小さい。勘定系の入れ替えは効果も手間も大きい。通知の文言と画面の刷新は効果が小さい。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 630 }), C = z.C;
z.heading(60, 56, '先にやるのは、効果が大きく手間が小さい2件');

// 骨組み：2本の軸と、注目する象限
const q = z.quadrant(220, 130, 760, 430, { xl: '手間', yl: '効果', hi: 'tl' });

// 中身：0〜1 の位置で置く
const p = (u, v, t, o) => {
  o = o || {}; const [x, y] = q.pt(u, v), c = o.main ? C.ink : C.grey;
  z.O(x, y, o.main ? 20 : 15, { roughness: 0.6, stroke: c, fill: c, fillStyle: 'solid' });
  z.T(x + (o.left ? -18 : 18), y, t, { size: 18, anchor: o.left ? 'end' : 'start', halo: C.surface });
};
p(0.20, 0.82, '検知ルールの追加', { main: true });
p(0.30, 0.62, '限度額の見直し', { main: true });
p(0.80, 0.84, '勘定系の入れ替え', { left: true });
p(0.16, 0.22, '通知の文言');
p(0.72, 0.26, '画面の刷新');
