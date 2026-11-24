// loop の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '検知ルールを良くする循環図。検知する、人が確かめる、結果を記録する、ルールを直す、の順に回り、また検知に戻る。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 620 }), C = z.C;
z.heading(60, 56, '人の判断が、次の検知を良くする');

// 骨組み：回る矢印と、段の位置
const p = z.ring(600, 350, 330, 180, 4);
const b = (i, t, o) => z.box(p[i][0] - 95, p[i][1] - 30, 190, 60, t, o);

// 段
b(0, '検知する');
b(1, '人が確かめる');
b(2, '結果を記録する');
b(3, 'ルールを直す', { role: 'main' });
