/*! Zukai parts — rough.js の上に載せる手描き風の部品集（Morio Navy）
 *  使い方: const z = Zukai.create(svg, { width: 1200, height: 630 }); z.person(150, 480);
 *  先に rough.js（4.6.6）を読み込んでおく。色と線の値は SKILL.md 5章と同じ。 */
(function (g) {
  const NS = 'http://www.w3.org/2000/svg';
  const THEME = {
    surface: '#eeeeee',  // 地
    raised: '#ffffff',   // 白い面
    sunken: '#dbdbdb',   // 沈んだ面
    navy: '#002b62',     // 線・文字・主役
    sky: '#8fb4ec',      // 水色（差し色の斜線）
    navySoft: '#d6e2f2', // 淡い水色（レンズなどのベタ）
    grey: '#7d7d7d',     // 脇役の線（line-strong）
    marker: '#f6e7a0',   // 薄い黄色（見出しのマーカー・明かり）
    onNavy: '#ffffff',   // ネイビーの上の文字
  };
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
    const base = o => Object.assign({ roughness: 1.2, bowing: 1, stroke: C.navy, strokeWidth: 2.5, seed: seed++ }, o);
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
      t.setAttribute('fill', o.fill || C.navy);
      t.setAttribute('text-anchor', o.anchor || 'start');
      t.setAttribute('dominant-baseline', 'central');
      if (o.halo) {
        t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke', o.halo === true ? C.raised : o.halo);
        t.setAttribute('stroke-width', 6); t.setAttribute('stroke-linejoin', 'round');
      }
      t.textContent = s;
      return add(t);
    };
    // マーカーを引いた見出し（見出しと要の1語だけに使う）
    const heading = (x, y, s, o) => {
      o = o || {};
      const size = o.size || 26, w = tw(s, size);
      const x0 = o.anchor === 'middle' ? x - w / 2 : x;
      const m = add(rc.line(x0 - 2, y + 3, x0 + w + 2, y + 3, base({ stroke: C.marker, strokeWidth: size * 0.72, roughness: 0.6, disableMultiStroke: true })));
      m.querySelectorAll('path').forEach(p => p.setAttribute('stroke-linecap', 'round'));
      return T(x, y, s, { size, anchor: o.anchor, fill: o.fill });
    };
    // 札（白い板に名前）。x, y は中心
    const sign = (x, y, s, o) => {
      o = o || {};
      const size = o.size || 18, w = tw(s, size) + 28, h = size + 18;
      RH(x - w / 2, y - h / 2, w, h, Object.assign(solid(C.raised), { strokeWidth: 2 }));
      return T(x, y + 1, s, { size, anchor: 'middle' });
    };
    // 矢印。pts は通過点（2点なら直線、3点以上は曲線）。頭は最後の2点の向き
    const arrow = (pts, o) => {
      o = Object.assign({ strokeWidth: 2.5 }, o);
      const head = o.head || 13; delete o.head;
      if (pts.length === 2) L(pts[0][0], pts[0][1], pts[1][0], pts[1][1], o);
      else add(rc.curve(pts, base(o)));
      const [ax, ay] = pts[pts.length - 2], [bx, by] = pts[pts.length - 1];
      const a = Math.atan2(by - ay, bx - ax);
      for (const d of [0.5, -0.5]) {
        L(bx, by, bx - head * Math.cos(a + d), by - head * Math.sin(a + d), Object.assign({}, o, { roughness: 0.8, strokeLineDash: undefined }));
      }
    };
    const ground = (x1, x2, y, o) => L(x1, y, x2, y, Object.assign({ stroke: C.grey, strokeWidth: 2 }, o));

    // ── 人とエージェント ──
    // 人（胸像・顔なし）。x: 中心、b: 足元の線、{ s: 倍率, side: 脇役, sweat: 汗, paper: 紙を持つ }
    const person = (x, b, o) => {
      o = o || {}; const s = o.s || 1;
      const w = 36 * s, h = 62 * s;
      const d = `M ${x - w} ${b} C ${x - w} ${b - h * 0.85}, ${x - w * 0.6} ${b - h}, ${x} ${b - h} C ${x + w * 0.6} ${b - h}, ${x + w} ${b - h * 0.85}, ${x + w} ${b} Z`;
      add(rc.path(d, under(C.surface)));
      P(d, o.side ? Object.assign(hach(C.grey, 5, { hachureAngle: -50 }), { stroke: C.grey }) : hach(C.navy, 4, { hachureAngle: -50 }));
      O(x, b - h - 27 * s, 48 * s, Object.assign(solid(C.raised), o.side ? { stroke: C.grey } : {}));
      if (o.sweat) {
        const drop = (dx, dy, k) => P(`M ${dx} ${dy} q ${5 * k} ${9 * k} 0 ${14 * k} q ${-5 * k} ${-5 * k} 0 ${-14 * k} Z`,
          { stroke: C.sky, strokeWidth: 1.5, roughness: 0.6, fill: C.sky, fillStyle: 'solid' });
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
      RH(x - 18 * s, b - 46 * s, 36 * s, 34 * s, hach(o.off ? C.grey : C.sky, 4, { hachureAngle: 60 }));
      L(x, b - 72 * s, x, b - 84 * s, { strokeWidth: 2 });
      O(x, b - 87 * s, 6 * s, { strokeWidth: 1.5, roughness: 0.6, fill: C.navy, fillStyle: 'solid' });
      RH(x - 15 * s, b - 72 * s, 30 * s, 24 * s, solid(C.raised));
      for (const dx of [-6, 6]) O(x + dx * s, b - 60 * s, 5 * s, { strokeWidth: 1, roughness: 0.4, fill: C.navy, fillStyle: 'solid' });
    };

    // ── 小道具 ──
    // 流れてくる箱。x: 中心、b: 底
    const crate = (x, b, o) => RH(x - 13, b - 23, 26, 23, Object.assign(hach(C.sky, 5, { fillStyle: 'cross-hatch', fillWeight: 1 }), { strokeWidth: 2 }, o));
    // ベルトコンベア。y: ベルトの上面（物はここに立たせる）
    const conveyor = (x1, x2, y) => {
      L(x1, y, x2, y); L(x1, y + 7, x2, y + 7, { strokeWidth: 2 });
      const n = Math.max(1, Math.round((x2 - x1) / 58));
      for (let i = 0; i <= n; i++) O(x1 + 14 + i * ((x2 - x1 - 28) / n), y + 17, 11, { strokeWidth: 2, roughness: 0.8, fill: C.surface, fillStyle: 'solid' });
    };
    // 作業キュー（積んだ棚）。x: 左、b: 底、n: 段数
    const queue = (x, b, n) => {
      for (let i = 0; i < (n || 4); i++) {
        const y = b - (i + 1) * 20;
        RH(x, y, 46, 20, Object.assign(solid(C.raised), { strokeWidth: 2 }));
        R(x + 7, y + 6, 8, 8, { strokeWidth: 1, roughness: 0.5, fill: C.sky, fillStyle: 'solid' });
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
    const desk = (x1, x2, y) => { L(x1, y, x2, y); L(x1 + 18, y, x1 + 18, y + 58); L(x2 - 18, y, x2 - 18, y + 58); };
    // モニタ。b: 置く面
    const monitor = (x, y, w, h, b) => {
      RH(x, y, w, h, solid(C.raised));
      L(x + w / 2, y + h, x + w / 2, b - 2); L(x + w / 2 - 26, b - 2, x + w / 2 + 26, b - 2);
      const ln = (a, c, yy, col, sw) => L(x + a, y + yy, x + c, y + yy, { stroke: col, strokeWidth: sw, roughness: 0.8 });
      ln(18, w * 0.57, h * 0.26, C.grey, 2); ln(30, w - 18, h * 0.42, C.navy, 3); ln(18, w * 0.68, h * 0.58, C.grey, 2); ln(18, w * 0.49, h * 0.74, C.grey, 2);
    };
    // 検査ゲート。x: 中心、b: 足元
    const gate = (x, b, o) => {
      o = o || {}; const w = o.w || 64, h = o.h || 112;
      L(x - w / 2, b, x - w / 2, b - h); L(x + w / 2, b, x + w / 2, b - h);
      RH(x - w / 2 - 6, b - h - 26, w + 12, 26, hach(C.sky, 4));
      PL([[x - 9, b - h - 13], [x - 2, b - h - 6], [x + 11, b - h - 21]], { strokeWidth: 3.5, roughness: 0.6 });
    };
    // 設計ボード（格子＋段のある線）
    const board = (x, y, w, h) => {
      RH(x, y, w, h, solid(C.raised));
      for (const k of [1, 2]) {
        L(x + (w * k) / 3, y + 3, x + (w * k) / 3, y + h - 3, { stroke: C.sky, strokeWidth: 1.2, roughness: 0.5 });
        L(x + 3, y + (h * k) / 3, x + w - 3, y + (h * k) / 3, { stroke: C.sky, strokeWidth: 1.2, roughness: 0.5 });
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
      RH(x + w * 0.32, y - 7, w * 0.36, 13, Object.assign(solid(C.navy), { strokeWidth: 2, roughness: 0.8 }));
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
      RH(x - 15 * s, b - 22 * s, 30 * s, 22 * s, hach(C.sky, 4));
      O(x, b - 11 * s, 5 * s, { strokeWidth: 1, roughness: 0.4, fill: C.navy, fillStyle: 'solid' });
    };
    // 虫眼鏡。x, y: レンズの中心
    const magnifier = (x, y, o) => {
      o = o || {}; const s = o.s || 1;
      L(x + 12 * s, y + 12 * s, x + 30 * s, y + 30 * s, { strokeWidth: 4.5 });
      O(x, y, 34 * s, solid(C.navySoft));
    };
    // 吊り照明。x: 中心、y: 天井、{ on: 点灯, floor: 明かりが届く y, spread: 明かりの半幅 }
    const lamp = (x, y, o) => {
      o = o || {}; const drop = o.drop || 30;
      if (o.on && o.floor) {
        const sp = o.spread || 70;
        PG([[x - 18, y + drop + 20], [x + 18, y + drop + 20], [x + sp, o.floor], [x - sp, o.floor]],
          { stroke: 'none', fill: C.marker, fillStyle: 'hachure', hachureGap: 6, fillWeight: 2.5, hachureAngle: -60 });
      }
      L(x, y, x, y + drop, { strokeWidth: 2 });
      const shade = [[x - 10, y + drop], [x + 10, y + drop], [x + 22, y + drop + 18], [x - 22, y + drop + 18]];
      add(rc.polygon(shade, under(C.raised)));
      PG(shade, o.on ? solid(C.navy) : Object.assign(solid(C.raised), { strokeWidth: 2 }));
      if (o.on) O(x, y + drop + 21, 9, { strokeWidth: 1.5, roughness: 0.5, fill: C.marker, fillStyle: 'solid' });
    };
    // 棒グラフ。x: 左、b: 底、vals: 高さ（px）、{ w, gap, main: 主役の番号, labels: [上の数字] }
    const bars = (x, b, vals, o) => {
      o = o || {}; const w = o.w || 30, gap = o.gap == null ? 10 : o.gap;
      vals.forEach((v, i) => {
        const bx = x + i * (w + gap);
        RH(bx, b - v, w, v, i === o.main ? hach(C.navy, 3.5) : hach(C.sky, 4));
        if (o.labels) T(bx + w / 2, b - v - 14, o.labels[i], { size: o.size || 16, anchor: 'middle' });
      });
    };

    // ── 構造図の箱（役割で形と色を決める）──
    // role: main（主役）/ system（システム・処理）/ data（データ）/ ext（外部）/ scope（範囲）
    const box = (x, y, w, h, label, o) => {
      o = o || {}; const role = o.role || 'system', size = o.size || 18;
      if (role === 'main') RH(x, y, w, h, solid(C.navy));
      else if (role === 'data') RH(x, y, w, h, Object.assign(hach(C.grey, 6), { stroke: C.grey }));
      else if (role === 'ext') R(x, y, w, h, { stroke: C.grey, strokeWidth: 2, strokeLineDash: [8, 6] });
      else if (role === 'scope') R(x, y, w, h);
      else RH(x, y, w, h, solid(C.raised));
      if (!label) return;
      if (role === 'scope') return T(x + 14, y + 20, label, { size: o.size || 16 });
      const ty = o.sub ? y + h / 2 - size * 0.55 : y + h / 2 + 1;
      T(x + w / 2, ty, label, { size, anchor: 'middle', fill: role === 'main' ? C.onNavy : C.navy, halo: role === 'data' });
      if (o.sub) T(x + w / 2, y + h / 2 + size * 0.65, o.sub, { size: size * 0.72, anchor: 'middle', fill: role === 'main' ? C.onNavy : C.navy, halo: role === 'data' });
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

    return {
      C, tw, base, hach, solid, L, R, O, P, PL, PG, RH, T, heading, sign, arrow, ground,
      person, robot, crate, conveyor, queue, stack, desk, monitor, gate, board, doc, clipboard, lock, magnifier, lamp, bars,
      box, cylinder,
    };
  }
  g.Zukai = { create, THEME, FONT };
})(typeof window !== 'undefined' ? window : globalThis);
