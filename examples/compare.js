// compare の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '不正検知の位置の比較図。いままでは振込API、勘定系、不正検知の順で、不正に気づくのはお金が動いた後。これからは振込API、不正検知、勘定系の順で、不正ならお金は動かない。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 400 }), C = z.C;
z.heading(60, 56, '検知を、記帳の後から前へ動かす');
const Y = 222;

// いままで
z.T(80, 132, 'いままで', { size: 21 });
z.arrow([[216, Y], [256, Y]]); z.arrow([[384, Y], [424, Y]]);
z.box(80, Y - 32, 130, 64, '振込API');
z.cylinder(262, Y - 42, 116, 84, '勘定系');
z.box(430, Y - 32, 130, 64, '不正検知');
z.T(320, 326, '気づくのは、お金が動いた後', { size: 19, anchor: 'middle' });

// 変化
z.arrow([[586, Y], [652, Y]], { strokeWidth: 4.5, head: 17 });

// これから（同じ部品を、順番だけ変えて並べる）
z.T(680, 132, 'これから', { size: 21 });
z.arrow([[816, Y], [856, Y]]); z.arrow([[998, Y], [1038, Y]]);
z.box(680, Y - 32, 130, 64, '振込API');
z.box(862, Y - 32, 130, 64, '不正検知', { role: 'main' });
z.cylinder(1044, Y - 42, 116, 84, '勘定系');
z.T(920, 326, '不正なら、お金は動かない', { size: 19, anchor: 'middle' });
