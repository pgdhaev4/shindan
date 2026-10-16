/**
 * cta.js — 結果画面の有料導線（note 300円）
 *
 * 形式: noteUrls[診断slug][タイプキー] = 'note の URL'
 *   ★診断×タイプごとに1本（10診断×8タイプ＝最大80本）。
 *   ★URLが空のタイプではCTAを一切出さない。noteが未作成のまま公開しても誤誘導が起きない。
 *
 * 【旧方式は廃止（オーナー指示 2026-09-07）】
 *   2026-08-29に公開した「診断ごとに1本・全タイプ同梱」のnote（下記5本）は、
 *   新しい8タイプの結果と中身が対応しないため、サイトからは案内しない。
 *   参考としてURLだけ残す（販売停止はオーナー判断）。
 *     asa              https://note.com/pure_ferret3539/n/n77075649e7fc
 *     hitozukiai       https://note.com/pure_ferret3539/n/nf16d9c8d7683
 *     kosodate-tsukare https://note.com/pure_ferret3539/n/n2025e3dca4fa
 *     kotoba           https://note.com/pure_ferret3539/n/n72df5ea2bc23
 *     yameru           https://note.com/pure_ferret3539/n/nc543903bbd52
 *
 * 文言の方針: 説明型（「有料版ではこんなことが知れます」）をやめ、
 *   「まだ拾えるあなたの良さが残っている」という続きの案内にする。
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
window.KOKORO_CTA = {
  // note を作ったら、該当タイプの '' にURLを入れる。入れたタイプだけCTAが出る。
  noteUrls: {
    'asa': {
      'hito-junbi-ugokidasu': '', 'hito-junbi-jikkuri': '',
      'hito-karada-ugokidasu': '', 'hito-karada-jikkuri': '',
      'shigoto-junbi-ugokidasu': '', 'shigoto-junbi-jikkuri': '',
      'shigoto-karada-ugokidasu': '', 'shigoto-karada-jikkuri': ''
    },
    'yameru': {
      'shigoto-shiraberu-sonaeru': '', 'shigoto-shiraberu-tsuzukeru': '',
      'shigoto-kanjiru-sonaeru': '', 'shigoto-kanjiru-tsuzukeru': '',
      'kankyo-shiraberu-sonaeru': '', 'kankyo-shiraberu-tsuzukeru': '',
      'kankyo-kanjiru-sonaeru': '', 'kankyo-kanjiru-tsuzukeru': ''
    },
    'hitozukiai': {
      'kanjiru-kiku-hitori': '', 'kanjiru-kiku-furikaeri': '',
      'kanjiru-hanasu-hitori': '', 'kanjiru-hanasu-furikaeri': '',
      'mawasu-kiku-hitori': '', 'mawasu-kiku-furikaeri': '',
      'mawasu-hanasu-hitori': '', 'mawasu-hanasu-furikaeri': ''
    },
    'kosodate-tsukare': {
      'jikan-yorisou-ganbaru': '', 'jikan-yorisou-yurumeru': '',
      'jikan-totonoeru-ganbaru': '', 'jikan-totonoeru-yurumeru': '',
      'kokoro-yorisou-ganbaru': '', 'kokoro-yorisou-yurumeru': '',
      'kokoro-totonoeru-ganbaru': '', 'kokoro-totonoeru-yurumeru': ''
    },
    'ganbari': {
      'hito-ryou-mae': '', 'hito-ryou-uchi': '',
      'hito-shitsu-mae': '', 'hito-shitsu-uchi': '',
      'kijun-ryou-mae': '', 'kijun-ryou-uchi': '',
      'kijun-shitsu-mae': '', 'kijun-shitsu-uchi': ''
    },
    'kurabe': {
      'seika-ugoku-chikai': '', 'seika-ugoku-tooi': '',
      'seika-kangaeru-chikai': '', 'seika-kangaeru-tooi': '',
      'kurashi-ugoku-chikai': '', 'kurashi-ugoku-tooi': '',
      'kurashi-kangaeru-chikai': '', 'kurashi-kangaeru-tooi': ''
    },
    'gaman': {
      'shokuba-nomikomu-kirikae': '', 'shokuba-nomikomu-kaeri': '',
      'shokuba-awaseru-kirikae': '', 'shokuba-awaseru-kaeri': '',
      'mijika-nomikomu-kirikae': '', 'mijika-nomikomu-kaeri': '',
      'mijika-awaseru-kirikae': '', 'mijika-awaseru-kaeri': ''
    },
    'kotoba': {
      'karada-ugoku-totonoeru': '', 'karada-ugoku-matsu': '',
      'karada-yasumu-totonoeru': '', 'karada-yasumu-matsu': '',
      'kokoro-ugoku-totonoeru': '', 'kokoro-ugoku-matsu': '',
      'kokoro-yasumu-totonoeru': '', 'kokoro-yasumu-matsu': ''
    },
    'renai-jishin': {
      'dekigoto-awaseru-mae': '', 'dekigoto-awaseru-yasumi': '',
      'dekigoto-mamoru-mae': '', 'dekigoto-mamoru-yasumi': '',
      'jibun-awaseru-mae': '', 'jibun-awaseru-yasumi': '',
      'jibun-mamoru-mae': '', 'jibun-mamoru-yasumi': ''
    },
    'kekkon-aseri': {
      'soto-keikaku-sagasu': '', 'soto-keikaku-totonoeru': '',
      'soto-kanjou-sagasu': '', 'soto-kanjou-totonoeru': '',
      'uchi-keikaku-sagasu': '', 'uchi-keikaku-totonoeru': '',
      'uchi-kanjou-sagasu': '', 'uchi-kanjou-totonoeru': ''
    }
  },

  // 文言パターン（計測のva欄に入る）
  variant: 'b',

  v2: {
    lead: 'まだ、10問の回答から拾えるあなたの良さが残っています。',
    headline: function (typeName) {
      return 'この先では、「' + typeName + '」のあなたについて、無料結果では拾いきれなかった良いところを、もう少し細かく見ていきます。';
    },
    body: [
      '改善点を探す診断ではありません。あなたがすでに持っている良さに気づくための続きです。',
      '今の自分を責める材料ではなく、自分を少し好きになれる材料を持って帰ってください。'
    ],
    button: 'あなたの良いところの続きを読む（300円）',
    note: '※読みもののページ（note）が開きます。購入しなくても、ここまでの結果はすべて読めます。'
  },

  /* v3（2026-09-08 試作）＝「販売」ではなく、無料結果の自然な続きとして置く文言。
     何が増えるのかを、タイプごとの「この先で読めること」（データ側）で具体的に見せる。 */
  v3: {
    lead: 'まだ、自分では数えていない良さがあります。',
    body: function (typeName) {
      return [
        '今回の無料の結果では、10問の中でも特に強く出ていたところだけを拾いました。',
        '300円の続きでは、「' + typeName + '」のあなたについて、もう少し丁寧に見ていきます。',
        '自分を少し好きになれる材料を持って帰ってください。'
      ];
    },
    itemsHead: 'この先で読めること',
    button: 'まだ数えていない良さを読む（300円）',
    note: '※読みもののページ（note）が開きます。購入しなくても、ここまでの結果はすべて読めます。'
  },

  /* v4（2026-09-09 試作）＝短いCTA。**〜** は太字。
     ボタンは3候補を比較し、ブランド（褒めて元気にして帰す）との整合と押しやすさで第一候補を採用。 */
  v4: {
    lead: 'まだ、10問の答えから拾えるあなたの良さがあります。',
    // ★2026-09-10 正式仕様：有料＝「理解＋実用性」。良さに加えて、また同じことで悩んだときに使える
    //   考え方・具体的な対処法まであることを伝える。本文は短く、価値の説明は下の6項目に任せる（文面はオーナー提示の例）。
    //   2026-09-15 オーナー指示で「迷ったとき」→「悩んだとき」に統一（サイトのテーマ＝悩み・有料⑤の役割と合わせる）。
    body: [
      'この先では、自分でも気づきにくい良さに加えて、**また同じことで悩んだときに使える考え方や具体的な対処法**まで見ていきます。',
      '改善点を探す続きではありません。'
    ],
    itemsHead: 'この先で読めること',
    button: 'まだ気づいていない良さを見てみる（300円）',
    note: '※読みもののページ（note）が開きます。購入しなくても、ここまでの結果はすべて読めます。'
  }
};
