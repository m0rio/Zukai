// aws の見本。公式アイコンを使った構成図。rough.js・zukai.js・zukai-icons.js の後に読み込む。
document.getElementById('s').setAttribute('aria-label', '振込を AWS で組んだ構成図。利用者のアプリが API Gateway を呼び、Lambda が DynamoDB に記帳する。通知は SQS を通して別の Lambda へ非同期で渡す。');
const z = Zukai.create(document.getElementById('s'), { width: 1200, height: 540 }), C = z.C;
z.heading(60, 56, '記帳は同期、通知は SQS で切り離す');
const Y = 250, S = 64;

// 範囲
z.box(400, 110, 740, 380, 'AWS', { role: 'scope' });

// つながり（実線は同期、破線は非同期）
z.arrow([[160, Y], [236, Y]]);
z.arrow([[324, Y], [476, Y]]);
z.arrow([[564, Y], [676, Y]]);
z.arrow([[764, Y], [956, Y]]);
z.elbow([[720, Y + 66], [720, 410], [810, 410]], { strokeLineDash: [9, 7] });
z.arrow([[900, 410], [956, 410]], { strokeLineDash: [9, 7] });

// 人と実物は手描き、サービスは公式アイコン
z.person(110, 286, { s: 0.9, side: true }); z.T(110, 312, '利用者', { anchor: 'middle' });
z.phone(280, 290);                          z.T(280, 314, 'アプリ', { anchor: 'middle' });
z.icon(520, Y, 'aws-api-gateway', { size: S, label: 'API Gateway' });
z.icon(720, Y, 'aws-lambda', { size: S, label: '振込' });
z.icon(1000, Y, 'aws-dynamodb', { size: S, label: '口座の台帳' });
z.icon(855, 410, 'aws-sqs', { size: S, label: 'SQS' });
z.icon(1000, 410, 'aws-lambda', { size: S, label: '通知' });
