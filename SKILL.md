---
name: "zukai"
description: "図解を主、文章を従にして答えるためのスキル（Zukai）。説明・比較・設計・手順・構成の整理、図解中心の資料・スライド・ドキュメント作成、draw.io・Mermaid・SVG・画像・ASCIIで図を手描き風の統一した絵柄で描くとき、人物と小道具の情景図を描くとき、またはMorio Navyのデザインを使うときに必ず使う。"
---

# Zukai（図解スキル・Morio Navy）

読み手は文章より図の方が理解しやすい。**図が主、文章は従。** ねらいは、読み手が短時間で構造をつかみ、自分の言葉で説明できること。

本体はリポジトリ https://github.com/m0rio/Zukai 。

| ファイル | 中身 |
|---|---|
| `zukai.js` | rough.js の上に載せた部品（人・小道具・箱）と、型の骨組み |
| `examples/` | 型ごとの見本。**見本が仕様。** 描く前に、使う型の `.png` と `.js` を見る |

## 1. 原則

1. **配置に説明させる。** 副ラベル・補足・説明文は、無いと誤読するものだけ残す。担当・段階・分類・順序は文字で書かず、行と列・入れ子・並びで表す。
2. **中身に合う形を作る。** 「カードに文章を置く」のような決まった部品を並べて済ませない。型は関係の種類を決めるだけ。形は中身に合わせて部品から選ぶか、基本の線でゼロから作る。量は個数・長さ・面積で表す。
3. **情報は伝え、見た目は単純に。** 最初に見える量を減らす。HTML など操作できる媒体では、削った補足を消さずに畳む（短いものはツールチップ、長いものは開閉）。開かないと分からない情報は畳まない。
4. **多ければまとめる。** 要素が5つを超えたら、3つ前後のまとまりに囲んで名前を付ける。入れ子は2階層まで。
5. **削るのが最良の一手。** 足し終えたときではなく、これ以上削れないときが完成。

**上限（1枚あたり）**

| 対象 | 上限 |
|---|---|
| 型 | 1つ。2つ要るなら図を分ける |
| 要素 | 9 |
| 矢印 | 12 |
| 主役（navy のベタ） | 1か所。ほかの強調はマーカー1語まで |

超えたら、全体図1枚と詳細図に分ける。文章1段落や表で足りるなら、図にしない。

## 2. 型を選ぶ

**読み手に答えたい問いを1つ決める。** 問いが型を決める。

| 問い | 理解させたい関係 | 型 | 骨組み・形 | 見本 |
|---|---|---|---|---|
| 何でできているか | 包含・分類 | 体系図 | `box`（scope） | `nested` |
| | 上位と下位・絞り込み | ピラミッド | `pyramid` | `pyramid` |
| | 積み重なる層 | 層 | `layers` | `layers` |
| | 親から子への分解 | ツリー | `branch` | `tree` |
| | 登場人物とシステムのつながり | 構成図 | `box` `cylinder` `person` | `architecture` |
| どうつながるか | 2つの概念の関係 | 矢印＋動詞 | `arrow` | — |
| | 3つ以上の概念の関係 | コンセプトマップ | `arrow` `box` | `concept` |
| | 変化の前後・2案の違い | 比較図 | 同じ部品を左右に並べる | `compare` |
| どう進むか | 順序と分岐 | 流れ図 | `diamond` `box` | `flow` |
| | 担当と受け渡し | スイムレーン | `lanes` `elbow` | `swimlane` |
| | やり取りの順 | シーケンス図 | `sequence` | `sequence` |
| | 状態の移り変わり | 状態遷移図 | `state` `dot` | `state` |
| | 繰り返す仕組み | 循環図 | `ring` | `loop` |
| | 期間と前後 | 工程表 | `gantt` | `gantt` |
| | 時間の変化 | 年表 | `axis` | `timeline` |
| どこに位置するか | 2つの軸での位置 | 4象限 | `quadrant` | `quadrant` |
| どれだけ違うか | 数値・属性 | 表 | HTML の表 | — |
| 誰がどうなるか | 人・役割・状況 | 情景図 | 人と小道具 | `scene` `before-after` |

**目的で絵を決める。**

| 目的 | 絵 |
|---|---|
| 解説・発表・導入。状況や変化を直感でつかませる | 情景図（6章） |
| 設計の確認。接続・順序・数値を正確に確かめる | 構造図（上の表の型） |

設計の確認を情景図で代用しない。比喩にすると接続先や数値を読み違える。

**迷ったとき**

| 迷う組み合わせ | 決め手 |
|---|---|
| 流れ図か、スイムレーンか | 担当が1つなら流れ図。受け渡しを見せるならスイムレーン |
| スイムレーンか、シーケンス図か | 作業の流れならスイムレーン。メッセージの順ならシーケンス図 |
| 流れ図か、状態遷移図か | 主語が作業なら流れ図。1つの物の状態なら状態遷移図 |
| 体系図か、ツリーか、層か | 含むなら体系図。分けるならツリー。上が下に頼るなら層 |
| 年表か、工程表か | 時点なら年表。期間と重なりなら工程表 |
| 比較図か、表か | 形や順番の違いなら比較図。数値や属性の違いなら表 |

## 3. 描き方

**手順**

1. 目的を1文で書く。読み手に何の「関係」を理解させるか。書けないうちは描かない。
2. 要素を書き出し、線で結び、関係に動詞で名前を付ける。理由を説明できない線は消す。
3. 目的に関係しない枝葉を削る。迷ったら削る。
4. 型を選び（2章）、見本を見て、骨組みの上に中身に合う形を置く。
5. 見出しに結論を書く（×「振込の流れ」→ ○「実行までに、関門は2つ」）。
6. 確認する（7章）。指摘を受けたら部分修正でなく、目的の1文に戻って描き直す。

**矢印の意味は固定する。** 1つの資料の中で変えない。

| 形 | 意味 |
|---|---|
| 実線 | 流れ・順序・因果・同期の呼び出し |
| 破線 | 非同期・任意 |
| 灰色の細い実線 | 返事（シーケンス図） |
| 逆向きの2本 | 交換・相互作用 |
| 曲線・輪 | 回り続ける仕組み・差し戻し |

- 矢印の名前は、分岐の条件など、矢印だけでは決まらないときに限る。具体的な動詞にする。「関連」「など」は使わない。
- 読む向きは左→右、上→下。戻りは下側を回す。矢印は交差させず、関係ない箱の裏を通さない。
- 直角に曲げる経路は `elbow`。下りは「下がってから右」、上りは「右へ出てから上」にそろえる。
- 箱の中は名前だけ。同じ役割には同じ形と色。
- 凡例は語だけ。資料名・日付・作成者・出典などのメタ情報は、理解に要らなければ載せない。
- キャンバスは内容に合わせて広げる。詰めて文字を小さくしない。

**役割と形（構造図）**

| 役割 | 形 | `zukai.js` |
|---|---|---|
| 主役（1枚に1か所） | navy のベタ＋白文字 | `box(…, { role: 'main' })` |
| システム・処理 | 白い四角 | `box` |
| データ・保存先 | grey の斜線の円柱 | `cylinder` |
| 外部・範囲外 | grey の破線の四角 | `box(…, { role: 'ext' })` |
| 範囲・まとまり | navy の枠だけ | `box(…, { role: 'scope' })` |
| 人・利用者 | 胸像。脇役は grey | `person` |
| 状態 / 分岐 | だ円 / ひし形 | `state` / `diamond` |

## 4. 絵柄（Morio Navy）

**色は navy・白・grey・sky。** 足りないときだけ薄い黄色（marker）。金・赤などは足さない。値は `zukai.js` に入っているので、部品を使えばそろう。 この表と `zukai.js` が正本で、Design System「Morio Navy」はその写し。

| トークン | Light | Dark | 用途 |
|---|---|---|---|
| surface | #eeeeee | #1b1d22 | 地 |
| surface-raised | #ffffff | #24272e | 白い面・箱・表 |
| surface-sunken | #dbdbdb | #15171b | 入れ子の小箱 |
| line | #c7c7c7 | #3a3e47 | 罫線 1px |
| line-strong（grey） | #7d7d7d | #6b707b | 脇役の線・外部の破線・データの斜線 |
| ink-strong / ink / ink-muted | #000000 / #3b3b3b / #616161 | #ffffff / #e6e6e6 / #a3a7b0 | 見出し / 本文 / 注記 |
| navy | #002b62 | #3d6fb8 | 主役の塗り・線・図の中の文字 |
| navy-soft | #d6e2f2 | #1d2f4d | 淡い水色のベタ（画面・レンズ） |
| sky | #8fb4ec | #5d8fd6（暫定） | 差し色の斜線 |
| marker | #f6e7a0 | #5a5122（暫定） | 見出しのマーカー・明かり |
| success / warning / danger | #1a7f37 / #9a6700 / #c42b1c | #56d364 / #e3b341 / #ff7b72 | 状態（語を添える。図の中では `mark`） |

| 要素 | 決まり |
|---|---|
| 線 | navy のゆらいだ線（roughness 1.2、太さ 2.5）。細部は 2、要の矢印は 4.5 |
| 主役 | navy のベタ＋白文字。人と物は navy の密な斜線 |
| 差し色 | sky の斜線。**1枚の中で意味を1つに固定する**（新しい側、自動の部分、注目する範囲など） |
| 脇役・データ | grey の線と斜線 |
| 強調 | marker。見出しと、要の1語だけ |
| 文字 | Yusei Magic、navy。太字指定をしない。斜線の上では白い縁取り（`halo`） |
| 地 | surface。影・グラデーション・角丸なし |

- 手描きの図はライトの値で描く。ダークの sky と marker は暫定。
- 資料の表題・見出し・要点は Yusei Magic。見出しには marker を引き、要点は navy のベタ＋白文字。
- 表・タグ・本文は手描き風にしない。Noto Sans JP 15px、数字・コードは等幅。角丸 4px、罫線 1px。絵文字・感嘆符は使わない。
- 文字は 15px 以上。スライド（1920×1080）は 28px 以上、スマホで読むチャットは 20px 以上。
- Yusei Magic が無い環境は Noto Sans JP で代用し、そう伝える。
- 文章は自然な日本語で、結論を先に、短く。図と重なる説明は書かない。資料内は常体。

## 5. 手段

**出力先で手段を決める。** どの手段でも絵柄は4章にそろえる。

| 出力先 | 手段 | 描ける絵 |
|---|---|---|
| チャットの中、HTML の資料 | rough.js ＋ `zukai.js` の SVG（指定がなければこれ） | すべて |
| ブログ・スライドに貼る画像 | 同じ HTML を PNG に書き出す | すべて |
| 人が後から直す図 | draw.io（sketch） | 構造図 |
| Markdown・Git で管理する図 | Mermaid（handDrawn） | 流れ図・構成図・体系図・循環図 |
| ターミナル | ASCII | 要素6つまで |

求められた手段でその絵が描けないときは、絵を変えずに手段を変え、そう伝える。情景図は draw.io・Mermaid・ASCII では描かない。

**SVG**

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap">
<svg id="s" xmlns="http://www.w3.org/2000/svg" width="1200" height="630" role="img" aria-label="何がどうなっている図かを1文で"></svg>
<script src="https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.js"></script>
<script src="https://cdn.jsdelivr.net/gh/m0rio/Zukai@main/zukai.js"></script>
<script>
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 630 }), C = z.C;
</script>
```

- 大きさは、単体画像 1200×630 前後、スライド 1920×1080。外周 60 は空ける。
- チャットの中では `svg` の `width` を `100%` にして `height` を外す。スマホでは幅 600〜720 の縦長に組む。
- CDN が読めない環境では、`zukai.js` の中身をそのまま `<script>` に貼る。

**PNG**

```sh
git clone --depth 1 https://github.com/m0rio/Zukai <作業用>/zukai && cd <作業用>/zukai && npm install   # 初回だけ
node scripts/render.mjs <図.html> <図.png>   # 2倍密度。大きさは svg の viewBox から決まる
```

CDN の読み込みはローカルのファイルに差し替わるので、ネットワークが無くても動く。Yusei Magic が読めないとき・ページにエラーがあるときは失敗で終わる。Chrome の場所は `CHROME_PATH` で渡せる。

**Mermaid**（冒頭に置き、役割ごとに class を付ける。handDrawn は flowchart で確認済み）

```
%%{init: {'look':'handDrawn','handDrawnSeed':1,'theme':'base','themeVariables':{'fontFamily':'Yusei Magic, Noto Sans JP, sans-serif','primaryColor':'#ffffff','primaryBorderColor':'#002b62','primaryTextColor':'#002b62','lineColor':'#002b62','clusterBkg':'#eeeeee','clusterBorder':'#002b62','edgeLabelBackground':'#eeeeee'}}}%%
flowchart LR
  classDef main fill:#002b62,stroke:#002b62,color:#ffffff
  classDef system fill:#ffffff,stroke:#002b62,stroke-width:2px,color:#002b62
  classDef accent fill:#8fb4ec,stroke:#002b62,stroke-width:2px,color:#002b62
  classDef data fill:#dbdbdb,stroke:#7d7d7d,color:#002b62
  classDef ext fill:#eeeeee,stroke:#7d7d7d,stroke-dasharray:4 4,color:#002b62
```

同期は `-->`、非同期は `-.->`、範囲は `subgraph`、データは `[( )]`、人は `(( ))`。

**draw.io**（接続点は辺の中央、箱は 8px のグリッド）

```
システム: rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#002b62;strokeWidth=2;fontColor=#002b62;
主役:     rounded=0;whiteSpace=wrap;html=1;fillColor=#002b62;strokeColor=#002b62;fontColor=#ffffff;fillStyle=solid;
差し色:   rounded=0;whiteSpace=wrap;html=1;fillColor=#8fb4ec;strokeColor=#002b62;strokeWidth=2;fontColor=#002b62;fillStyle=hachure;
人:       ellipse;aspect=fixed;fillColor=#002b62;strokeColor=#002b62;fontColor=#ffffff;fillStyle=hachure;
データ:   shape=cylinder3;boundedLbl=1;size=10;fillColor=#7d7d7d;strokeColor=#7d7d7d;fontColor=#002b62;fillStyle=hachure;
外部:     rounded=0;dashed=1;fillColor=none;strokeColor=#7d7d7d;fontColor=#002b62;
範囲:     rounded=0;fillColor=none;strokeColor=#002b62;strokeWidth=2;verticalAlign=top;align=left;spacingLeft=12;fontColor=#002b62;
同期:     edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#002b62;strokeWidth=2;endArrow=open;
非同期:   同期 + dashed=1;
共通（すべての末尾に足す）: sketch=1;curveFitting=1;jiggle=2;fontFamily=Yusei Magic;fontSource=https%3A%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3DYusei%2BMagic;
```

**ASCII**：枠は `┌─┐│└─┘`、矢印は `→ ← ↑ ↓ ⇄`、破線は `┄`、主役は二重枠 `╔═╗`。全角の幅を数えて右端をそろえる。

## 6. `zukai.js`

座標は px。`x` は断りがなければ中心、`b` は足元（底）の y。見た目は `examples/parts.png` と `examples/icons.png`。塗りは `z.hach(色, 間隔)`（斜線）と `z.solid(色)`、色は `z.C.navy` `z.C.sky` `z.C.grey` `z.C.raised` `z.C.marker`。

**骨組み**（型の決まりだけを描き、位置を返す。中身はその上に置く）

| 関数 | 描くもの → 返すもの |
|---|---|
| `cols(x1, x2, n)` | → 等間隔の列の中心 |
| `sequence(xs, top, bottom)` | 時間の線 → `msg(a, b, y, 名前, { back, main, async })` |
| `lanes(x, y, w, h, 担当[])` | レーン → `{ y: レーンの中心, x: 中身の左端, r: 右端 }` |
| `layers(x, y, w, h, 層[], { main })` | 積んだ層 → 中身を置く場所 `[{ x, y, w, h, cy }]` |
| `branch([x, y], [[x, y], …])` | 親の下辺から子の上辺への枝 |
| `quadrant(x, y, w, h, { xl, yl, hi })` | 2本の軸と注目の象限 → `pt(u, v)`（0〜1 を座標に） |
| `gantt(x, y, w, 列[], 行[])` | 時間の列と作業の行 → `bar(行, 始, 終, { main })` `mark(行, 位置)` |
| `axis(x1, x2, y, 目盛り[])` | 時間の軸 → 目盛りの x |
| `ring(cx, cy, rx, ry, n)` | 回る矢印 → 段の中心（上から時計回り） |
| `pyramid(x, b, w, h, n, { main })` | 段 → 上からの段 `[{ x, y, w }]` |

**形と線**

| 関数 | 描くもの |
|---|---|
| `box(x, y, w, h, 文字, { role, sub })` / `cylinder(x, y, w, h, 文字)` | 箱と円柱。`x, y` は左上 |
| `state(x, y, 文字, { w, role })` / `dot(x, y)` / `diamond(x, y, w, h, 文字)` | 状態・始まりの点・分岐 |
| `arrow([[x, y], …], { strokeWidth, head, strokeLineDash })` | 矢印。2点で直線、3点以上で曲線 |
| `elbow([[x, y], …])` | 折れ線の矢印 |
| `heading(x, y, 文字, { size, anchor })` / `sign(x, y, 文字)` / `T(x, y, 文字, { size, anchor, fill, halo })` | マーカー付きの見出し・札・文字 |
| `L` `R` `O` `P` `PL` `PG` `RH` | 線・四角・円・パス・折れ線・多角形・白を敷いた四角 |

**人と小道具**

| 関数 | 描くもの |
|---|---|
| `person(x, b, { s, side, sweat, paper })` | 人（胸像）。`side` で脇役、`sweat` で汗、`paper` で紙を持つ |
| `robot(x, b, { s, off })` | 自動の働き手。`off` で止まっている |
| `phone(x, b, { s })` / `safe(x, b, { s })` | スマホ / 金庫 |
| `crate(x, b)` / `conveyor(x1, x2, y)` / `gate(x, b, { w, h })` | 流れる箱 / コンベア（`y` が上面） / 検査ゲート |
| `queue(x, b, n)` / `stack(x, b, n, { label, labelAt })` | 作業キュー / 書類の山。`x` は左端 |
| `desk(x1, x2, y)` / `monitor(x, y, w, h, b)` / `board(x, y, w, h)` | 机 / モニタ / 設計ボード |
| `doc(x, y, w, h)` / `clipboard(x, y, w, h)` / `lock(x, b)` / `magnifier(x, y)` | 書類 / チェックリスト / 鍵 / 虫眼鏡 |
| `lamp(x, y, { on, floor, spread })` / `bars(x, b, [高さ…], { main, labels })` / `ground(x1, x2, y)` | 照明 / 棒グラフ / 地面 |
| `cloud` `bank` `coin` `mail` `calendar` `key` `shield` `bug` `flag` `bulb` `(x, b, { s })` | 雲 / 銀行 / 硬貨 / 封筒 / カレンダー / かぎ / 盾 / 虫 / 旗 / 電球 |
| `mark(x, y, 種類, { s })` | 状態の記号。`check` `cross` `alert` `clock` `info` `question`。`x, y` は中心 |

部品に無い形は、基本の線で4章の値のまま描く。くり返し使う形は `zukai.js` に足す。

**情景図**（「誰が・何をして・どうなるか」を場面で見せる）

1. 伝えたいことを1文にし、見出しにする。
2. 物理的な比喩を選ぶ。決めきれなければ2〜3案を出して選んでもらう。

| 伝えたいこと | 比喩 |
|---|---|
| 工程・検査 | コンベアとゲート |
| 変化の前後 | 左右の2場面と太い矢印 |
| 量の差 | 積む・並べる |
| 範囲・境界 | 照明の当たる場所 |
| 段階 | 階段・棒 |
| 確認・守る | 虫眼鏡・チェックリスト・鍵・金庫 |

3. 場面は1枚に2つまで。主役の人は1場面に1人。小道具は5種類まで。
4. 地面→小道具→人→持ち物→文字の順に描く（後に描いたものが手前）。

- 人と物は、場面ごとの足元の線にそろえる。頭と手元を小道具で隠さない。
- 人は顔を描かない。気持ちは汗・チェックなどの記号と、物の量で表す。吹き出しは使わない。
- 文字は、見出し・部品の名前（部品の下に中央ぞろえ）・数字・下の結論1文まで。見出しが結論なら下の1文は省く。
- 比較は左に前、右に後。右にだけ sky を使い、色でも違いを見せる。

## 7. 確認

**資料・スライド・ブログに入れる図は、PNG に書き出して目で確かめ、問題がなくなるまで直す。** チャットの即答では省いてよいが、座標は下の項目で見直す。直すときは座標をずらす前に、向き・まとまり・名前の長さを見直す。

**削るテスト**

- 要素を1つ隠しても、読み手は理解できるか。できるなら削る
- いつも一緒に動く2つの要素は、1つにできないか
- 配置で分かる関係に、線を引いていないか
- 形や色で分かることに、名前を付けていないか
- 文字をすべて外しても、関係や場面が読めるか。読めなければ、文章を箱に入れただけ

**中身**

- 見出しが結論になっていて、図だけで1文で言えるか
- 問いと型、目的と絵が合っているか。上限（1章）に収まっているか
- すべての矢印の理由を説明でき、接続先が正しいか。元の資料・事実と食い違っていないか
- 主役が1か所で、sky の意味が1つに決まっているか

**見た目**

- 文字切れ・重なりがないか。文字と線の間に 8px 以上の空きがあるか
- 矢印が交差したり、関係ない箱の裏を通ったり、宙で終わったりしていないか
- 仲間どうしの間隔がそろっているか。詰まった所の隣に、空いた帯がないか
- 同じ役割が同じ形・色か。読む向きが左→右、上→下で一貫しているか
- `aria-label`（画像なら alt）に、何がどうなっている図かを1文で書いたか
