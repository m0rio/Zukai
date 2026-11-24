// concept の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '保留をめぐるコンセプトマップ。限度額は超えると保留を起こし、不正検知は疑うと保留を起こす。保留を解くのは担当者。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 480 }), C = z.C;
z.heading(60, 56, '保留を起こすものは2つ、解けるのは1人');
const t = { size: 17, anchor: 'middle' };

// 関係：矢印に動詞を付ける
z.arrow([[326, 205], [504, 282]]);  z.T(440, 202, '超えると起こす', t);
z.arrow([[326, 400], [504, 324]]);  z.T(452, 398, '疑うと起こす', t);
z.arrow([[932, 302], [698, 302]]);  z.T(815, 282, '解く', t);

// 概念
z.box(140, 160, 180, 64, '限度額');
z.box(140, 380, 180, 64, '不正検知');
z.box(510, 268, 180, 68, '保留', { role: 'main' });
z.person(984, 344); z.T(984, 370, '担当者', { anchor: 'middle' });
