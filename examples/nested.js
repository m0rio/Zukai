// nested の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '不正検知のルールの体系図。金額、宛先、端末の3つのまとまりがあり、金額は限度額を超える・いつもより高額、宛先は初めての宛先・要注意の口座、端末は新しい端末・海外からの操作を含む。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 450 }), C = z.C;
z.heading(60, 56, '見るのは、金額・宛先・端末の3つ');

// まとまりを枠で囲み、中身を入れる（入れ子は2階層まで）
[['金額', ['限度額を超える', 'いつもより高額']],
 ['宛先', ['初めての宛先', '要注意の口座']],
 ['端末', ['新しい端末', '海外からの操作']]].forEach(([name, items], i) => {
  const x = 60 + i * 370;
  z.box(x, 110, 340, 290, name, { role: 'scope', size: 20 });
  items.forEach((t, j) => z.box(x + 40, 176 + j * 110, 260, 72, t));
});
