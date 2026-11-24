// state の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '振込の状態遷移図。受付、検査中、実行中、完了と進む。検査中に疑いがあれば保留になり、保留からは承認で実行中へ、却下で取消へ進む。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 500 }), C = z.C;
z.heading(60, 56, '保留から出る道は、承認と却下の2つだけ');
const Y = 220, Y2 = 400, t = { size: 17, anchor: 'middle' };

// 遷移
z.arrow([[104, Y], [180, Y]]);
z.arrow([[320, Y], [420, Y]]);
z.arrow([[580, Y], [770, Y]]);               z.T(675, Y - 20, '問題なし', t);
z.arrow([[930, Y], [1008, Y]]);
z.arrow([[530, Y + 36], [630, Y2 - 36]]);    z.T(564, 312, '疑いあり', { size: 17, anchor: 'end' });
z.arrow([[722, Y2 - 36], [820, Y + 36]]);    z.T(788, 312, '承認', { size: 17 });
z.arrow([[748, Y2], [894, Y2]]);             z.T(821, Y2 - 20, '却下', t);

// 状態
z.dot(90, Y);
z.state(250, Y, '受付', { w: 128 });
z.state(500, Y, '検査中', { w: 148 });
z.state(850, Y, '実行中', { w: 148 });
z.state(1074, Y, '完了', { w: 120 });
z.state(675, Y2, '保留', { w: 134, role: 'main' });
z.state(960, Y2, '取消', { w: 120 });
