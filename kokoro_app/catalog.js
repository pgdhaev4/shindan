/**
 * catalog.js — 主要10診断のマスタ（2026-09-07 リニューアル）
 *
 * トップページ・一覧ページ・結果画面の回遊リンクは、すべてここを参照する。
 * ★ live:false の診断はリンクを出さない（作りかけの診断へ人を送らないため）。
 * ★ 既存5本の slug（asa / yameru / hitozukiai / kosodate-tsukare / kotoba）は変えない。
 *   公開済みのnoteコラムから合計15本のリンクが張られているため、URLを変えると切れる。
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
window.KOKORO_CATALOG = {
  // トップ・一覧での並び順（①〜⑩）
  order: ['asa', 'yameru', 'hitozukiai', 'kosodate-tsukare', 'ganbari',
          'kurabe', 'gaman', 'kotoba', 'renai-jishin', 'kekkon-aseri'],

  // カテゴリの表示順と色クラス
  cats: [
    { key: '仕事',       cls: 'cat-work' },
    { key: '人間関係',   cls: 'cat-people' },
    { key: '自分自身',   cls: 'cat-self' },
    { key: '恋愛・結婚', cls: 'cat-love' }
  ],

  items: {
    'asa': {
      file: 'asa.html', cat: '仕事', emoji: '💼', live: true, schema: 2,
      title: '仕事に行きたくない気持ち診断',
      sub: '「行きたくない」と思いながらも向き合ってきたあなたの、粘り強さや優しさを見つけます。',
      about: '今日・明日、仕事へ行くこと自体がつらい気持ちを扱います。'
    },
    'yameru': {
      file: 'yameru.html', cat: '仕事', emoji: '🧭', live: true, schema: 2,
      title: '会社を辞めるか迷っている診断',
      sub: '迷えるほど真剣に働いてきたあなたの、責任感や誠実さを見つけます。',
      about: 'この会社に今後も残るかどうか、という中長期の迷いを扱います。'
    },
    'hitozukiai': {
      file: 'hitozukiai.html', cat: '人間関係', emoji: '🫧', live: true, schema: 2,
      title: '人付き合いに疲れた診断',
      sub: 'あなたが人に気を遣ってきた理由から、あなたの優しさや良いところを見つけます。',
      about: '職場・友人・家族・SNSなど、対人関係全般の気疲れを扱います。'
    },
    'kosodate-tsukare': {
      file: 'kosodate-tsukare.html', cat: '自分自身', emoji: '🌙', live: true, schema: 2,
      title: '子育てに疲れた診断',
      sub: '子どもを思って悩んできたあなたが、すでに十分やってきたことを見つけます。',
      about: '育児疲れ・親としての責任感・自分の時間のなさを扱います。'
    },
    'ganbari': {
      file: 'ganbari.html', cat: '自分自身', emoji: '🌾', live: true, schema: 2,
      title: '頑張りすぎて疲れた診断',
      sub: '頑張りすぎてしまうあなたの中にある、責任感や強さを見つけます。',
      about: '仕事に限らず、その人自身の頑張り方そのものを扱います。'
    },
    'kurabe': {
      file: 'kurabe.html', cat: '自分自身', emoji: '🪞', live: true, schema: 2,
      title: '人と比べて落ち込む診断',
      sub: '誰かと比べてしまうあなたの中にある、向上心や真面目さを見つけます。',
      about: 'SNS・同僚・友人・同年代などと自分を比べて落ち込む傾向を扱います。'
    },
    'gaman': {
      file: 'gaman.html', cat: '人間関係', emoji: '🕊️', live: true, schema: 2,
      title: '我慢しすぎて疲れた診断',
      sub: 'あなたが飲み込んできた言葉の裏にある、思いやりや芯の強さを見つけます。',
      about: '自分が我慢することで周囲を成立させてしまう傾向を扱います。'
    },
    'kotoba': {
      file: 'kotoba.html', cat: '自分自身', emoji: '🌫️', live: true, schema: 2,
      title: 'なんとなく心が疲れている診断',
      sub: 'うまく言葉にできない疲れの中から、あなたが続けてきた良いところを見つけます。',
      about: '理由がはっきりしない疲れを扱います。ほかの診断への入口も兼ねます。'
    },
    'renai-jishin': {
      file: 'renai-jishin.html', cat: '恋愛・結婚', emoji: '💗', live: true, schema: 2,
      title: '恋愛で自信をなくした診断',
      sub: '恋愛で自信をなくしたあなたの中にある、人を大切にする気持ちを見つけます。',
      about: '恋愛に対する自信・不安だけを扱います（仕事や一般的な自己肯定感とは分けます）。'
    },
    'kekkon-aseri': {
      file: 'kekkon-aseri.html', cat: '恋愛・結婚', emoji: '🕰️', live: true, schema: 2,
      title: '結婚を焦ってしまう気持ち診断',
      sub: '結婚への焦りの中にある、あなたらしい価値観や良いところを見つけます。',
      about: '結婚していることが正解、という前提は置きません。'
    }
  },

  // 公開済みの診断だけを返す（回遊リンク用）
  live: function (slug) {
    var it = this.items[slug];
    return (it && it.live) ? it : null;
  }
};
