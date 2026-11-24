// swimlane の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '不正の疑いがある振込のスイムレーン図。利用者が依頼し、アプリが受け付け、不正検知が疑いを判定する。疑いがあれば不正検知が保留し、担当者が確認してからアプリが実行する。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 600 }), C = z.C;
z.heading(60, 56, '止めるのは不正検知、通すのは担当者');

// 骨組み：担当ごとのレーン
const s = z.lanes(60, 110, 1080, 110, ['利用者', 'アプリ', '不正検知', '担当者']);
const [u, a, f, p] = s.y;
const b = (x, y, t, o) => z.box(x - 46, y - 26, 92, 52, t, o);

// 受け渡し：下りは「下がってから右」、上りは「右へ出てから上」
z.elbow([[250, u + 32], [250, a], [318, a]]);
z.elbow([[370, a + 32], [370, f], [432, f]]);
z.elbow([[500, f - 42], [500, a], [878, a]]);  z.T(514, a + 38, 'なし', { size: 17 });
z.arrow([[568, f], [628, f]]);                 z.T(598, f - 18, 'あり', { size: 17, anchor: 'middle' });
z.elbow([[680, f + 32], [680, p], [738, p]]);
z.elbow([[842, p], [930, p], [930, a + 32]]);
z.elbow([[982, a], [1060, a], [1060, u + 32]]);

// 作業：担当のレーンに置く
b(250, u, '依頼');
b(370, a, '受付');
z.diamond(500, f, 124, 72, '疑い？');
b(680, f, '保留', { role: 'main' });
b(790, p, '確認');
b(930, a, '実行');
b(1060, u, '結果');
