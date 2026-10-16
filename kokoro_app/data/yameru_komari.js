/* 【2026-10-04 実装】会社を辞めるか迷っている診断（困りごと型）— 診断の組み立て
   設計＝_komari_design/4診断/20_骨子_yameru.md（v2）の 1章 ＋ 41・42。旧10問8タイプ版（data/yameru.js）は土台にしない（ファイルは残してある）。
   読み込み順：komari_core.js → data/komari/00_kyotsu.js → data/komari/ym_00_kyotsu.js → テーマ（ym_riyuu・ym_mitooshi・ym_mayoi）→ このファイル → measure.js → komari.js
   ★1問目は5つ：3つの困りごと（今の会社のこと → 辞めたあとのこと → 決め方）＋「体や気持ちがもたず、考える余裕がない」（質問なしの結果 ym_genkai）
     ＋「この中に近いものがない」（質問なしの結果 ym_none）。分かれ道は使わない。
   ★質問なしの2つの結果は、質問を受けない人のただ1つの出口になりうる。どちらにも、職場の害の段落（記録→直属の上司→総合労働相談コーナー）・
     命の1行（KOMARI.common.KIERU_ONE）・心身のサインの1行（mindLine）を必ず入れる（検査 T-12・教師の再査読 S2-0-03）。有料記事は案内しない（2つとも）。
   ★ym_genkai は、判断の材料より先に、休むための相談を出す（辞めるか続けるかは今日決めなくてよい・休むことは辞めることでも続けることを決めることでもない）。
   ★仕事に行きたくない気持ち診断（asa）への案内は ym_none の1か所だけ。職場の人付き合いに疲れた診断（hitozukiai）は、テーマの中では ym_riyuu の D の一歩の後ろの1か所、
     質問なしの結果では ym_none の1か所（骨子 1.3 の4。テーマに進まない人には D の案内が届かないため）。 */
(function () {
  'use strict';
  var C = KOMARI.common, YM = KOMARI.YM, CT = C.CONTACT, LK = C.LINK;
  var GENKAI_TEXT = '体や気持ちがもたなくなってきて、辞めるかどうかを考える余裕もない';
  var NONE_TEXT = 'この中に近いものがない';

  // もう一度探す目安（1問目の文は、書き写さずに部品から取る）
  function againSection() {
    return { kind: 'list', title: 'もう一度、近いものを探すときの目安', plainLead: true,
      lead: '近いものがあれば、もう一度受けて、1問目で選んでください。',
      items: [
        '不満はあるが、今の会社で何とかなるのか分からない →「' + KOMARI.themes.ym_riyuu.q1Text + '」',
        '辞めたあとのお金や次の仕事が分からない →「' + KOMARI.themes.ym_mitooshi.q1Text + '」',
        '材料はあるのに決められない・日によって気持ちが変わる →「' + KOMARI.themes.ym_mayoi.q1Text + '」',
        // 2026-10-13：1問目に「体や気持ちがもたない」を出さなくなったので、選び直しではなく、この結果の中の節へ案内する（文は genkaiResult の見出しと同じ考え）
        '体や気持ちがもたず、考える余裕がない：辞めるかどうかを決める前に、まず体を休めることを考えてください。上の「体や気持ちがつらいとき」に相談先があります。'
      ],
      after: '' };
  }

  // 体や気持ちが限界に近いとき（骨子 1.2）
  function genkaiResult() {
    var kieru = YM.KIERU();
    return {
      key: 'ym_genkai',
      kicker: '回答から見えた、今の状態',
      headline: '辞めるかどうかを決める前に、まず体を休めることを考えてください',
      summary: [
        { label: '困りごと', text: '体や気持ちがもたず、考える余裕がない' },
        { label: '今日やること', text: YM.GENKAI_SUMMARY }
      ],
      sections: [
        { kind: 'text', title: '今の状態', paras: [
          '体や気持ちがもたなくなってきて、辞めるかどうかを考える余裕もない、と答えています。そう感じるほどの状態で、ここまで働いてきたことが伝わります。'
        ] },
        // v2 で文の終わりを直した字（対の検査に通る形）
        { kind: 'text', title: '最初に伝えたいこと', paras: [
          '辞めるか続けるかは、今日決めなくて構いません。休むことは、辞めることでも、続けることを決めることでもありません。体を休めるための相談は、辞める場合にも、続ける場合にも、先にできます。'
        ] },
        { kind: 'phrase', title: '今日からできること（1つだけ）', lead: YM.PHRASE_LEAD,
          phrase: '今の体と気持ちの状態を、3行だけメモする（眠れているか・食べられているか・朝起きたときの様子）。',
          after: '相談するとき、そのまま見せられます。うまく話せなくても、メモがあれば伝わります。' },
        // 相談できる先：心身のサインの1行（mindLine＝職場の相談先→共通の字。検査 T-12）を先頭に、上司・人事への一言と制度の確かめ方
        { kind: 'list', title: '相談できる先', plainLead: true,
          lead: '休むための相談は、辞めるかどうかを決める前にできます。',
          items: [YM.MIND_LINE, YM.GENKAI_ITEMS[1], YM.GENKAI_ITEMS[2]],
          after: '',
          links: [LK.kokoroNoMimi] },
        // 命の段落（裁定 0-1）：共通の定数（KIERU_ONE と、命の案内の項目）を差し込む。最後の節は画面の外に出やすいので、相談できる先の直後に置く（骨子 1.2 の5）
        { kind: 'list', title: C.KIERU_TITLE, plainLead: true,
          lead: C.KIERU_ONE,
          items: [kieru.items[0], kieru.items[2]],
          after: '',
          links: kieru.links },
        // 骨子 1.2 の6（休みを取らせてもらえない人の道＝v2 で追加）
        YM.harmSection('怒鳴られる・休めない働き方が続く・残業代が払われない、といったことが体調に影響しているなら、それはあなたの側の問題ではありません。',
          '休みを申し出ても取らせてもらえないときは、休むための相談が職場の中では進まないことがあります。そのときは、記録を持って、社外の相談先に相談できます。' + CT.sougouRoudou),
        { kind: 'text', title: '少し余裕が出てきたら', paras: [
          '少し余裕が出てきたら、この診断をもう一度受けて、辞めるかどうかを考える材料を整理することもできます。決めるのは、休んで、考えられる状態に戻ってからで十分です。'
        ] }
      ]
    };
  }

  // 「この中に近いものがない」（骨子 1.3）
  function noneResult() {
    return {
      key: 'ym_none',
      kicker: '回答から見えた、今の状態',
      headline: 'この診断の3つの困りごとには、近いものがなかったようです',
      summary: [
        { label: '困りごと', text: '3つの中には、近いものがない' },
        { label: '今日やること', text: '「辞めたい」と思った場面を1つ、3行で書く' }
      ],
      sections: [
        { kind: 'text', title: '今の状態', paras: [
          '会社を辞めるかどうかの迷いが、この診断で扱う3つの困りごとには当てはまらない、と答えています。',
          '無理に、どれかに当てはめる必要はありません。'
        ] },
        { kind: 'phrase', title: '今日からできること（1つだけ）', lead: YM.PHRASE_LEAD,
          phrase: '「辞めたい」と最近いちばん強く思った場面を1つだけ選び、「いつ・何があったか・そのとき何がいちばん嫌だったか」を3行で書く。',
          after: '書くと、迷いが「今の会社のこと」「辞めたあとのこと」「決め方」のどこにあるかが、分かれて見えやすくなります。' },
        { kind: 'list', title: 'こういう場合は、先にこちら', plainLead: true,
          lead: '次に当てはまるときは、この診断より先に、こちらを使ってください。',
          items: [
            'すでに辞めると決めていて、伝え方や手続きで困っている：就業規則で「退職の申し出の時期・手続き」の決まりを確かめられます。辞めたいと伝えたら強く責められた・損害を払わせると言われた・「辞めることを認めない」と言われた場合は、あなたの伝え方だけの問題ではありません。下の「' + YM.HARM_TITLE + '」の手順で、記録して相談できます。'
          ],
          after: '' },
        // ★この節は、害を受けている人のただ1つの出口になることがあるので必ず置く（教師の再査読 S2-0-03 と同じ理由）
        YM.harmSection('給料が払われない・休めないほど長く働いている・怒鳴られる・辞めるようにすすめられる、などがあるときは、あなたの側の問題ではありません。辞めるかどうかを決める前に、記録して、ひとりで抱えないでください。',
          YM.OUTSIDE_NOTE + CT.sougouRoudou + '\n' + CT.roudouKijun),
        // 心身のサインの1行（mindLine）と命の1行（KIERU_ONE）（裁定 0-1・0-5・検査 T-12）
        { kind: 'list', title: '体や気持ちがつらいとき', plainLead: true,
          lead: '',
          items: [YM.MIND_LINE, C.KIERU_ONE],
          after: '',
          links: [LK.kokoroNoMimi, LK.mamorouyoKokoro] },
        againSection()
      ]
    };
  }

  KOMARI.defineDiagnosis({
    slug: 'yameru',
    title: '会社を辞めるか迷っている診断',
    q1: { text: '会社を辞めるか迷っていて、今いちばん困っていることに近いのはどれですか？', hint: 'いちばん近いものを1つ選んでください。いくつか当てはまるときは、今いちばんつらい方を選んでください。' },
    mindLine: YM.MIND_LINE,
    problems: [
      { theme: 'ym_riyuu' },
      { theme: 'ym_mitooshi' },
      { theme: 'ym_mayoi' },
      { none: 'ym_genkai', text: GENKAI_TEXT, result: genkaiResult },
      { none: 'ym_none', text: NONE_TEXT, result: noneResult }
    ]
  });
})();
