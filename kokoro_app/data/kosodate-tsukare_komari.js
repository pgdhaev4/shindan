/* 【2026-10-04 実装】子育てに疲れた診断（困りごと型）— 診断の組み立て
   設計＝_komari_design/4診断/20_骨子_kosodate-tsukare.md（v2）の 1章 ＋ 41・42。旧10問8タイプ版（data/kosodate-tsukare.js）は土台にしない（ファイルは残してある）。
   読み込み順：komari_core.js → data/komari/00_kyotsu.js → data/komari/ks_00_kyotsu.js → テーマ（ks_yasumenai・ks_iraira・ks_jiseki）→ このファイル → measure.js → komari.js
   ★1問目は5つ：3つの困りごと＋「子どもの様子が心配」（質問なしの結果 ks_shinpai）＋「この中に近いものがない」（質問なしの結果 ks_none）。分かれ道は使わない。
   ★質問なしの2つの結果は、質問を受けない人のただ1つの出口になりうる。家族からの害・手が出そうで怖い・消えてしまいたい、の3つの安全の段落（KOMARI.KS.safetyBlock）を
     2つの結果で同じものとして出す（家 C-02）。命の1行（KOMARI.common.KIERU_ONE）と心身のサインの1行（mindLine）を必ず入れる（検査 T-12）。
   ★ks_shinpai は、子どもの育ちや体調を判定しない。聞ける先（子どもを実際に見ている人・台帳にある窓口）を渡す。有料記事は案内しない（2つとも）。 */
(function () {
  'use strict';
  var C = KOMARI.common, KS = KOMARI.KS, CT = C.CONTACT, LK = C.LINK;
  var SHINPAI_TEXT = '子どもの育ちや体調、園や学校のことが心配で、気が休まらない';
  var NONE_TEXT = 'この中に近いものがない';

  // もう一度探す目安（1問目の文は、書き写さずに部品から取る）
  function againSection(withShinpai) {
    var items = [
      '疲れているのに休めない・家のことを自分が回している →「' + KOMARI.themes.ks_yasumenai.q1Text + '」',
      '子どもに強く言ってしまうことがつらい →「' + KOMARI.themes.ks_iraira.q1Text + '」',
      'あとから自分を責める気持ちがつらい →「' + KOMARI.themes.ks_jiseki.q1Text + '」'
    ];
    // 2026-10-13：1問目に「子どもの様子が心配」を出さなくなったので、選び直しの案内ではなく、聞ける先（shinpaiResult と同じ文）を示す
    if (withShinpai) items.push('子どもの育ちや体調、園や学校のことが心配：この診断では、子どもの育ちや体調を判定しません。かかりつけの医師や、園や学校の先生（担任・保健室の先生など）に聞けます。');
    return { kind: 'list', title: 'もう一度、近いものを探すときの目安', plainLead: true,
      lead: '近いものがあれば、もう一度受けて、1問目で選んでください。',
      items: items, after: '' };
  }

  // 「この中に近いものがない」（骨子 1-2）
  function noneResult() {
    return {
      key: 'ks_none',
      kicker: '回答から見えた、今の状態',
      headline: 'この診断の3つの困りごとには、近いものがなかったようです',
      summary: [
        { label: '困りごと', text: '3つの中には、近いものがない' },
        { label: '今日やること', text: 'いちばん疲れた場面を1つ、3行で書く' }
      ],
      sections: [
        { kind: 'text', title: '今の状態', paras: [
          '子育ての疲れが、この診断で扱う3つの困りごとには当てはまらない、と答えています。',
          '**無理に、どれかに当てはめる必要はありません。**'
        ] },
        { kind: 'phrase', title: '今日からできること（1つだけ）', lead: '今日は、次のことだけ試してください。',
          phrase: '今日いちばん疲れた場面を1つ選び、「いつ・何をしていたとき・どんな気持ちだったか」を3行で書く。',
          after: '書いてみると、困っているのが体の疲れなのか、その場のやりとりなのか、あとから続く気持ちなのか、家族の言動なのかが、分かれて見えやすくなります。' }
      ].concat(KS.safetyBlock(), [againSection(true)])
    };
  }

  // 「子どもの様子が心配で、気が休まらない」（骨子 1-3）
  function shinpaiResult() {
    return {
      key: 'ks_shinpai',
      kicker: '回答から見えた、今の状態',
      headline: '子どもの様子が心配で、気が休まらない状態です',
      summary: [
        { label: '困りごと', text: '子どもの様子が心配で、気が休まらない' },
        { label: '今日やること', text: '気になる様子を、3つまでメモする' }
      ],
      sections: [
        { kind: 'text', title: '今の状態', paras: [
          '子どもの育ちや体調、園や学校のことが心配で、気が休まらない、と答えています。',
          'この診断では、子どもの育ちや体調を判定しません。心配なことは、子どもを実際に見ている人に聞くのが確かです。'
        ] },
        { kind: 'phrase', title: '今日からできること（1つだけ）', lead: '今日は、次のことだけ試してください。',
          phrase: '気になる様子を、「いつ・どんな場面で・どのくらい続いているか」で、3つまでメモする。',
          after: 'メモがあると、相談のときにそのまま伝えられます。調べ続けるより、子どもを実際に見ている人に聞く方が確かです。' },
        { kind: 'list', title: '聞ける先', plainLead: true,
          lead: '書いたメモは、子どもを実際に見ている人に見せて聞けます。',
          items: [
            'かかりつけの医師や、園や学校の先生（担任・保健室の先生など）に聞けます。',
            KS.EXTRA.kenshin,
            KS.EXTRA.hokenCenter,
            CT.kodomoKatei,
            CT.kodomoIryou8000,
            '急に具合が悪くなり、命に関わる様子があるときは、119番に連絡します。'
          ],
          after: '子どもが「消えたい」「死にたい」と口にする・自分を傷つけている様子があるときは、ひとりで抱えずに、早めに相談してください。\n' + CT.kodomoSOS + '命の危険が迫っているときは、119番に連絡します。\n心配が続いて、あなた自身が眠れない・休めないときは、あなたのことも相談してください。',
          links: [LK.kodomoKatei, LK.kodomoIryou8000] }
      ].concat(KS.safetyBlock(), [againSection(false)])
    };
  }

  KOMARI.defineDiagnosis({
    slug: 'kosodate-tsukare',
    title: '子育てに疲れた診断',
    q1: { text: '子育てで、最近いちばん疲れていることに近いのはどれですか？', hint: 'いちばん近いものを1つ選んでください。いくつかある場合は、今いちばんつらいものを選んでください。' },
    mindLine: KS.MIND_LINE,
    problems: [
      { theme: 'ks_yasumenai' },
      { theme: 'ks_iraira' },
      { theme: 'ks_jiseki' },
      { none: 'ks_shinpai', text: SHINPAI_TEXT, result: shinpaiResult },
      { none: 'ks_none', text: NONE_TEXT, result: noneResult }
    ]
  });
})();
