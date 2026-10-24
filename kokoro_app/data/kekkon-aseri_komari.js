/* 【2026-10-04 実装】結婚を焦ってしまう気持ち診断（困りごと型）— 診断の組み立て
   設計＝_komari_design/4診断/20_骨子_kekkon-aseri.md（v2）の 1章 ＋ 41・42。旧10問8タイプ版（data/kekkon-aseri.js）は土台にしない（ファイルは残してある）。
   読み込み順：komari_core.js → data/komari/00_kyotsu.js → data/komari/kk_00_kyotsu.js → テーマ（kk_hanashi・kk_konkatsu・kk_mawari・kk_hitori）→ このファイル → measure.js → komari.js
   ★1問目は5つ：4つの困りごと＋「この中に近いものがない」（質問なしの結果 kk_none）。分かれ道は使わない。補足に「結婚」の範囲の1文（恋結 K-03）。
   ★kk_none は、質問を受けない人のただ1つの出口になりうる。交際相手（と婚活・家族）からの怖いこと＝安全→相談→記録（裁定 0-4・オーナー指示5）、
     心身のサインの1行（mindLine）と命の1行（KOMARI.common.KIERU_ONE）を必ず入れる（検査 T-12）。有料記事は案内しない。
   ★結婚⇔恋愛の診断の案内は、この結果では「もう一度、近いものを探すときの目安」の1か所だけ。 */
(function () {
  'use strict';
  var C = KOMARI.common, KK = KOMARI.KK, CT = C.CONTACT, LK = C.LINK;
  var NONE_TEXT = 'この中に近いものがない';

  function noneResult() {
    var T = KOMARI.themes;
    return {
      key: 'kk_none',
      kicker: '回答から見えた、今の状態',
      headline: 'この診断の4つの困りごとには、近いものがなかったようです',
      summary: [
        { label: '困りごと', text: '4つの中には、近いものがない' },
        { label: '今日やること', text: '気持ちが動いた場面を1つ、3行で書く' }
      ],
      sections: [
        { kind: 'text', title: '今の状態', paras: [
          '結婚のことで焦りやつらさがあるが、この診断で扱う4つには当てはまらない、と答えています。',
          '**無理に、どれかに当てはめる必要はありません。**'
        ] },
        { kind: 'phrase', title: '今日からできること（1つだけ）', lead: '今日は、次のことだけ試してください。',
          phrase: '結婚のことで気持ちが動いた場面を1つだけ選び、「いつ・何があって・何が頭に浮かんだか」を3行で書く。',
          after: '書いてみると、焦りが「相手とのこと」なのか、「周りの声」なのか、「自分の中の時間の感じ方」なのかが、分かれて見えやすくなります。' },
        { kind: 'text', title: '結婚したいかどうか、自分でも分からないとき', paras: [
          'はい・いいえで答える問いは、その日の気分や周りの声で揺れやすいものです。分からないままで構いません。「どんな毎日を送りたいか」なら、答えが1つでなくても書けます。'
        ] },
        { kind: 'text', title: '交際相手から結婚を急かされているとき', paras: [
          '決めるのは二人です。その場で答えを出さなくて大丈夫です。例：「大事なことだから、すぐには答えられない。〇日に、ゆっくり話す時間をもらえる？」'
        ] },
        // 安全→相談→記録（裁定 0-4・検査 T-06）。婚活・家族からの怖いことも、同じく安全と相談を先に（オーナー指示5）
        { kind: 'list', title: '交際相手や周りの人から、怖いことをされている場合', plainLead: true,
          lead: '交際相手から、怒鳴られる・物に当たられる・脅される・連絡や交友関係を縛られる・たたかれる・嫌だと言っても性的なことを求められる、といったことがあるなら、それは結婚の話の進め方や、あなたの焦りの問題ではありません。婚活で会った人や、家族・親戚から、付きまとわれる・脅される・たたかれる、といったことがある場合も同じです。どう答えるか・どう進めるかより先に、安全と相談を先にしてください。',
          items: [
            '今まさに危ないときは、110番に連絡する。',
            '信頼できる人に話す。' + CT.dvNaviKousai + CT.dvNavi,
            CT.dvPlus,
            KK.SEITEKI_PARTNER,
            '付きまといや脅しは、警察にも相談できる。' + CT.keisatsu9110,
            KK.REC_PARTNER_STEP
          ],
          after: C.LEAVE_KEKKON + '\n相談することと、この先どうするかを決めることは、別のことです。\n' + C.HISTORY,
          links: [LK.dvNavi, LK.dvPlus, LK.oneStop] },
        { kind: 'list', title: '消えてしまいたいと思うほどつらいとき・心と体が限界に近いとき', plainLead: true,
          lead: '',
          items: [C.KIERU_ONE, KK.MIND_LINE],
          after: '',
          links: [LK.mamorouyoKokoro] },
        // 1問目の文は、書き写さずに部品から取る（恋結 K-01 の言葉にそろえた目安）
        { kind: 'list', title: 'もう一度、近いものを探すときの目安', plainLead: true,
          lead: '近いものがあれば、もう一度受けて、1問目で選んでください。',
          items: [
            '交際相手がいて、結婚の話が進まない →「' + T.kk_hanashi.q1Text + '」',
            '婚活の中で、焦ったり、疲れたり、うまく進まなかったりする →「' + T.kk_konkatsu.q1Text + '」',
            '人から結婚のことを言われたり聞かれたりする →「' + T.kk_mawari.q1Text + '」',
            'だれにも言われていないのに焦る・出会いがない・婚活はしていない・結婚したいのか自分でも分からない →「' + T.kk_hitori.q1Text + '」',
            '恋愛そのもので自信をなくしている（相手の気持ちが不安・自分に自信がない）→ 別の診断『' + KK.RENAI_NAME + '』'
          ],
          after: '' }
      ]
    };
  }

  KOMARI.defineDiagnosis({
    slug: 'kekkon-aseri',
    title: '結婚を焦ってしまう気持ち診断',
    q1: { text: '結婚のことで、最近いちばん焦りやつらさを感じるのは、どれに近いですか？',
      hint: 'いちばん近いものを1つ選んでください。いくつか当てはまるときは、今いちばんつらいものを選んでください。ここでいう「結婚」には、届け出をしない形で一緒に暮らしていくことや、再婚も含みます。' },
    mindLine: KK.MIND_LINE,
    problems: [
      { theme: 'kk_hanashi' },
      { theme: 'kk_konkatsu' },
      { theme: 'kk_mawari' },
      { theme: 'kk_hitori' },
      { none: 'kk_none', text: NONE_TEXT, result: noneResult }
    ]
  });
})();
