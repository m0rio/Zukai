// scene の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', 'アプリから出た振込がコンベアで自動チェックのゲートを通り、ほとんどはそのまま勘定系の金庫に届く。止まった1件だけが下に降り、担当者が明かりの下で虫眼鏡で確かめる。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 630 }), C = z.C;
z.heading(62, 66, '人が見るのは、止まった振込だけ');

// 上の場面：振込が自動チェックを通って勘定系へ届く
const G1 = 268, ly = G1 + 50, gx = 432;
z.ground(84, 226, G1); z.ground(952, 1136, G1);
z.conveyor(236, 940, G1);
z.phone(150, G1, { s: 1.2 });
z.gate(gx, G1);
for (let x = 300; x <= 894; x += 66) z.crate(x, G1);
z.safe(1046, G1);
z.T(150, ly, 'アプリ', { size: 17, anchor: 'middle' });
z.T(gx, ly, '自動チェック', { size: 17, anchor: 'middle' });
z.T(1046, ly, '勘定系', { size: 17, anchor: 'middle' });

// 下の場面：止まった1件だけを、人が明かりの下で確かめる
const G2 = 560;
z.lamp(600, 352, { on: true, floor: G2, spread: 176 });
z.ground(410, 780, G2);
z.arrow([[gx, ly + 24], [434, 408], [462, 452], [512, 474]], { head: 12 });
z.person(670, G2, { s: 1.2 });
z.magnifier(560, 480, { s: 2 });
z.crate(560, 492, z.hach(C.ink, 4));
z.T(552, G2 + 28, '止まった1件', { size: 17, anchor: 'middle' });
z.T(670, G2 + 28, '担当者', { size: 17, anchor: 'middle' });
