// icons の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', 'Zukai の記号と物のアイコンの見本。記号はチェック、ばつ、注意、時計、情報、疑問の6種。物は雲、銀行、硬貨、封筒、カレンダー、かぎ、盾、虫、旗、電球の10種。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 640 }), C = z.C;
const name = (x, y, s) => z.T(x, y, s, { size: 15, anchor: 'middle', fill: C.grey });
z.heading(40, 44, '記号と、物のアイコン');

const mx = [110, 306, 502, 698, 894, 1090];
['check', 'cross', 'alert', 'clock', 'info', 'question'].forEach((k, i) => { z.mark(mx[i], 140, k, { s: 1.4 }); name(mx[i], 200, "mark '" + k + "'"); });

const px = [140, 370, 600, 830, 1060];
const row = (b, ks) => ks.forEach((k, i) => { z.ground(px[i] - 70, px[i] + 70, b); z[k](k === 'flag' ? px[i] - 20 : px[i], b, { s: 1.2 }); name(px[i], b + 26, k); });
row(390, ['cloud', 'bank', 'coin', 'mail', 'calendar']);
row(580, ['key', 'shield', 'bug', 'flag', 'bulb']);
