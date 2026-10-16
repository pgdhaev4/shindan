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
  // 2026-10-11：4診断だけに整理（ほかの6つは live:false。ページは 旧\4診断のみに整理_20261011\ へ移した）
  order: ['yameru', 'hitozukiai', 'kekkon-aseri', 'renai-jishin', 'kosodate-tsukare'],   // 2026-10-12 職場の人付き合いを戻した

  // カテゴリの表示順と色クラス
  cats: [
    { key: '仕事',       cls: 'cat-work' },
    { key: '人間関係',   cls: 'cat-people' },
    { key: '自分自身',   cls: 'cat-self' },
    { key: '恋愛・結婚', cls: 'cat-love' }
  ],

  items: {
    'asa': {
      file: 'asa.html', cat: '仕事', emoji: '💼', live: false, schema: 2,
      title: '仕事に行きたくない気持ち診断',
      sub: '「行きたくない」と思いながらも向き合ってきたあなたの、粘り強さや優しさを見つけます。',
      about: '今日・明日、仕事へ行くこと自体がつらい気持ちを扱います。'
    },
    'yameru': {
      file: 'yameru.html', cat: '仕事', emoji: '🧭', live: true, schema: 2,
      title: '会社を辞めるか迷っている診断',
      sub: '辞めるか続けるかで迷っているときに、何が迷いを止めているのか、まず何を確かめればいいのかを整理します。',
      about: '辞めるか続けるかの答えは出しません。迷いを、困りごと（理由が会社で変えられるか分からない など）として整理し、確かめる材料と手順をお返しします。（2026-10-04 困りごと型）'
    },
    'hitozukiai': {
      file: 'hitozukiai.html', cat: '人間関係', emoji: '🫧', live: true, schema: 2,
      title: '職場の人付き合いに疲れた診断',
      sub: '職場の人付き合いで何に疲れているのか、なぜつらくなりやすいのか、まず何をすればいいのかを整理します。',
      about: '職場の人間関係の疲れを、困りごと（頼まれると断れない など）として整理します。'
    },
    'kosodate-tsukare': {
      file: 'kosodate-tsukare.html', cat: '自分自身', emoji: '🌙', live: true, schema: 2,
      title: '子育てに疲れた診断',
      sub: '子育てで何に疲れているのか、なぜつらくなりやすいのか、まず何を減らしたり頼ったりすればいいのかを整理します。',
      about: '子育ての疲れを、困りごと（休めない・イライラして強く言ってしまう・自分を責める）として整理します。（2026-10-04 困りごと型）'
    },
    'ganbari': {
      file: 'ganbari.html', cat: '自分自身', emoji: '🌾', live: false, schema: 2,
      title: '頑張りすぎて疲れた診断',
      sub: '頑張りすぎてしまうあなたの中にある、責任感や強さを見つけます。',
      about: '仕事に限らず、その人自身の頑張り方そのものを扱います。'
    },
    'kurabe': {
      file: 'kurabe.html', cat: '自分自身', emoji: '🪞', live: false, schema: 2,
      title: '人と比べて落ち込む診断',
      sub: '誰かと比べてしまうあなたの中にある、向上心や真面目さを見つけます。',
      about: 'SNS・同僚・友人・同年代などと自分を比べて落ち込む傾向を扱います。'
    },
    'gaman': {
      file: 'gaman.html', cat: '人間関係', emoji: '🕊️', live: false, schema: 2,
      title: '我慢しすぎて疲れた診断',
      sub: 'あなたが飲み込んできた言葉の裏にある、思いやりや芯の強さを見つけます。',
      about: '自分が我慢することで周囲を成立させてしまう傾向を扱います。'
    },
    'kotoba': {
      file: 'kotoba.html', cat: '自分自身', emoji: '🌫️', live: false, schema: 2,
      title: 'なんとなく心が疲れている診断',
      sub: 'うまく言葉にできない疲れの中から、あなたが続けてきた良いところを見つけます。',
      about: '理由がはっきりしない疲れを扱います。ほかの診断への入口も兼ねます。'
    },
    'renai-jishin': {
      file: 'renai-jishin.html', cat: '恋愛・結婚', emoji: '💗', live: true, schema: 2,
      title: '恋愛で自信をなくした診断',
      sub: '恋愛で自信が揺れたときに、何が起きているのか、まず何をすればいいのかを整理します。',
      about: '恋愛で自信をなくしたときの困りごと（何度も確かめる・合わせすぎる・自分を責める・踏み出せない）を整理します。別れや告白は勧めません。（2026-10-04 困りごと型）'
    },
    'kekkon-aseri': {
      file: 'kekkon-aseri.html', cat: '恋愛・結婚', emoji: '🕰️', live: true, schema: 2,
      title: '結婚を焦ってしまう気持ち診断',
      sub: '結婚のことで焦るときに、何が焦りのもとになっているのか、まず何をすればいいのかを整理します。',
      about: '結婚の焦りを、困りごと（話が進まない・婚活に疲れた・周りに言われる・ひとりで焦る）として整理します。結婚することを正解にはしません。（2026-10-04 困りごと型）'
    }
  },

  // 公開済みの診断だけを返す（回遊リンク用）
  live: function (slug) {
    var it = this.items[slug];
    return (it && it.live) ? it : null;
  }
};
