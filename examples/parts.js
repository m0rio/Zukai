// parts の見本。HTML 側に <svg id="s"> を置き、rough.js と zukai.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', 'Zukai の部品の見本。人、ロボット、箱、スマホ、金庫、作業キュー、書類の山、机とモニタ、検査ゲート、設計ボード、書類、チェックリスト、鍵、虫眼鏡、照明、棒グラフ、見出し、札、矢印、構造図の箱、円柱、状態、分岐、コンベア。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 1510 }), C = z.C;
const cx = [110, 306, 502, 698, 894, 1090];
const name = (x, y, s) => z.T(x, y, s, { size: 15, anchor: 'middle', fill: C.grey });
const row = (b, cs) => cs.forEach(i => z.ground(cx[i] - 70, cx[i] + 70, b));
z.heading(40, 44, 'Zukai の部品');

let b = 220; row(b, [0, 1, 2, 3, 4, 5]);
z.person(cx[0], b); name(cx[0], b + 26, 'person');
z.person(cx[1], b, { side: true }); name(cx[1], b + 26, 'person { side }');
z.person(cx[2], b, { sweat: true, paper: true }); name(cx[2], b + 26, 'person { sweat, paper }');
z.robot(cx[3], b); name(cx[3], b + 26, 'robot');
z.robot(cx[4], b, { off: true }); name(cx[4], b + 26, 'robot { off }');
z.crate(cx[5], b); name(cx[5], b + 26, 'crate');

b = 440; row(b, [0, 1, 2, 3, 5]);
z.phone(cx[0], b); name(cx[0], b + 26, 'phone');
z.safe(cx[1], b); name(cx[1], b + 26, 'safe');
z.queue(cx[2] - 23, b, 4); name(cx[2], b + 26, 'queue');
z.stack(cx[3] - 56, b, 5, { label: '振込', labelAt: [1] }); name(cx[3], b + 26, 'stack');
z.desk(cx[4] - 80, cx[4] + 80, b - 58); z.monitor(cx[4] - 45, b - 150, 90, 68, b - 58); name(cx[4], b + 26, 'desk / monitor');
z.gate(cx[5], b, { h: 84 }); name(cx[5], b + 26, 'gate');

b = 660; row(b, [0, 1, 2, 3, 4, 5]);
z.board(cx[0] - 65, b - 96, 130, 84); name(cx[0], b + 26, 'board');
z.doc(cx[1] - 32, b - 92, 64, 84); name(cx[1], b + 26, 'doc');
z.clipboard(cx[2] - 34, b - 96, 68, 88); name(cx[2], b + 26, 'clipboard');
z.lock(cx[3], b - 8, { s: 1.7 }); name(cx[3], b + 26, 'lock');
z.magnifier(cx[4] - 10, b - 52, { s: 1.4 }); name(cx[4], b + 26, 'magnifier');
z.bars(cx[5] - 55, b, [30, 60, 96], { main: 2, labels: ['0', '1', '2'] }); name(cx[5], b + 26, 'bars');

b = 890; row(b, [0, 1]);
z.lamp(cx[0], b - 170, { on: true, floor: b, spread: 62 }); name(cx[0], b + 26, 'lamp { on }');
z.lamp(cx[1], b - 170); name(cx[1], b + 26, 'lamp');
z.heading(cx[2] - 44, b - 50, 'heading'); name(cx[2], b + 26, 'heading');
z.sign(cx[3], b - 50, '型検査'); name(cx[3], b + 26, 'sign');
z.arrow([[cx[4] - 62, b - 38], [cx[4], b - 62], [cx[4] + 62, b - 42]]); name(cx[4], b + 26, 'arrow');
z.elbow([[cx[5] - 60, b - 74], [cx[5], b - 74], [cx[5], b - 26], [cx[5] + 60, b - 26]]); name(cx[5], b + 26, 'elbow');

b = 1100;
z.box(cx[0] - 62, b - 74, 124, 58, '箱'); name(cx[0], b + 26, 'box');
z.box(cx[1] - 62, b - 74, 124, 58, '主役', { role: 'main' }); name(cx[1], b + 26, "box { role: 'main' }");
z.box(cx[2] - 62, b - 74, 124, 58, '外部', { role: 'ext' }); name(cx[2], b + 26, "box { role: 'ext' }");
z.cylinder(cx[3] - 58, b - 86, 116, 80, 'DB'); name(cx[3], b + 26, 'cylinder');
z.state(cx[4], b - 45, '状態'); name(cx[4], b + 26, 'state');
z.diamond(cx[5], b - 45, 136, 80, '分岐？'); name(cx[5], b + 26, 'diamond');

b = 1270;
z.dot(cx[0], b - 30); name(cx[0], b + 26, 'dot');
z.conveyor(cx[1] - 60, cx[3] + 60, b - 20); z.crate(cx[1], b - 20); z.crate(cx[2] - 40, b - 20); z.robot(cx[2] + 60, b - 20, { s: 0.8 }); name(cx[2], b + 26, 'conveyor');
z.box(cx[4] - 80, b - 96, 276, 96, 'まとまり', { role: 'scope' }); name(cx[4] + 58, b + 26, "box { role: 'scope' }");

// 4色ボールペンの差し色（青＝注目、赤＝注意、緑＝OK）
b = 1440;
z.box(cx[0] - 62, b - 74, 124, 58, '注目', { accent: 'blue' }); name(cx[0], b + 26, "box { accent: 'blue' }");
z.box(cx[1] - 62, b - 74, 124, 58, '注意', { accent: 'red' }); name(cx[1], b + 26, "box { accent: 'red' }");
z.box(cx[2] - 62, b - 74, 124, 58, 'OK', { accent: 'green' }); name(cx[2], b + 26, "box { accent: 'green' }");
z.arrow([[cx[3] - 60, b - 45], [cx[3] + 60, b - 45]], { stroke: C.blue }); name(cx[3], b + 26, 'arrow { stroke: C.blue }');
z.arrow([[cx[4] - 60, b - 45], [cx[4] + 60, b - 45]], { stroke: C.red }); name(cx[4], b + 26, 'arrow { stroke: C.red }');
z.arrow([[cx[5] - 60, b - 45], [cx[5] + 60, b - 45]], { stroke: C.green }); name(cx[5], b + 26, 'arrow { stroke: C.green }');
