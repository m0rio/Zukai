// timeline の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '振込の年表。2019年は窓口で振込、2021年はアプリで振込、2023年は24時間いつでも、2025年は自動で不正検知。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 440 }), C = z.C;
z.heading(60, 56, '6年で、窓口から自動の検知まで来た');
const Y = 300, G = Y - 26;

// 骨組み：時間の軸
const x = z.axis(70, 1150, Y, ['2019', '2021', '2023', '2025']);

// できごと：中身に合う絵を、目盛りの上に置く
z.desk(x[0] - 66, x[0] + 66, G - 58); z.person(x[0], G - 58, { s: 0.8, side: true, paper: true });
z.phone(x[1], G);
z.lamp(x[2], 120, { on: true, floor: G, spread: 62 }); z.phone(x[2], G);
z.gate(x[3], G, { h: 92 }); z.crate(x[3], G);
['窓口で振込', 'アプリで振込', '24時間いつでも'].forEach((s, i) => z.T(x[i], Y + 68, s, { size: 19, anchor: 'middle' }));
z.heading(x[3], Y + 68, '自動で不正検知', { size: 19, anchor: 'middle' });
