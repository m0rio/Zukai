// layers の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '振込アプリの層の図。上から画面、ユースケース、ドメイン、インフラの4層。限度額、手数料、検知ルールはドメインの層にある。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 580 }), C = z.C;
z.heading(60, 56, '振込のルールは、ドメインの層だけに置く');

// 骨組み：上から下へ積んだ層
const [ui, uc, dm, inf] = z.layers(220, 110, 760, 96, ['画面', 'ユースケース', 'ドメイン', 'インフラ'], { main: 2 });
const b = (l, i, t) => z.box(l.x + i * 172, l.cy - 27, 148, 54, t);

// 中身：層の中に置く
b(ui, 0, '入力'); b(ui, 1, '確認'); b(ui, 2, '完了');
b(uc, 0, '振込する');
b(dm, 0, '限度額'); b(dm, 1, '手数料'); b(dm, 2, '検知ルール');
b(inf, 0, 'API通信'); z.cylinder(inf.x + 172, inf.cy - 34, 148, 68, '履歴');
