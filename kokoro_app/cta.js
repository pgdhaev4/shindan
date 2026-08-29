/**
 * cta.js — 結果画面の「あなたの詳細分析」導線（note 300円）
 *
 * 設計（戦略v3・オーナー承認 2026-08-29）:
 *  - 表示位置＝「森から、あなたへ」の直後・関連記事の上。1画面に1つだけ。
 *  - ポップアップ・追従表示にしない（静かなカード型）。
 *  - 見出しにタイプ名を差し込み、「この300円で何が分かるか」を3点見せる。
 *    3点は各noteの実際の章から抽出（note完成が先→CTA作成、の順を守った）。
 *  - ★noteUrls が空の診断ではCTAを一切出さない＝noteが未公開でも安全に本番へ出せる。
 *    公開後、ここにnoteのURLを入れるだけで有効になる。
 *  - 計測は measure.js（KMES）に委譲。variant 'a' から開始し、クリック計測で文言を入れ替える。
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
window.KOKORO_CTA = {
  // 診断slug → noteのURL。★空文字の間はCTA非表示。noteを公開したらURLを入れる。
  noteUrls: {
    'asa': 'https://note.com/pure_ferret3539/n/n77075649e7fc',
    'hitozukiai': 'https://note.com/pure_ferret3539/n/nf16d9c8d7683',
    'kosodate-tsukare': 'https://note.com/pure_ferret3539/n/n2025e3dca4fa',
    'kotoba': 'https://note.com/pure_ferret3539/n/n72df5ea2bc23',
    'yameru': 'https://note.com/pure_ferret3539/n/nc543903bbd52'
  },  // 2026-08-29 公開・全URL HTTP 200実測済み

  // 文言パターン（計測のva欄に入る）
  variant: 'a',

  // 診断ごとの見出しの作り方（タイプ名を差し込む）
  headline: function (slug, typeName) {
    if (slug === 'kotoba') return typeName + '——この言葉が届いたあなたを、もう少し深く。';
    if (slug === 'yameru') return 'あなたの「辞めたい」を、もう少し深く。';
    return '「' + typeName + '」のあなたを、もう少し深く。';
  },

  // 「この300円で何が分かるか」＝各noteの章から抽出した3点
  points: {
    'asa': [
      'なぜ今、会社に行くことがこんなに重く感じるのか',
      '頑張りすぎる前に現れやすいサイン',
      '少し楽になるための考え方'
    ],
    'hitozukiai': [
      'なぜ人といると、こんなに消耗するのか',
      'とくに疲れやすい相手・場面のパターン',
      '消耗を減らす、距離のとり方'
    ],
    'kosodate-tsukare': [
      'この疲れが、どこから来ているのか',
      '自分を責めなくていい理由',
      '今日の「これでいい」の基準'
    ],
    'kotoba': [
      'なぜ今、この言葉があなたに出たのか',
      'その状態のときに出やすいサイン',
      'この言葉を明日につなげる、小さな行動'
    ],
    'yameru': [
      'あなたの「辞めたい」が、どの種類なのか',
      'その辞めたさが強まる場面',
      '今すぐ決めなくていい理由と、整理の順番'
    ]
  },

  lead: 'この結果、少し当たっていると思いましたか？',
  sub: '有料の詳細分析（note）では、心理学の考え方も使いながら、',
  tail: 'を、あなたのタイプについて詳しくまとめています。',
  button: 'あなたの詳細分析を見る（300円）',
  note: '※読みものの購入ページ（note）が開きます。'
};
