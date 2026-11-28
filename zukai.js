/*! Zukai parts — rough.js の上に載せる手描き風の部品集
 *  使い方: const z = Zukai.create(svg, { width: 1200, height: 630 }); z.person(150, 480);
 *  先に rough.js（4.6.6）を読み込んでおく。色と線の値は SKILL.md 4章と同じ。
 *  絵柄はホワイトボードの手書き：白地に黒、差し色は赤・青・緑、実物は実物の色、公式アイコンは zukai-icons.js。 */
(function (g) {
  const NS = 'http://www.w3.org/2000/svg';
  const THEME = {
    // 基本の形：白地に黒。4色ボールペンの赤・青・緑だけを足す
    surface: '#ffffff',  // 地（ホワイトボード）
    raised: '#ffffff',   // 白い面
    sunken: '#ececec',   // 沈んだ面
    ink: '#1a1a1a',      // 黒（線・文字・主役）
    grey: '#7d7d7d',     // 脇役の線・外部・データ
    blue: '#1d5fd1',     // 青＝注目（新しい側・自動の部分・注目する範囲）
    red: '#d6332a',      // 赤＝注意（問題・NG・危険）
    green: '#1a8f3c',    // 緑＝OK（成功・完了）
    onInk: '#ffffff',    // 黒ベタの上の文字
    // 実物の色（小道具の塗りだけに使う。箱や矢印には使わない）
    gold: '#f2c230',     // 硬貨・かぎ・錠
    light: '#ffe36e',    // 明かり（電球・ランプ）
    glass: '#cfe6f7',    // 画面・レンズ
    water: '#6fb6ea',    // 汗・水
    steel: '#aab3bc',    // 金属（ゲート・留め金・盾）
    steelDark: '#77828d',// 濃い金属（金庫・ローラー）
    body: '#2e2e2e',     // 黒い機器（スマホ・モニタの枠）
    cardboard: '#d2a56b',// 段ボール
    wood: '#b9824f',     // 木（机）
    stone: '#e3dccd',    // 石（銀行）
    kraft: '#f6e8c3',    // 封筒
  };
  // 前の絵柄の名前でも引けるようにする
  Object.assign(THEME, { navy: THEME.ink, onNavy: THEME.onInk, sky: THEME.blue, navySoft: THEME.glass, marker: THEME.light });
  const FONT = "'Yusei Magic','Noto Sans JP','Noto Sans CJK JP',sans-serif";
  // 文字幅の見積もり（全角=1、半角=0.6）
  const tw = (s, size) => [...String(s)].reduce((n, ch) => n + (ch.charCodeAt(0) < 0x2000 ? 0.6 : 1), 0) * size;

  function create(svg, opt) {
    opt = opt || {};
    const C = Object.assign({}, THEME, opt.colors);
    const rc = rough.svg(svg);
    let seed = opt.seed || 1;
    const add = n => (svg.appendChild(n), n);
    if (opt.width && opt.height) {
      svg.setAttribute('viewBox', `0 0 ${opt.width} ${opt.height}`);
      if (opt.background !== false) {
        const bg = document.createElementNS(NS, 'rect');
        bg.setAttribute('width', opt.width); bg.setAttribute('height', opt.height); bg.setAttribute('fill', C.surface);
        add(bg);
      }
    }

    // ── 基本の線と面 ──
    const base = o => Object.assign({ roughness: 1.2, bowing: 1, stroke: C.ink, strokeWidth: 2.5, seed: seed++ }, o);
    const hach = (c, gap, o) => Object.assign({ fill: c, fillStyle: 'hachure', hachureGap: gap || 5, fillWeight: 1.5 }, o);
    const solid = c => ({ fill: c, fillStyle: 'solid' });
    const under = c => ({ fill: c || C.raised, fillStyle: 'solid', stroke: 'none', roughness: 0 });
    const L = (a, b, c, d, o) => add(rc.line(a, b, c, d, base(o)));
    const R = (x, y, w, h, o) => add(rc.rectangle(x, y, w, h, base(o)));
    const O = (x, y, d, o) => add(rc.circle(x, y, d, base(o)));
    const P = (d, o) => add(rc.path(d, base(o)));
    const PL = (pts, o) => add(rc.linearPath(pts, base(o)));
    const PG = (pts, o) => add(rc.polygon(pts, base(o)));
    // 白を敷いてから描く四角（後ろの線を透かさない）
    const RH = (x, y, w, h, o) => { add(rc.rectangle(x, y, w, h, under())); return R(x, y, w, h, o); };

    // ── 文字 ──
    const T = (x, y, s, o) => {
      o = o || {};
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('font-family', FONT);
      t.setAttribute('font-size', o.size || 18);
      t.setAttribute('fill', o.fill || C.ink);
      t.setAttribute('text-anchor', o.anchor || 'start');
      t.setAttribute('dominant-baseline', 'central');
      if (o.halo) {
        t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke', o.halo === true ? C.raised : o.halo);
        t.setAttribute('stroke-width', 6); t.setAttribute('stroke-linejoin', 'round');
      }
      t.textContent = s;
      return add(t);
    };
    // 見出し（黒の文字だけ。マーカーは引かない）
    const heading = (x, y, s, o) => {
      o = o || {};
      return T(x, y, s, { size: o.size || 26, anchor: o.anchor, fill: o.fill });
    };
    // 札（白い板に名前）。x, y は中心
    const sign = (x, y, s, o) => {
      o = o || {};
      const size = o.size || 18, w = tw(s, size) + 28, h = size + 18;
      RH(x - w / 2, y - h / 2, w, h, Object.assign(solid(C.raised), { strokeWidth: 2 }));
      return T(x, y + 1, s, { size, anchor: 'middle' });
    };
    // 矢印。pts は通過点（2点なら直線、3点以上は曲線）。頭は最後の2点の向き
    const tip = (pts, head, o) => {
      const [ax, ay] = pts[pts.length - 2], [bx, by] = pts[pts.length - 1];
      const a = Math.atan2(by - ay, bx - ax);
      for (const d of [0.5, -0.5]) {
        L(bx, by, bx - head * Math.cos(a + d), by - head * Math.sin(a + d), Object.assign({}, o, { roughness: 0.8, strokeLineDash: undefined }));
      }
    };
    const arrow = (pts, o) => {
      o = Object.assign({ strokeWidth: 2.5 }, o);
      const head = o.head || 13; delete o.head;
      if (pts.length === 2) L(pts[0][0], pts[0][1], pts[1][0], pts[1][1], o);
      else add(rc.curve(pts, base(o)));
      tip(pts, head, o);
    };
    // 折れ線の矢印。pts の点を直線でつなぐ（直角に曲げる経路に使う）
    const elbow = (pts, o) => {
      o = Object.assign({ strokeWidth: 2.5 }, o);
      const head = o.head || 12; delete o.head;
      PL(pts, o);
      tip(pts, head, o);
    };
    const ground = (x1, x2, y, o) => L(x1, y, x2, y, Object.assign({ stroke: C.grey, strokeWidth: 2 }, o));

    // ── 人とエージェント ──
    // 人（胸像・顔なし）。x: 中心、b: 足元の線、{ s: 倍率, side: 脇役, sweat: 汗, paper: 紙を持つ }
    const person = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const w = 36 * s, h = 62 * s;
      const d = `M ${x - w} ${b} C ${x - w} ${b - h * 0.85}, ${x - w * 0.6} ${b - h}, ${x} ${b - h} C ${x + w * 0.6} ${b - h}, ${x + w} ${b - h * 0.85}, ${x + w} ${b} Z`;
      add(rc.path(d, under(C.surface)));
      P(d, o.side ? Object.assign(hach(C.grey, 5, { hachureAngle: -50 }), { stroke: C.grey }) : hach(C.ink, 4, { hachureAngle: -50 }));
      O(x, b - h - 27 * s, 48 * s, Object.assign(solid(C.raised), o.side ? { stroke: C.grey } : {}));
      if (o.sweat) {
        const drop = (dx, dy, k) => P(`M ${dx} ${dy} q ${5 * k} ${9 * k} 0 ${14 * k} q ${-5 * k} ${-5 * k} 0 ${-14 * k} Z`,
          { strokeWidth: 1.2, roughness: 0.6, fill: C.water, fillStyle: 'solid' });
        drop(x + 34 * s, b - h - 52 * s, s); drop(x + 43 * s, b - h - 36 * s, s * 0.85);
      }
      if (o.paper) {
        add(rc.rectangle(x - 46 * s, b - 58 * s, 20 * s, 27 * s, under()));
        R(x - 46 * s, b - 58 * s, 20 * s, 27 * s, { strokeWidth: 2 });
      }
    };
    // エージェント（ロボット。目は点だけ）。x: 中心、b: 足元、{ s: 倍率, off: 止まっている }
    const robot = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      L(x - 8 * s, b - 12 * s, x - 8 * s, b, { strokeWidth: 2 }); L(x + 8 * s, b - 12 * s, x + 8 * s, b, { strokeWidth: 2 });
      RH(x - 18 * s, b - 46 * s, 36 * s, 34 * s, o.off ? Object.assign(hach(C.grey, 5, { hachureAngle: 60 }), { stroke: C.grey }) : hach(C.ink, 5, { hachureAngle: 60 }));
      L(x, b - 72 * s, x, b - 84 * s, { strokeWidth: 2 });
      O(x, b - 87 * s, 6 * s, { strokeWidth: 1.5, roughness: 0.6, fill: C.ink, fillStyle: 'solid' });
      RH(x - 15 * s, b - 72 * s, 30 * s, 24 * s, solid(C.raised));
      for (const dx of [-6, 6]) O(x + dx * s, b - 60 * s, 5 * s, { strokeWidth: 1, roughness: 0.4, fill: C.ink, fillStyle: 'solid' });
    };

    // ── 小道具 ──
    // 流れてくる箱。x: 中心、b: 底
    const crate = (x, b, o) => RH(x - 13, b - 23, 26, 23, Object.assign(solid(C.cardboard), { strokeWidth: 2 }, o));
    // ベルトコンベア。y: ベルトの上面（物はここに立たせる）
    const conveyor = (x1, x2, y) => {
      L(x1, y, x2, y); L(x1, y + 7, x2, y + 7, { strokeWidth: 2 });
      const n = Math.max(1, Math.round((x2 - x1) / 58));
      for (let i = 0; i <= n; i++) O(x1 + 14 + i * ((x2 - x1 - 28) / n), y + 17, 11, { strokeWidth: 2, roughness: 0.8, fill: C.steelDark, fillStyle: 'solid' });
    };
    // 作業キュー（積んだ棚）。x: 左、b: 底、n: 段数
    const queue = (x, b, n) => {
      for (let i = 0; i < (n || 4); i++) {
        const y = b - (i + 1) * 20;
        RH(x, y, 46, 20, Object.assign(solid(C.raised), { strokeWidth: 2 }));
        R(x + 7, y + 6, 8, 8, { strokeWidth: 1, roughness: 0.5, fill: C.cardboard, fillStyle: 'solid' });
      }
    };
    // 書類の山。x: 左、b: 底、n: 枚数、{ w, h, label, labelAt: [段] }
    const stack = (x, b, n, o) => {
      o = o || {}; const w = o.w || 104, h = o.h || 19;
      for (let i = 0; i < n; i++) {
        const dx = (i % 2 ? 8 : 0) + ((i * 7) % 5) - 2, y = b - (i + 1) * h;
        RH(x + dx, y, w, h, Object.assign(solid(C.raised), { strokeWidth: 2 }));
        if (o.labelAt && o.labelAt.includes(i)) T(x + dx + 22, y + h / 2 + 1, o.label, { size: 11, fill: C.grey });
      }
    };
    // 机。y: 天板
    const desk = (x1, x2, y) => { L(x1 + 18, y + 8, x1 + 18, y + 58); L(x2 - 18, y + 8, x2 - 18, y + 58); RH(x1, y, x2 - x1, 8, Object.assign(solid(C.wood), { strokeWidth: 2 })); };
    // モニタ。b: 置く面
    const monitor = (x, y, w, h, b) => {
      RH(x, y, w, h, solid(C.body));
      R(x + 6, y + 6, w - 12, h - 12, { stroke: 'none', roughness: 0.5, fill: C.raised, fillStyle: 'solid' });
      L(x + w / 2, y + h, x + w / 2, b - 2); L(x + w / 2 - 26, b - 2, x + w / 2 + 26, b - 2);
      const ln = (a, c, yy, col, sw) => L(x + a, y + yy, x + c, y + yy, { stroke: col, strokeWidth: sw, roughness: 0.8 });
      ln(18, w * 0.57, h * 0.26, C.grey, 2); ln(30, w - 18, h * 0.42, C.ink, 3); ln(18, w * 0.68, h * 0.58, C.grey, 2); ln(18, w * 0.49, h * 0.74, C.grey, 2);
    };
    // 検査ゲート。x: 中心、b: 足元
    const gate = (x, b, o) => {
      o = o || {}; const w = o.w || 64, h = o.h || 112;
      L(x - w / 2, b, x - w / 2, b - h); L(x + w / 2, b, x + w / 2, b - h);
      RH(x - w / 2 - 6, b - h - 26, w + 12, 26, solid(C.steel));
      PL([[x - 9, b - h - 13], [x - 2, b - h - 6], [x + 11, b - h - 21]], { stroke: C.green, strokeWidth: 3.5, roughness: 0.6 });
    };
    // 設計ボード（格子＋段のある線）
    const board = (x, y, w, h) => {
      RH(x, y, w, h, solid(C.raised));
      for (const k of [1, 2]) {
        L(x + (w * k) / 3, y + 3, x + (w * k) / 3, y + h - 3, { stroke: C.glass, strokeWidth: 1.5, roughness: 0.5 });
        L(x + 3, y + (h * k) / 3, x + w - 3, y + (h * k) / 3, { stroke: C.glass, strokeWidth: 1.5, roughness: 0.5 });
      }
      PL([[x + 14, y + h * 0.8], [x + w * 0.36, y + h * 0.8], [x + w * 0.36, y + h * 0.36], [x + w * 0.66, y + h * 0.36], [x + w * 0.66, y + h * 0.64], [x + w - 12, y + h * 0.64]],
        { strokeWidth: 3, roughness: 0.7 });
    };
    // 書類（1枚）。{ lines: 行数 }
    const doc = (x, y, w, h, o) => {
      o = o || {}; const n = o.lines || 3;
      RH(x, y, w, h, solid(C.raised));
      for (let i = 0; i < n; i++) {
        const yy = y + h * (0.26 + (0.5 / Math.max(1, n - 1)) * i);
        L(x + w * 0.18, yy, x + w * (i === n - 1 ? 0.58 : 0.82), yy, { stroke: C.grey, strokeWidth: 2, roughness: 0.8 });
      }
    };
    // チェックリスト。{ rows: 行数 }
    const clipboard = (x, y, w, h, o) => {
      o = o || {}; const n = o.rows || 3;
      RH(x, y, w, h, solid(C.raised));
      RH(x + w * 0.32, y - 7, w * 0.36, 13, Object.assign(solid(C.steel), { strokeWidth: 2, roughness: 0.8 }));
      for (let i = 0; i < n; i++) {
        const yy = y + h * (0.3 + (0.5 / Math.max(1, n - 1)) * i);
        PL([[x + w * 0.16, yy], [x + w * 0.23, yy + 6], [x + w * 0.36, yy - 8]], { strokeWidth: 2.5, roughness: 0.6 });
        L(x + w * 0.48, yy, x + w * 0.84, yy, { stroke: C.grey, strokeWidth: 2, roughness: 0.8 });
      }
    };
    // 鍵。x: 中心、b: 底
    const lock = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      P(`M ${x - 9 * s} ${b - 22 * s} v ${-9 * s} a ${9 * s} ${9 * s} 0 0 1 ${18 * s} 0 v ${9 * s}`, { roughness: 0.8 });
      RH(x - 15 * s, b - 22 * s, 30 * s, 22 * s, solid(C.gold));
      O(x, b - 11 * s, 5 * s, { strokeWidth: 1, roughness: 0.4, fill: C.ink, fillStyle: 'solid' });
    };
    // 虫眼鏡。x, y: レンズの中心
    const magnifier = (x, y, o) => {
      o = o || {}; const s = o.s || 1;
      L(x + 12 * s, y + 12 * s, x + 30 * s, y + 30 * s, { strokeWidth: 4.5 });
      O(x, y, 34 * s, solid(C.glass));
    };
    // 吊り照明。x: 中心、y: 天井、{ on: 点灯, floor: 明かりが届く y, spread: 明かりの半幅 }
    const lamp = (x, y, o) => {
      o = o || {}; const drop = o.drop || 30;
      if (o.on && o.floor) {
        const sp = o.spread || 70;
        PG([[x - 18, y + drop + 20], [x + 18, y + drop + 20], [x + sp, o.floor], [x - sp, o.floor]],
          { stroke: 'none', fill: C.light, fillStyle: 'hachure', hachureGap: 6, fillWeight: 2.5, hachureAngle: -60 });
      }
      L(x, y, x, y + drop, { strokeWidth: 2 });
      const shade = [[x - 10, y + drop], [x + 10, y + drop], [x + 22, y + drop + 18], [x - 22, y + drop + 18]];
      add(rc.polygon(shade, under(C.raised)));
      PG(shade, o.on ? solid(C.body) : Object.assign(solid(C.raised), { strokeWidth: 2 }));
      if (o.on) O(x, y + drop + 21, 9, { strokeWidth: 1.5, roughness: 0.5, fill: C.light, fillStyle: 'solid' });
    };
    // 棒グラフ。x: 左、b: 底、vals: 高さ（px）、{ w, gap, main: 主役の番号, labels: [上の数字] }
    const bars = (x, b, vals, o) => {
      o = o || {}; const w = o.w || 30, gap = o.gap == null ? 10 : o.gap;
      vals.forEach((v, i) => {
        const bx = x + i * (w + gap);
        RH(bx, b - v, w, v, i === o.main ? hach(C.ink, 3.5) : Object.assign(hach(C.grey, 5), { stroke: C.grey }));
        if (o.labels) T(bx + w / 2, b - v - 14, o.labels[i], { size: o.size || 16, anchor: 'middle' });
      });
    };

    // ── 記号と、物のアイコン ──
    // 状態の記号。x, y: 中心、kind: check / cross / alert / clock / info / question、{ s: 倍率 }
    const mark = (x, y, kind, o) => {
      o = o || {}; const s = o.s || 1;
      const col = o.color || { check: C.green, cross: C.red, alert: C.red, info: C.blue }[kind] || C.ink;
      const w = { stroke: col, strokeWidth: 3.5 * Math.max(0.8, s), roughness: 0.6 };
      const pt = (dx, dy) => O(x + dx * s, y + dy * s, 5 * s, { stroke: col, strokeWidth: 1, roughness: 0.4, fill: col, fillStyle: 'solid' });
      if (kind === 'alert') {
        const tri = [[x, y - 23 * s], [x + 25 * s, y + 19 * s], [x - 25 * s, y + 19 * s]];
        add(rc.polygon(tri, under())); PG(tri, { stroke: col, roughness: 0.9 });
        L(x, y - 8 * s, x, y + 5 * s, w); pt(0, 12);
        return;
      }
      add(rc.circle(x, y, 44 * s, under())); O(x, y, 44 * s, { stroke: col, roughness: 0.9 });
      if (kind === 'check') PL([[x - 10 * s, y + 1 * s], [x - 3 * s, y + 9 * s], [x + 11 * s, y - 9 * s]], w);
      else if (kind === 'cross') { L(x - 9 * s, y - 9 * s, x + 9 * s, y + 9 * s, w); L(x + 9 * s, y - 9 * s, x - 9 * s, y + 9 * s, w); }
      else if (kind === 'clock') { L(x, y, x, y - 12 * s, w); L(x, y, x + 9 * s, y + 5 * s, w); }
      else if (kind === 'info') { pt(0, -10); L(x, y - 2 * s, x, y + 11 * s, w); }
      else if (kind === 'question') {
        P(`M ${x - 7 * s} ${y - 6 * s} q 0 ${-8 * s} ${7 * s} ${-8 * s} q ${8 * s} 0 ${8 * s} ${7 * s} q 0 ${5 * s} ${-8 * s} ${9 * s} v ${3 * s}`, w);
        pt(0, 12);
      }
    };
    // 雲（外のサービス）。x: 中心、b: 底
    const cloud = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const d = `M ${x - 30 * s} ${b} h ${60 * s} a ${15 * s} ${15 * s} 0 0 0 ${2 * s} ${-30 * s} a ${20 * s} ${20 * s} 0 0 0 ${-36 * s} ${-10 * s} a ${14 * s} ${14 * s} 0 0 0 ${-24 * s} ${12 * s} a ${14 * s} ${14 * s} 0 0 0 ${-2 * s} ${28 * s} Z`;
      add(rc.path(d, under())); P(d, { roughness: 0.8 });
    };
    // 銀行。x: 中心、b: 底
    const bank = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const roof = [[x - 40 * s, b - 48 * s], [x, b - 74 * s], [x + 40 * s, b - 48 * s]];
      PG(roof, Object.assign(solid(C.stone), { roughness: 0.8 }));
      for (const dx of [-24, 0, 24]) RH(x + (dx - 6) * s, b - 48 * s, 12 * s, 38 * s, Object.assign(solid(C.stone), { strokeWidth: 2 }));
      RH(x - 40 * s, b - 10 * s, 80 * s, 10 * s, solid(C.stone));
    };
    // 硬貨（お金）。x: 中心、b: 底
    const coin = (x, b, o) => {
      o = o || {}; const s = o.s || 1, y = b - 28 * s, w = { strokeWidth: 3, roughness: 0.6 };
      O(x, y, 56 * s, Object.assign(solid(C.gold), { roughness: 0.9 }));
      PL([[x - 10 * s, y - 15 * s], [x, y - 2 * s], [x + 10 * s, y - 15 * s]], w); L(x, y - 2 * s, x, y + 16 * s, w);
      L(x - 9 * s, y + 1 * s, x + 9 * s, y + 1 * s, w); L(x - 9 * s, y + 8 * s, x + 9 * s, y + 8 * s, w);
    };
    // 封筒（メール・通知）。x: 中心、b: 底
    const mail = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      RH(x - 36 * s, b - 50 * s, 72 * s, 50 * s, solid(C.kraft));
      PL([[x - 35 * s, b - 49 * s], [x, b - 22 * s], [x + 35 * s, b - 49 * s]], { strokeWidth: 2, roughness: 0.8 });
    };
    // カレンダー（日付・期限）。x: 中心、b: 底
    const calendar = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      RH(x - 31 * s, b - 60 * s, 62 * s, 60 * s, solid(C.raised));
      RH(x - 31 * s, b - 60 * s, 62 * s, 15 * s, Object.assign(solid(C.red), { roughness: 0.8 }));
      for (const dx of [-15, 15]) L(x + dx * s, b - 68 * s, x + dx * s, b - 55 * s, { strokeWidth: 3, roughness: 0.5 });
      [[-17, -32], [0, -32], [17, -32], [-17, -15], [0, -15], [17, -15]].forEach(([dx, dy], i) =>
        R(x + (dx - 5) * s, b + (dy - 5) * s, 10 * s, 10 * s, { strokeWidth: 1, roughness: 0.5, stroke: i === 4 ? C.red : C.grey, fill: i === 4 ? C.red : C.sunken, fillStyle: 'solid' }));
    };
    // かぎ（認証・権限）。x: 中心、b: 底
    const key = (x, b, o) => {
      o = o || {}; const s = o.s || 1, y = b - 18 * s, w = { strokeWidth: 3.5, roughness: 0.6 };
      L(x - 8 * s, y, x + 36 * s, y, w); L(x + 22 * s, y, x + 22 * s, y + 11 * s, w); L(x + 34 * s, y, x + 34 * s, y + 14 * s, w);
      O(x - 22 * s, y, 32 * s, Object.assign(solid(C.gold), { strokeWidth: 3, roughness: 0.8 })); O(x - 22 * s, y, 9 * s, { strokeWidth: 1.5, roughness: 0.5, fill: C.raised, fillStyle: 'solid' });
    };
    // 盾（守る）。x: 中心、b: 底
    const shield = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const d = `M ${x} ${b} C ${x - 22 * s} ${b - 10 * s}, ${x - 30 * s} ${b - 28 * s}, ${x - 30 * s} ${b - 58 * s} L ${x} ${b - 70 * s} L ${x + 30 * s} ${b - 58 * s} C ${x + 30 * s} ${b - 28 * s}, ${x + 22 * s} ${b - 10 * s}, ${x} ${b} Z`;
      P(d, Object.assign(solid(C.steel), { roughness: 0.8 }));
      PL([[x - 12 * s, b - 37 * s], [x - 3 * s, b - 27 * s], [x + 13 * s, b - 48 * s]], { strokeWidth: 3.5, roughness: 0.6 });
    };
    // 虫（不具合）。x: 中心、b: 底
    const bug = (x, b, o) => {
      o = o || {}; const s = o.s || 1, y = b - 26 * s, w = { strokeWidth: 2, roughness: 0.7 };
      for (const k of [-1, 1]) {
        for (const dy of [-12, 0, 12]) L(x + k * 14 * s, y + dy * s, x + k * 32 * s, y + (dy * 1.7 - 2) * s, w);
        L(x + k * 5 * s, b - 58 * s, x + k * 13 * s, b - 72 * s, w);
      }
      add(rc.ellipse(x, y, 38 * s, 48 * s, base(solid(C.red)))); L(x, y - 22 * s, x, y + 23 * s, w);
      O(x, b - 54 * s, 20 * s, Object.assign(solid(C.body), { roughness: 0.8 }));
    };
    // 旗（目標・節目）。x: 竿の位置、b: 底
    const flag = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const f = [[x, b - 74 * s], [x + 48 * s, b - 60 * s], [x, b - 44 * s]];
      PG(f, Object.assign(solid(C.red), { roughness: 0.8 }));
      L(x, b, x, b - 76 * s, { strokeWidth: 3.5, roughness: 0.6 });
    };
    // 電球（気づき・案）。x: 中心、b: 底
    const bulb = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      O(x, b - 46 * s, 46 * s, Object.assign(solid(C.light), { roughness: 0.9 }));
      RH(x - 10 * s, b - 24 * s, 20 * s, 16 * s, Object.assign(solid(C.steel), { strokeWidth: 2, roughness: 0.8 }));
      L(x - 9 * s, b - 16 * s, x + 9 * s, b - 16 * s, { strokeWidth: 2, roughness: 0.6 });
      L(x - 6 * s, b - 5 * s, x + 6 * s, b - 5 * s, { strokeWidth: 3, roughness: 0.5 });
      PL([[x - 7 * s, b - 46 * s], [x - 3 * s, b - 38 * s], [x + 3 * s, b - 38 * s], [x + 7 * s, b - 46 * s]], { strokeWidth: 2, roughness: 0.6 });
    };

    // ── 公式アイコン（AWS・言語・ツール）──
    // 形も色も公式のまま置く。先に zukai-icons.js を読み込む。x, y: 中心、{ size: 大きさ, label: 下に添える名前 }
    const icon = (x, y, name, o) => {
      o = o || {}; const size = o.size || 64, ic = (g.ZukaiIcons || {})[name];
      if (!ic) {
        console.error('Zukai: アイコン ' + name + ' が無い（zukai-icons.js を読み込む。一覧は icons.json）');
        R(x - size / 2, y - size / 2, size, size, { stroke: C.grey, strokeWidth: 2, strokeLineDash: [6, 5] });
        T(x, y, name, { size: 12, anchor: 'middle', fill: C.grey });
      } else {
        const k = size / Math.max(ic.w, ic.h), w = ic.w * k, h = ic.h * k;
        const im = document.createElementNS(NS, 'image');
        im.setAttribute('x', x - w / 2); im.setAttribute('y', y - h / 2); im.setAttribute('width', w); im.setAttribute('height', h);
        im.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ic.svg));
        add(im);
      }
      if (o.label) T(x, y + size / 2 + 16, o.label, { size: o.labelSize || 16, anchor: 'middle' });
    };

    // ── 構造図の箱（役割で形と色を決める）──
    // role: main（主役）/ system（システム・処理）/ data（データ）/ ext（外部）/ scope（範囲）
    // accent: 'blue'（注目）/ 'red'（注意）/ 'green'（OK）。その色の枠と斜線にする
    const box = (x, y, w, h, label, o) => {
      o = o || {}; const role = o.role || 'system', size = o.size || 18;
      const ac = o.accent && C[o.accent];
      if (ac) RH(x, y, w, h, Object.assign(hach(ac, 7, { fillWeight: 1.2 }), { stroke: ac }));
      else if (role === 'main') RH(x, y, w, h, solid(C.ink));
      else if (role === 'data') RH(x, y, w, h, Object.assign(hach(C.grey, 6), { stroke: C.grey }));
      else if (role === 'ext') R(x, y, w, h, { stroke: C.grey, strokeWidth: 2, strokeLineDash: [8, 6] });
      else if (role === 'scope') R(x, y, w, h);
      else RH(x, y, w, h, solid(C.raised));
      if (!label) return;
      if (role === 'scope') return T(x + 14, y + 20, label, { size: o.size || 16 });
      const ty = o.sub ? y + h / 2 - size * 0.55 : y + h / 2 + 1;
      T(x + w / 2, ty, label, { size, anchor: 'middle', fill: ac ? C.ink : role === 'main' ? C.onInk : C.ink, halo: ac ? true : role === 'data' });
      if (o.sub) T(x + w / 2, y + h / 2 + size * 0.65, o.sub, { size: size * 0.72, anchor: 'middle', fill: role === 'main' ? C.onInk : C.ink, halo: role === 'data' });
    };
    // データ・保存先（円柱）
    const cylinder = (x, y, w, h, label, o) => {
      o = o || {}; const ry = 9;
      const d = `M ${x} ${y + ry} v ${h - 2 * ry} a ${w / 2} ${ry} 0 0 0 ${w} 0 v ${-(h - 2 * ry)} a ${w / 2} ${ry} 0 0 0 ${-w} 0 Z`;
      add(rc.path(d, under()));
      P(d, Object.assign(hach(C.grey, 6), { stroke: C.grey }));
      add(rc.ellipse(x + w / 2, y + ry, w, ry * 2, base({ stroke: C.grey, fill: C.raised, fillStyle: 'solid' })));
      if (label) T(x + w / 2, y + h / 2 + 6, label, { size: o.size || 18, anchor: 'middle', halo: true });
    };

    // スマホ。x: 中心、b: 底
    const phone = (x, b, o) => {
      o = o || {}; const s = o.s || 1, w = 46 * s, h = 80 * s;
      RH(x - w / 2, b - h, w, h, solid(C.body));
      R(x - w / 2 + 6 * s, b - h + 10 * s, w - 12 * s, h - 26 * s, { stroke: 'none', roughness: 0.7, fill: C.glass, fillStyle: 'solid' });
      L(x - 7 * s, b - 8 * s, x + 7 * s, b - 8 * s, { stroke: C.raised, strokeWidth: 2, roughness: 0.6 });
    };
    // 金庫。x: 中心、b: 底
    const safe = (x, b, o) => {
      o = o || {}; const s = o.s || 1, w = 104 * s, h = 96 * s, f = 8 * s, y = b - f - h;
      L(x - w / 2 + 14 * s, b - f, x - w / 2 + 14 * s, b); L(x + w / 2 - 14 * s, b - f, x + w / 2 - 14 * s, b);
      RH(x - w / 2, y, w, h, solid(C.steelDark));
      RH(x - w / 2 + 12 * s, y + 12 * s, w - 24 * s, h - 24 * s, solid(C.steel));
      const cx = x + 6 * s, cy = y + h / 2, r = 15 * s;
      for (const a of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) {
        L(cx - (r + 6 * s) * Math.cos(a), cy - (r + 6 * s) * Math.sin(a), cx + (r + 6 * s) * Math.cos(a), cy + (r + 6 * s) * Math.sin(a), { strokeWidth: 2, roughness: 0.6 });
      }
      O(cx, cy, r * 2, Object.assign(solid(C.raised), { roughness: 0.8 }));
      O(cx, cy, 6 * s, { strokeWidth: 1, roughness: 0.4, fill: C.ink, fillStyle: 'solid' });
      for (const dy of [0.3, 0.7]) L(x - w / 2 + 12 * s, y + h * dy - 6 * s, x - w / 2 + 12 * s, y + h * dy + 6 * s, { strokeWidth: 5, roughness: 0.5 });
    };

    // 状態（だ円）。x, y: 中心、{ w, role: 'main' }
    const state = (x, y, label, o) => {
      o = o || {}; const size = o.size || 18, w = o.w || tw(label, size) + 64, h = o.h || 58, main = o.role === 'main';
      add(rc.ellipse(x, y, w, h, under()));
      add(rc.ellipse(x, y, w, h, base(solid(main ? C.ink : C.raised))));
      T(x, y + 1, label, { size, anchor: 'middle', fill: main ? C.onInk : C.ink });
    };
    // 始まりの点
    const dot = (x, y) => O(x, y, 20, { roughness: 0.6, fill: C.ink, fillStyle: 'solid' });
    // 分岐（ひし形）。x, y: 中心
    const diamond = (x, y, w, h, label, o) => {
      const p = [[x, y - h / 2], [x + w / 2, y], [x, y + h / 2], [x - w / 2, y]];
      add(rc.polygon(p, under())); PG(p, solid(C.raised));
      if (label) T(x, y + 1, label, { size: (o && o.size) || 17, anchor: 'middle' });
    };

    // ── 型の骨組み（型の決まりだけを描いて位置を返す。中身は部品で組む）──
    // 等間隔に並べた列の中心
    const cols = (x1, x2, n) => Array.from({ length: n }, (_, i) => x1 + ((x2 - x1) * i) / (n - 1));
    // シーケンス図。xs: 列の中心、top: 線の始まり（数か、列ごとの配列）、bottom: 線の終わり
    const sequence = (xs, top, bottom) => {
      xs.forEach((x, i) => L(x, Array.isArray(top) ? top[i] : top, x, bottom, { stroke: C.grey, strokeWidth: 1.5, strokeLineDash: [7, 7], roughness: 0.5 }));
      // やり取り。a → b は列の番号、y は高さ。{ back: 返事, main: 要の1本, async: 非同期 }
      const msg = (a, b, y, label, o) => {
        o = o || {}; const dir = Math.sign(b - a), gap = 8;
        const st = o.back ? { stroke: C.grey, strokeWidth: 2, head: 10 } : o.main ? { strokeWidth: 4.5, head: 16 } : { head: 12 };
        if (o.async) st.strokeLineDash = [9, 7];
        arrow([[xs[a] + dir * gap, y], [xs[b] - dir * gap, y]], st);
        if (!label) return;
        const lx = (xs[a] + xs[a + dir]) / 2;
        if (o.main) heading(lx, y - 22, label, { size: 18, anchor: 'middle' });
        else T(lx, y - 17, label, { size: 17, anchor: 'middle' });
      };
      return { x: xs, msg };
    };
    // スイムレーン。x, y: 左上、w: 全幅、h: 1レーンの高さ、names: 上からの担当 → { y: レーンの中心, x: 中身の左端, r: 右端 }
    const lanes = (x, y, w, h, names, o) => {
      o = o || {}; const head = o.head || 130, n = names.length;
      for (let i = 1; i < n; i++) L(x, y + i * h, x + w, y + i * h, { stroke: C.grey, strokeWidth: 1.5, roughness: 0.6 });
      L(x + head, y, x + head, y + n * h, { strokeWidth: 2 });
      R(x, y, w, n * h);
      names.forEach((s, i) => T(x + head / 2, y + i * h + h / 2, s, { size: o.size || 18, anchor: 'middle' }));
      return { y: names.map((_, i) => y + i * h + h / 2), x: x + head, r: x + w };
    };
    // 層。x, y: 左上、w: 幅、h: 1層の高さ、names: 上からの層、{ main: 主役の番号 } → 中身を置く場所 [{ x, y, w, h, cy }]
    const layers = (x, y, w, h, names, o) => {
      o = o || {}; const gap = o.gap == null ? 14 : o.gap, head = o.head || 190;
      return names.map((s, i) => {
        const yy = y + i * (h + gap), main = i === o.main;
        RH(x, yy, w, h, solid(main ? C.ink : C.raised));
        T(x + 24, yy + h / 2, s, { size: o.size || 19, fill: main ? C.onInk : C.ink });
        return { x: x + head, y: yy, w: w - head, h, cy: yy + h / 2 };
      });
    };
    // ツリーの枝。親の下辺 [x, y] から、子の上辺 [[x, y], …] へ
    const branch = (p, kids) => {
      const my = (p[1] + kids[0][1]) / 2, xs = kids.map(k => k[0]).concat(p[0]), o = { strokeWidth: 2 };
      L(p[0], p[1], p[0], my, o);
      if (kids.length > 1 || kids[0][0] !== p[0]) L(Math.min(...xs), my, Math.max(...xs), my, o);
      kids.forEach(k => L(k[0], my, k[0], k[1], o));
    };
    // 4象限。x, y, w, h: 枠、{ xl, yl: 軸の名前, hi: 注目する象限 'tl' 'tr' 'bl' 'br' } → pt(u, v): 0〜1 を座標に直す
    const quadrant = (x, y, w, h, o) => {
      o = o || {};
      if (o.hi) {
        const qx = o.hi[1] === 'l' ? x : x + w / 2, qy = o.hi[0] === 't' ? y : y + h / 2;
        add(rc.rectangle(qx, qy, w / 2, h / 2, base({ stroke: 'none', fill: C.blue, fillStyle: 'hachure', hachureGap: 9, fillWeight: 1.5 })));
      }
      const mid = { stroke: C.grey, strokeWidth: 1.5, strokeLineDash: [7, 7], roughness: 0.5 };
      L(x + w / 2, y, x + w / 2, y + h, mid); L(x, y + h / 2, x + w, y + h / 2, mid);
      arrow([[x, y + h], [x + w + 14, y + h]]); arrow([[x, y + h], [x, y - 14]]);
      if (o.xl) T(x + w + 14, y + h + 26, o.xl, { size: 18, anchor: 'end' });
      if (o.yl) T(x - 16, y - 4, o.yl, { size: 18, anchor: 'end' });
      return { pt: (u, v) => [x + u * w, y + (1 - v) * h] };
    };
    // 工程表。x, y: 左上、w: 全幅、cs: 時間の見出し、rows: 作業 → { bar(行, 開始, 終了, { main }), mark(行, 位置), x(位置), bottom }
    const gantt = (x, y, w, cs, rows, o) => {
      o = o || {}; const head = o.head || 150, rh = o.rowH || 60, hh = 40, cw = (w - head) / cs.length, y0 = y + hh;
      const X = t => x + head + cw * t;
      cs.forEach((s, i) => {
        T(X(i + 0.5), y + hh / 2 - 2, s, { size: 17, anchor: 'middle' });
        if (i) L(X(i), y0, X(i), y0 + rh * rows.length, { stroke: C.grey, strokeWidth: 1.2, strokeLineDash: [4, 7], roughness: 0.5 });
      });
      L(x, y0, x + w, y0);
      rows.forEach((s, i) => T(x + head - 20, y0 + rh * (i + 0.5), s, { size: 18, anchor: 'end' }));
      const bar = (i, a, b, oo) => RH(X(a), y0 + rh * i + 13, X(b) - X(a), rh - 26, (oo && oo.main) ? hach(C.ink, 3.5) : Object.assign(hach(C.grey, 5), { stroke: C.grey }));
      const mark = (i, t) => { const cx = X(t), cy = y0 + rh * (i + 0.5), r = 15; PG([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]], solid(C.ink)); };
      return { bar, mark, x: X, bottom: y0 + rh * rows.length };
    };
    // 時間の軸。x1〜x2 に矢印を引き、labels を目盛りに置く → 目盛りの x
    const axis = (x1, x2, y, labels) => {
      arrow([[x1, y], [x2, y]]);
      const xs = cols(x1 + 60, x2 - 90, labels.length);
      xs.forEach((x, i) => { L(x, y - 10, x, y + 10); T(x, y + 32, labels[i], { size: 19, anchor: 'middle' }); });
      return xs;
    };
    // 循環。cx, cy: 中心、rx, ry: 半径、n: 段の数 → 段の中心 [[x, y], …]（上から時計回り）。段の間に回る矢印を描く
    const ring = (cx, cy, rx, ry, n, o) => {
      o = o || {}; const pad = o.pad || 0.42, at = a => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)], ang = i => -Math.PI / 2 + (2 * Math.PI * i) / n;
      for (let i = 0; i < n; i++) {
        const a = ang(i) + pad, b = ang(i + 1) - pad;
        arrow([0, 0.25, 0.5, 0.75, 1].map(t => at(a + (b - a) * t)), { head: 13 });
      }
      return Array.from({ length: n }, (_, i) => at(ang(i)));
    };
    // ピラミッド。x: 中心、b: 底、w: 底辺、h: 高さ、n: 段数、{ main: 主役の番号 } → 上からの段 [{ x, y, w }]（y は段の中心、w はそこでの幅）
    const pyramid = (x, b, w, h, n, o) => {
      o = o || {}; const gap = 8, lh = h / n, top = b - h, half = yy => (w / 2) * ((yy - top) / h);
      return Array.from({ length: n }, (_, i) => {
        const y1 = top + i * lh + (i ? gap : 0), y2 = top + (i + 1) * lh;
        const p = [[x - half(y1), y1], [x + half(y1), y1], [x + half(y2), y2], [x - half(y2), y2]];
        add(rc.polygon(p, under())); PG(p, i === o.main ? hach(C.ink, 4) : solid(C.raised));
        return { x, y: (y1 + y2) / 2, w: half((y1 + y2) / 2) * 2 };
      });
    };

    return {
      C, tw, base, hach, solid, L, R, O, P, PL, PG, RH, T, heading, sign, arrow, elbow, ground,
      person, robot, crate, conveyor, queue, stack, desk, monitor, gate, board, doc, clipboard, lock, magnifier, lamp, bars, phone, safe,
      mark, cloud, bank, coin, mail, calendar, key, shield, bug, flag, bulb, icon,
      box, cylinder, state, dot, diamond,
      cols, sequence, lanes, layers, branch, quadrant, gantt, axis, ring, pyramid,
    };
  }
  g.Zukai = { create, THEME, FONT };
})(typeof window !== 'undefined' ? window : globalThis);
