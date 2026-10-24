/* 【2026-10-04 実装】恋愛で自信をなくした診断（renai-jishin）の4テーマで共通の部品（1か所で持ち、4テーマの字をそろえる）
   設計＝_komari_design/4診断/20_骨子_renai-jishin.md（v2）の 1章（共通の定数）・2章（全テーマ共通の部品）・9章（検査）
         ＋ 41_裁定_骨子v2の取りまとめ.md（1-1 注意書き・1-2 人格否定・1-3 からかい・1-4 お金・1-5 10代）＋ 42_オーナー指示の反映_実装前.md。
   ★これはテーマではない（KOMARI.defineTheme を呼ばない）。KOMARI.RN に部品を置くだけ。
     テーマ（rn_kakunin.js・rn_awaseru.js・rn_jiseki.js・rn_kowai.js）より先に読む（ファイル名を「rn_00_」にして、読み込み順で先に来るようにしてある）。
     00_kyotsu.js（4診断の共通の文）より後に読む（KOMARI.common を使う）。
   ★窓口の名前・番号・「何をしてくれるか」・性質の語は、KOMARI.common.CONTACT の文か、台帳の publicLines の字だけ。
     交際相手からの暴力＝dvNaviKousai・dvNavi・dvPlus（DV相談＋は「メール」と書かない・「パートナー」の字）／性的な被害＝oneStop／
     性的な画像＝keisatsuImage と法務局（台帳 jinkenNet の publicLines。CONTACT に無いので下の JINKEN_NET に字のまま置いた＝取りまとめ役に「CONTACT に足してほしい」と報告）／
     お金・投資＝shohishaToushi／付きまとい＝keisatsu9110／10代＝kodomoSOS。大切な人を亡くした人の公的な窓口は書かない（台帳 contactsNotToUse）。
     SNSの機能は CONTACT.sns1・sns2 の範囲（「知られずに見る」「ブロックしても気づかれない」と書かない）。
   ★守る線（骨子 0章）：別れる・続ける・告白する・連絡する、のどれも勧めず止めもしない／相手の気持ちを良い方にも悪い方にも推し量らない
     （相手が言葉ではっきり示したこと〈断る・距離をおいてほしい・連絡しないで〉だけを相手の答えとして扱う）／
     相手から言われること・されることで自信が削られている人には、本人の工夫より先に「安全→相談→記録」の順で手を渡す。
   ★10代の相談先の1行（TEEN）は、aite・none・4テーマの警告・kowai・kako・命の項目を選んだ結果に、同じ字で出す（骨子 R-16・取りまとめ 41 の 1-5）。
     命の案内そのものは共通の定数（C.kieru）のまま書きかえられない（検査 T-04）ので、命の項目を選んだ結果では「関連して起きていること」の節に出す
     （取りまとめ役に、C.kieru に10代の1行を足す形を提案済み）。
   ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。 */
(function (root) {
  'use strict';
  var K = root.KOMARI = root.KOMARI || {};
  var C = K.common, CT = C.CONTACT, LK = C.LINK;
  var RN = K.RN = {};

  // ---- 台帳の publicLines のうち、CONTACT に無いもの（字のまま。取りまとめ役に CONTACT への追加を依頼） ----
  RN.JINKEN_NET = CT.jinkenNet;   // 2026-10-04 取りまとめで共通の CONTACT に移した

  // ---- 恋愛の診断だけの定数（骨子 1章の表。4テーマ・aite・none で同じ字） ----
  RN.TEEN = C.TEEN;   // 2026-10-04 取りまとめで共通の定数に移した（命の案内の終わりにも出すため）
  RN.TEEN_PHONE = '10代の人は、次の電話でも相談できます。' + CT.kodomoSOS;
  RN.U18 = '18歳未満の人に、性的な写真や動画を求めることは、求める側の問題です。送ってしまったあとでも、相談できます。';
  // 記録の1行（安全→相談のあとに置く。「見られ」を必ず入れる＝検査 T-06）
  RN.HARM_AFTER = '相手に見られる心配がないときだけ、言われたこと・されたことを、日付と一緒に1行残します。見られるおそれがあるなら、記録より相談を先にしてください。';

  // ---- 頻度（教師と同じ字。骨子 2-3） ----
  // 2026-10-11 オーナー指示：選択肢の数をそろえるため、頻度は4択（4＝ほぼ毎日。強さは「よくある」と同じ扱い＝komari_core.js）
  RN.FREQ_CHOICES = [
    { value: 4, text: 'ほぼ毎日' },
    { value: 3, text: 'よくある（週に何度か）' },
    { value: 2, text: 'ときどきある（月に何度か）' },
    { value: 1, text: 'たまにある程度' }
  ];

  // ---- 心身のサイン（骨子 0-5 の MIND。共通の文 C.mind に「恋愛のこと」を入れる） ----
  RN.MIND_TOPIC = '恋愛のこと';
  RN.mind = function (state) { return C.mind(state, RN.MIND_TOPIC); };
  RN.MIND_LINE = RN.mind('眠れない・食べられない・何をしても楽しめない');   // 質問なしの結果（aite・none）に置く1行（検査 T-12）

  // ---- 命の項目（4診断共通の定数のまま。導入の言葉は「恋愛のこと」） ----
  RN.KIERU_TOPIC = '恋愛のこと';
  RN.KIERU_KEY = 'rn_kieru';
  RN.KIERU_VARIANT = 'teen';   // 命の案内の終わりに10代の人への1行（取りまとめで共通の定数に足した）
  RN.kieru = function () { return C.kieru(RN.KIERU_TOPIC, RN.KIERU_VARIANT); };

  // ---- 関連の共通項目（骨子 2-1。テーマ固有の項目 → 心身のサイン → 安全に関わる項目 → 命の項目〈最後〉の順） ----
  RN.KOWAI_ITEM = '相手の怒り方や機嫌が怖くて、言いたいことを言えないことがある';
  RN.KAKO_ITEM = '以前の恋愛で、暴力や暴言、性的なことで、怖い思いをしたことがある（今は終わっている）';
  RN.OKANE_ITEM = 'やりとりしている（まだ会っていない・会って間もない）相手から、お金や投資・副業の話が出た';
  RN.SPECIAL_KEYS = ['rn_kieru', 'kowai', 'kako', 'okane'];
  // 「2つ以上」の数：専用の案内が出る項目は数えない（骨子 2-4・裁定 0-8）
  RN.countRelated = function (rel) { return rel.filter(function (k) { return RN.SPECIAL_KEYS.indexOf(k) < 0; }).length; };
  RN.relatedChoices = function (rel) {
    return Object.keys(rel).map(function (k) { return { value: k, text: rel[k] }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };
  // 命の項目を選んだ結果の10代の相談先の1行は、命の案内の終わりに出る（共通の定数の variant 'teen'）。関連の節には足さない
  RN.relatedTail = function () { return []; };

  // ---- 専用の案内：相手の怒り方や機嫌が怖いとき（骨子 2-1 の kowai。結婚の kowai と同じ骨組み） ----
  RN.KOWAI_TITLE = '相手の怒り方や機嫌が怖いとき';
  RN.SAFETY = C.safetyNote(RN.KOWAI_TITLE);   // 取りまとめ 41 の 1-1（今日の一歩の下と「最初に変えるポイント」の本文の最後に出る＝検査 T-02）
  RN.KOWAI_PAID_LEAD = '記事では、まず第4章のSTEP4（安全を先にした進め方）を読んでください。確かめ方や伝え方の章は、安全が確かめられてからで十分です。';
  RN.kowai = function () {
    return {
      top: 2,
      summaryFirst: '相手が怖いときは、工夫より先に、あなたの安全を確かめる',
      paid: { lead: RN.KOWAI_PAID_LEAD },
      safety: RN.SAFETY,
      title: RN.KOWAI_TITLE,
      lead: '相手の怒り方や機嫌が怖くて、言いたいことを言えないことがある、と答えています。怒鳴られる・物に当たられる・たたかれる・脅される・連絡や交友やお金を縛られる、があるなら、確かめ方や伝え方の工夫より、あなたの安全を先にしてください。',
      items: [
        '今まさに身の危険があるときは、110番に連絡する',
        '信頼できる人に、「相手のことで、怖いと感じることがある」とだけ話しておく',
        '相談先の名前を1つ、相手に見られない形で控えておく（信頼できる人に覚えておいてもらう形でも十分です）',
        CT.dvNaviKousai,
        CT.dvPlus
      ],
      after: '相談することと、この先どうするかを決めることは、別のことです。\n' + RN.TEEN + '\n' + C.HISTORY,
      links: [LK.dvNavi, LK.dvPlus]
    };
  };

  // ---- 専用の案内：以前の恋愛で、怖い思いをしたとき（骨子 2-1 の kako。心 R-08・R-14） ----
  RN.KAKO_TITLE = '以前の恋愛で、怖い思いをしたとき';
  RN.KAKO_LEAD = '以前の恋愛で、怖い思いをしたことがある、と答えています。怖い思いをしたあとで、人に近づくのが怖くなったり、自分を責めたりするのは、めずらしいことではありません。無理に近づかなくて構いません。';
  // rn_jiseki で出すときだけ足す文（R-14・心 R-01）。振り返りの欄のあるテーマにだけ意味があるので、rn_kowai には出さない（検査 RN-R25）
  //   ★骨子の心 R-01 の1文目「そうした関係のあとで、自分を責める気持ちが出るのは、めずらしいことではありません。」は、本体の2文目と同じことを言うので外した（同じ字のくり返しを避けた）
  RN.KAKO_JISEKI_KEY = '振り返りの欄は、そのときのことには使わなくて大丈夫です。';
  RN.KAKO_JISEKI = 'その関係が終わったことについて、自分を責める必要はありません。' + RN.KAKO_JISEKI_KEY + '起きたことは、あなたの振り返り方で整理するものではなく、相談できることです。';
  RN.kako = function (variant, paidLead) {
    return {
      top: 3,
      paid: { lead: paidLead },
      title: RN.KAKO_TITLE,
      lead: RN.KAKO_LEAD + (variant === 'jiseki' ? RN.KAKO_JISEKI : ''),
      items: [
        'そのときのことが今もつらいときは、信頼できる人に話してください',
        '性的なことで怖い思いをしたときは、次の窓口に相談できます。' + CT.oneStop,
        'そのときのことを思い出してつらい・眠れない、という状態が続くときは、かかりつけの医師にも相談できます。' + CT.seishinHoken
      ],
      after: RN.TEEN,
      links: [LK.oneStop]
    };
  };

  // ---- 専用の案内：やりとりしている相手から、お金の話が出たとき（骨子 2-1 の okane。R-17・取りまとめ 41 の 1-4） ----
  RN.OKANE_TITLE = 'やりとりしている相手から、お金の話が出たとき';
  RN.okane = function () {
    return {
      top: 3,
      title: RN.OKANE_TITLE,
      lead: 'まだ会っていない・会って間もない相手から、お金や投資・副業の話が出た、と答えています。',
      items: [
        'お金を送る前・契約する前に、だれかに相談します。急かされても、その日に決めません',
        CT.shohishaToushi,
        '今まさに脅されているなど、身の危険があるときは、110番に連絡します'
      ],
      after: 'お金の話を断ったあとに、相手との関係が変わることがあっても、断った自分を責めなくて大丈夫です。',
      links: [LK.shohisha188]
    };
  };

  // ---- 環境：交際相手からの害（rn_kakunin・rn_awaseru で1字も違わない＝骨子 R-01・取りまとめ 41 の 1-2・検査 RN-R2） ----
  RN.HARM4 = {
    boryoku:  { text: 'たたく・押す・物を投げる・物に当たる、などをされる／『別れるなら死ぬ』『写真や秘密を広める』などと言われる', heavy: true },
    sei:      { text: '嫌だと伝えても、性的なことや写真を求められる・される', heavy: true },
    sokubaku: { text: 'スマホを見せる・位置情報を共有する・パスワードを教えるよう求められる、友人や家族と会うことを制限される', heavy: true },
    hitei:    { text: '見た目や人格を否定すること、ほかの人と比べて下げることを、くり返し言われる', heavy: true }
  };
  RN.harm4 = function () { var o = {}; Object.keys(RN.HARM4).forEach(function (k) { o[k] = Object.assign({}, RN.HARM4[k]); }); return o; };
  RN.envChoices = function (items) {
    return Object.keys(items).map(function (k) { return { value: k, text: items[k].text }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };

  // 害が強いときの手順（私生活の害の順＝①110番 → ②相談〈信頼できる人・窓口〉→ ③相手に見られない形で残す → 最後に LEAVE。検査 T-04・T-06）
  // 2026-10-11（ChatGPT最終確認の指摘6）：110（身の危険）と119（救急車が必要なけが）を分けて書く
  RN.STEP_110 = '今まさに身の危険があるとき（暴力を受けそう・脅されているなど）は、110番に連絡する。けがをして救急車が必要なときは、119番に連絡する。';
  RN.STEP_TRUST = '信頼できる人（友人・家族など）に、「今こういうことがある」とだけ話す。' + RN.TEEN;
  RN.STEP_RECORD = '相手に見られる心配がないときだけ、言われたこと・されたことを、日付と一緒に短く残す。見られるおそれがあるなら、無理に残さず、相談先で一緒に整理できます。';
  RN.STEP_IMAGE = CT.keisatsuImage + RN.JINKEN_NET;
  // 交際中の2テーマ（rn_kakunin・rn_awaseru）。opt.extra＝LEAVE の前に足す項目（rn_awaseru の先に置く線と U18）
  RN.partnerSteps = function (opt) {
    opt = opt || {};
    return [
      RN.STEP_110,
      RN.STEP_TRUST,
      'たたかれる・脅される・性的なことを求められる・スマホや交友を縛られる、といった怖いことがあるときは、相談先に話す。' + CT.dvNaviKousai,
      CT.dvPlus,
      '性的なことを求められた・されたときは、次の窓口にも相談できる。' + CT.oneStop,
      RN.STEP_RECORD,
      RN.STEP_IMAGE   // 「着信の記録…残して」を含むので、記録の項目より後に置く（T-06 の「最初の記録」は STEP_RECORD）
    ].concat(opt.extra || [], [C.LEAVE]);
  };
  // 付きまといの2テーマ（rn_jiseki・rn_kowai）。opt.service＝運営に知らせる文／opt.image＝性的な画像の項目を入れるか
  RN.STEP_STALK_RECORD = '届いた連絡や、されたことの日時を、消さずに残す。共有している端末やアカウントで相手に見られるおそれがあるなら、残し方は相談先と一緒に考える。';
  RN.stalkSteps = function (opt) {
    opt = opt || {};
    return [
      '今まさに危ないとき・待ち伏せされているときは、110番に連絡する。けがをして救急車が必要なときは、119番に連絡する。',
      RN.STEP_STALK_RECORD,   // 付きまといは、相手と暮らしていないので、消さずに残すことを2番目に（裁定 0-4。結婚の婚活・記事と同じ順）
      CT.keisatsu9110 + (opt.service || ''),
      RN.STEP_TRUST
    ].concat(opt.image ? [RN.STEP_IMAGE] : [], [C.LEAVE]);
  };

  // 二人の決め方（structure）の節の共通の文（骨子 2-2・R-21）
  RN.STRUCT_TITLE = '二人の決め方の側にあること';
  RN.STRUCT_STRONG = '上で挙げたようなことがある相手には、次の相談は無理にしなくて大丈夫です。先に、上の「ひとりで抱えないためにできること」を使ってください。';
  RN.R21 = '決め方を相談しても、毎回聞き入れられない・不機嫌になって責められる、が続くときは、あなたの相談のしかたの問題ではありません。信頼できる人に話して構いません。';

  // 環境の共通（4テーマとも safetyFirst。害が強いとき、ルートの対処と背景の説明を出さず、今日の一歩は相談先を控える形）
  //   ★noPartnerRoutes は使わない：4テーマとも、害が強いときはルートの対処（確かめ方・伝え方・振り返り・近づき方）より安全と相談を先にする（骨子 2-2）
  //   opt：items・alertTitle・alertLead・steps・summary・change・noteOne・contextNote・struct（{ lead, after }）・links
  RN.env = function (opt) {
    var E = {
      items: opt.items,
      safetyFirst: true,
      safeChange: C.SAFE_CHANGE,
      safeWhy: C.SAFE_WHY,
      noteOne: opt.noteOne,
      alertTitle: opt.alertTitle,
      alertLead: opt.alertLead,
      steps: opt.steps,
      links: opt.links,
      summary: opt.summary,
      change: opt.change,
      // safetyFirst で害が強いときは部品が使わない（safeChange が出る）。念のため、ルートの対処を括らずに続ける形だけ置く
      changeBody: function (rc) { return 'そのうえで、あなたの回答に合う工夫もあります：' + rc + '。ただ、相手の言動が原因のときは、あなたの工夫だけで何とかしようとしなくてよいのです。'; },
      today: C.SAFE_TODAY,
      todayAfter: C.SAFE_TODAY_AFTER + C.HISTORY,
      todaySummary: C.SAFE_TODAY_SUMMARY
    };
    if (opt.contextNote) E.contextNote = opt.contextNote;
    if (opt.struct) {
      E.structTitle = RN.STRUCT_TITLE;
      E.structLead = opt.struct.lead;
      E.structStrong = RN.STRUCT_STRONG;
      // safetyStrong＝私生活の害が強い（取りまとめ 41 の 2-1）。そのときは、相手に向けた例文と R-21 の1文を出さず、節は structLead と structStrong だけにする
      E.structAfter = function (keys, safetyStrong) { return safetyStrong ? '' : opt.struct.after + '\n' + RN.R21; };
    }
    return E;
  };

  // ---- 有料記事の共通 ----
  RN.ARTICLE_DIR = 'note公開記事/診断の森/v2_恋愛で自信をなくした/';
  RN.STEP4 = '### STEP4　怖い思いをしているなら、安全を先にして、相談する';   // 4本で同じ見出し（骨子 7-0・0-4）
  RN.FIVE = '### 困ったときに使う5フレーズ';
  RN.CH1 = '## 第1章　つらくなる場面で、自分を守る方法';

  // ---- 「連絡しないで」の但し書き（骨子 T-10・安 R-03）。送る・連絡する一歩の説明の最後に置く ----
  RN.NO_CONTACT = '相手から「連絡しないで」「距離を置きたい」と言われているときは、送らないことが、相手の答えを受け取ることになります。';

  // ---- 診断ごとの検査（_komari_qc.js がテーマの qcBan・qcRules を全組み合わせに当てる） ----
  // 禁止表現（骨子 9章 R1 の一覧。地の文と記事本文に当てる。関連・環境の項目の文と『』の引用は除く）
  RN.QC_BAN = [
    // 2026-10-11（ChatGPT最終確認の指摘4）：関係の価値をこちらで決めない
    [/失ったものは大きくありません|(終わる|続かない|壊れる)(ような)?関係なら|その程度の(関係|相手)/, '関係の価値をこちらで決める言い方'],
    // 2026-10-11（指摘6）：119番を「危ない」だけで案内しない（身の危険＝110番／救急車が必要なけが・体調＝119番）
    [/(?<!命が)危ない(と感じたら|とき(は|に))、?119/,'119番を「危ない」だけで案内する言い方'],
    [/別れるべき|別れた方が|別れましょう|離れましょう|離れた方が|すぐ離れ|逃げて|告白すべき|告白した方が|告白しましょう|連絡すべき|連絡した方が|連絡しましょう|あきらめるべき|あきらめた方が|早く忘れ|次の恋(を探|に進|へ)|復縁しましょう/, '別れ・告白・連絡などの勧め'],
    [/脈あり|脈なし|本命|キープ|冷めている証拠|(相手は|あなたを)好きではない|(相手は|あなたに)興味がない|(相手|向こう)は.{0,10}興味がない|忙しいだけ|きっと好き|相手は変わらない|生活のリズムで決まり/, '相手の気持ちの推し量り'],
    [/魅力がない|愛されない|重い女|重い男|重い人|メンヘラ|依存体質|依存している|執着|恋愛体質|恋愛下手|非モテ|モテる(方法|コツ|ため)|不安型|回避型|愛着スタイル|愛着障害|共依存|試し行動|駆け引き|追わせる|自己肯定感が低い|尽くすタイプ|恋愛に向いていない|向いていない人/, '評価・ラベル'],
    [/あなたにも原因|なぜ離れない|考えすぎ|大げさ|束縛されるのは愛され/, '本人の問題にする言い方'],
    [/あなたは魅力的|必ず愛される|きっとうまくいく|大丈夫ですよ/, '逆向きの保証'],
    [/恋人がいて当然|その年で/, '前提の押しつけ'],
    [/彼(氏|女|が|は|の|に|を)|異性/, '性別の決めつけ']
  ];
  RN.QC_BAN_OK = [
    '恋愛に興味がない時期があっても構いません。',
    '相手に『好きではない』とはっきり言われたときは、それを答えとして受け取ります。',
    '次の恋を急がなくて構いません。',
    '相手を振り向かせる方法や、相手の気持ちを当てる方法は、この記事では扱いません。',
    '人に甘えて構いません。', '障害物', 'ひとりで抱えなくて構いません。', '工夫', '丈夫', '夫婦', '一生懸命',
    C.LEAVE, '自分から距離を置く', '相手から「連絡しないで」と言われているときは、送りません。'
  ];
  RN.QC_BAN_NEGATIVE = 'あなたは恋愛に向いていない人です。';

  function relOf(a, T) { return (a[T.relatedQ] || []).filter(function (k) { return T.related[k]; }); }
  function phraseSec(r) { return r.sections.filter(function (s) { return s.kind === 'phrase'; })[0] || {}; }
  function secAll(s) {
    var out = [];
    ['title', 'lead', 'phrase', 'note', 'body'].forEach(function (k) { if (s[k]) out.push(s[k]); });
    ['paras', 'points', 'items'].forEach(function (k) { (s[k] || []).forEach(function (x) { out.push(x); }); });
    if (Array.isArray(s.after)) s.after.forEach(function (x) { out.push(x); }); else if (s.after) out.push(s.after);
    return out.join('\n');
  }
  RN.secAll = secAll;
  function wrapNote(T, f) { var g = T.todayNote; T.todayNote = function (a, rt, ctx) { return f(g ? (g(a, rt, ctx) || '') : '', a, rt, ctx); }; }
  var SEND_RE = /送る|送り|連絡する|1通/;

  // opt.partner＝交際相手の害の4項目・二人の決め方を持つテーマ（rn_kakunin・rn_awaseru）
  // opt.u18＝先に置く線と U18 を出すテーマ（rn_awaseru）／opt.kako＝'jiseki' か 'kowai'（kako の案内を持つテーマ）
  // opt.leads＝{ 関連のキー: 記事の案内の字 }（専用の案内で記事の案内を差し替えるもの）／opt.noteBan＝付き合う前の注意書きに入れない語（rn_kakunin）
  RN.qcRules = function (opt) {
    opt = opt || {};
    var rules = [];
    if (opt.partner) {
      // R2：交際相手の害の4項目は、2テーマで字と重さが1字も違わない
      rules.push({ name: 'RN-R2 交際相手の害の4項目の字と重さ',
        check: function (r, a, T) {
          var bad = Object.keys(RN.HARM4).filter(function (k) { var x = T.env.items[k]; return !x || x.text !== RN.HARM4[k].text || x.heavy !== true; });
          return bad.length ? '環境「' + bad[0] + '」の字か heavy が、共通の字（RN.HARM4）と違う' : '';
        },
        breakTheme: function (T) { T.env.items.hitei = { text: RN.HARM4.hitei.text.replace('くり返し', ''), heavy: true }; } });
      // R4（T-01 の仕組みの節）：害が強いとき、二人の決め方の節は structStrong で始まり、相手に向けた例文と R-21 の1文を出さない
      rules.push({ name: 'RN-R4 害が強いときの二人の決め方の節',
        check: function (r, a, T) {
          var st = r.sections.filter(function (s) { return s.structure; })[0];
          if (!st || r._judge.env.level !== 2) return '';
          if (st.after.indexOf(RN.STRUCT_STRONG) !== 0) return '害が強いのに、二人の決め方の節が structStrong で始まっていない';
          return /決めてみない/.test(st.after) || st.after.indexOf(RN.R21) >= 0 ? '害が強いのに、二人の決め方の節に相手への例文か R-21 の1文が残っている' : '';
        },
        breakTheme: function (T) { var f = T.env.structAfter; T.env.structAfter = function (keys) { return f(keys, false); }; } });
    }
    // R3：環境・関連の項目の文に「わざと」を使わない（R-08）
    rules.push({ name: 'RN-R3 項目の文にわざとを使わない',
      check: function (r, a, T) {
        var t = Object.keys(T.env.items).map(function (k) { return T.env.items[k].text; }).concat(Object.keys(T.related).map(function (k) { return T.related[k]; })).join('\n');
        return t.indexOf('わざと') >= 0 ? '環境・関連の項目の文に「わざと」がある' : '';
      },
      breakTheme: function (T) { var k = Object.keys(T.env.items)[0]; T.env.items[k] = Object.assign({}, T.env.items[k], { text: 'わざと' + T.env.items[k].text }); } });
    // T-10：送る・連絡する・1通を含む今日の一歩の節には、「連絡しないで」の但し書き（U18 の「送ってしまったあとでも」は一歩ではないので除く）
    rules.push({ name: 'RN-T10 送る一歩に連絡しないでの但し書き',
      check: function (r) {
        var p = phraseSec(r); var t = [p.phrase || '', p.after || '', p.note || ''].join('\n').split(RN.U18).join('');
        return SEND_RE.test(t) && t.indexOf('連絡しないで') < 0 ? '今日の一歩に「' + t.match(SEND_RE)[0] + '」があるのに、「連絡しないで」の但し書きがない' : '';
      },
      breakTheme: function (T) {
        var removed = false;
        Object.keys(T.routes).forEach(function (k) {
          var R = T.routes[k];
          if (R.phraseAfter.indexOf('連絡しないで') >= 0) { R.phraseAfter = R.phraseAfter.split(/(?<=。)/).filter(function (s) { return s.indexOf('連絡しないで') < 0; }).join(''); removed = true; }
        });
        if (!removed) { var k0 = Object.keys(T.routes)[0]; T.routes[k0].phraseAfter += '送るなら1通だけにします。'; }
      } });
    // R14：10代の相談先の1行（警告・kowai・kako・命の項目を選んだ結果）
    rules.push({ name: 'RN-R14 10代の相談先の1行',
      check: function (r, a, T) {
        var miss = r.sections.filter(function (s) { return s.kind === 'alert' || s.special === 'kowai' || s.special === 'kako'; })
          .filter(function (s) { return secAll(s).indexOf(RN.TEEN) < 0; });
        if (miss.length) return '節「' + miss[0].title + '」に10代の相談先の1行（TEEN）がない';
        if (relOf(a, T).indexOf(RN.KIERU_KEY) >= 0) {
          var ks = r.sections.filter(function (s) { return s.special === RN.KIERU_KEY; })[0];
          if (!ks || secAll(ks).indexOf(RN.TEEN) < 0) return '命の項目を選んだのに、10代の相談先の1行（TEEN）がない';
        }
        return '';
      },
      breakTheme: function (T) { T.env.steps = T.env.steps.map(function (x) { return x.split(RN.TEEN).join(''); }); } });
    // R16：relatedAfter の「2つ以上」は、専用の案内の項目を数えない（0-8）
    rules.push({ name: 'RN-R16 関連の数え方',
      check: function (r, a, T) {
        var n = RN.countRelated(relOf(a, T));
        var sec = r.sections.filter(function (s) { return s.title === '関連して起きていること'; })[0];
        var has = !!sec && (sec.after || '').indexOf(T.relTwo) >= 0;
        return (n >= 2) !== has ? '関連の数（専用の案内の項目を除く）が' + n + 'なのに、「2つ以上」の文が' + (has ? 'ある' : 'ない') : '';
      },
      breakTheme: function (T) { var g = T.relatedAfter; T.relatedAfter = function (rel) { return g(rel).split(T.relTwo).join(''); }; } });
    // 専用の案内で記事の案内を差し替える（kowai・kako）：命の項目を選んでいないとき、記事の案内はその字（害が強いときも）
    Object.keys(opt.leads || {}).forEach(function (key) {
      var lead = opt.leads[key];
      rules.push({ name: 'RN-L ' + key + 'の記事案内',
        check: function (r, a, T) {
          var rel = relOf(a, T); if (rel.indexOf(key) < 0 || rel.indexOf(RN.KIERU_KEY) >= 0) return '';
          var p = r.sections.filter(function (s) { return s.kind === 'paid'; })[0];
          return !p || p.lead !== lead ? '「' + key + '」を選んだのに、記事の案内が「' + lead.slice(0, 20) + '…」でない' : '';
        },
        breakTheme: function (T) { T.specials[key] = Object.assign({}, T.specials[key], { paid: undefined }); } });
    });
    // R5（T-02 の字）：kowai を選んだ結果の注意書きは、共通の定数（C.safetyNote に案内の題を入れたもの）と1字も違わない（取りまとめ 41 の 1-1）
    if ((opt.leads || {}).kowai) rules.push({ name: 'RN-R5 注意書きの字',
      check: function (r, a, T) {
        if (relOf(a, T).indexOf('kowai') < 0) return '';
        var want = C.safetyNote(RN.KOWAI_TITLE);
        var ph = phraseSec(r), ch = r.sections.filter(function (s) { return s.kind === 'change'; })[0] || {};
        return (ph.note || '').indexOf(want) < 0 || (ch.body || '').indexOf(want) < 0 ? '相手が怖い（kowai）を選んだのに、注意書きが共通の字（C.safetyNote）で2か所に出ていない' : '';
      },
      breakTheme: function (T) { T.specials.kowai = Object.assign({}, T.specials.kowai, { safety: T.specials.kowai.safety.replace('使わなくて', '使わないで') }); } });
    // R25：kako の rn_jiseki 版の文（振り返りの欄は使わなくてよい）は rn_jiseki だけに出る
    if (opt.kako) rules.push({ name: 'RN-R25 kako の振り返りの欄の文',
      check: function (r, a, T) {
        var s = r.sections.filter(function (x) { return x.special === 'kako'; })[0]; if (!s) return '';
        var has = secAll(s).indexOf(RN.KAKO_JISEKI_KEY) >= 0;
        if (opt.kako === 'jiseki' && !has) return 'rn_jiseki の kako の案内に「' + RN.KAKO_JISEKI_KEY + '」がない';
        if (opt.kako !== 'jiseki' && has) return 'rn_jiseki 以外の kako の案内に、振り返りの欄の文がある';
        return '';
      },
      breakTheme: function (T) {
        var S = T.specials.kako;
        T.specials.kako = Object.assign({}, S, { lead: opt.kako === 'jiseki' ? RN.KAKO_LEAD : S.lead + RN.KAKO_JISEKI });
      } });
    // R24：「デートDV」は画面の結果に書かない（記事の第4章に1回だけ）
    rules.push({ name: 'RN-R24 結果にデートDVを書かない',
      check: function (r) { return r.sections.map(secAll).join('\n').indexOf('デートDV') >= 0 ? '結果に「デートDV」がある' : ''; },
      breakTheme: function (T) { var k0 = Object.keys(T.routes)[0]; T.routes[k0].phraseAfter += 'こうした行動は、デートDVと呼ばれます。'; } });
    // 害が強いときの今日の一歩は、相談先を控える形（共通の字）＋閲覧の履歴の1文
    rules.push({ name: 'RN-S 害が強いときの今日の一歩',
      check: function (r) {
        if (r._judge.env.level !== 2) return '';
        var p = phraseSec(r);
        return p.phrase !== C.SAFE_TODAY || (p.after || '').indexOf(C.HISTORY) < 0 ? '害が強いのに、今日の一歩が「相談先の名前を1つ、相手に見られない形で控えておく」（と閲覧の履歴の1文）でない' : '';
      },
      breakTheme: function (T) { T.env.today = '今日は、あったことを全部書き出す。'; } });
    // U18：rn_awaseru は、害が強くないときは一歩の下（先に置く線の下）、害が強いときは警告の手順に、U18 を出す
    if (opt.u18) rules.push({ name: 'RN-R15 18歳未満の1行',
      check: function (r) {
        if (r._judge.env.level === 2) {
          var al = r.sections.filter(function (s) { return s.kind === 'alert'; })[0];
          return al && secAll(al).indexOf(RN.U18) >= 0 ? '' : '害が強いのに、警告の手順に U18 の1行がない';
        }
        return (phraseSec(r).note || '').indexOf(RN.U18) < 0 ? '一歩の下に U18 の1行がない' : '';
      },
      breakTheme: function (T) { wrapNote(T, function (n) { return n.split(RN.U18).join(''); }); } });
    // R21：付き合う前の注意書きに、相手の気持ちを良い方に推し量る語を入れない
    if (opt.noteBan) rules.push({ name: 'RN-R21 付き合う前の注意書き',
      check: function (r) { var n = phraseSec(r).note || ''; var m = n.match(opt.noteBan); return m ? '一歩の下の注意書きに「' + m[0] + '」がある' : ''; },
      breakTheme: function (T) { wrapNote(T, function (n) { return n + '返信の速さは、生活のリズムで決まります。'; }); } });
    return rules;
  };
})(typeof window !== 'undefined' ? window : globalThis);
