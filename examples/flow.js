// flow の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '振込の流れ図。入力のあと、限度額以内かを確かめ、いいえなら断る。はいなら疑いがないかを確かめ、いいえなら保留する。はいなら実行して完了する。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 470 }), C = z.C;
z.heading(60, 56, '実行までに、関門は2つ');
const Y = 220, t = { size: 17, anchor: 'middle' };

// 流れ：はいは右へ、いいえは下へ
z.arrow([[216, Y], [286, Y]]);
z.arrow([[494, Y], [576, Y]]);   z.T(535, Y - 20, 'はい', t);
z.arrow([[784, Y], [874, Y]]);   z.T(829, Y - 20, 'はい', t);
z.arrow([[1006, Y], [1054, Y]]);
z.arrow([[390, Y + 56], [390, 366]]);  z.T(404, 318, 'いいえ', { size: 17 });
z.arrow([[680, Y + 56], [680, 366]]);  z.T(694, 318, 'いいえ', { size: 17 });

// 手順と分岐
z.box(90, Y - 28, 120, 56, '入力');
z.diamond(390, Y, 196, 100, '限度額以内？');
z.diamond(680, Y, 196, 100, '疑いなし？');
z.box(880, Y - 28, 120, 56, '実行', { role: 'main' });
z.box(1060, Y - 28, 100, 56, '完了');
z.box(330, 372, 120, 56, '断る');
z.box(620, 372, 120, 56, '保留');
