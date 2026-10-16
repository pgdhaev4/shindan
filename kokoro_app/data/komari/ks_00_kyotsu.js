/* 【2026-10-04 実装】子育てに疲れた診断（kosodate-tsukare）の3テーマで共通の部品（1か所で持ち、3テーマの字をそろえる）
   設計＝_komari_design/4診断/20_骨子_kosodate-tsukare.md（v2）の 1-1・2章・5章 ＋ 41_裁定_骨子v2の取りまとめ.md ＋ 42_オーナー指示の反映_実装前.md
   ★これはテーマではない（KOMARI.defineTheme を呼ばない）。KOMARI.KS に部品を置くだけ。
     テーマ（ks_yasumenai.js・ks_iraira.js・ks_jiseki.js）より先に読む（ファイル名を「ks_00_」にして、読み込み順で先に来るようにしてある）。
     00_kyotsu.js（4診断の共通の文）より後に読む（KOMARI.common を使う）。
   ★窓口の名前・番号・「何をしてくれるか」・性質の語（無料・24時間 など）は、KOMARI.common.CONTACT の文か、台帳の publicLines の字だけ。
     CONTACT に無い publicLines（産後ケア・保健センター・乳幼児健診・地域包括支援センター）は下の EXTRA に字のまま置いた（取りまとめ役に「CONTACT に足してほしい」と報告済み）。
   ★守る線（骨子 0-2）：子どもの病名・発達の判断をしない／親を採点しない・責めない／性別で役割を決めない（「パートナー」「家族」「いっしょに暮らす大人」）／
     大きな決断をすすめない／「離れる・休む・しない家事・言わない・預ける・任せる」を出す節には「安全」を同じ節に置く（qcRules の T-09）。
   ★赤ちゃんの安全（オーナー指示3）：泣きやまず気持ちが高ぶっているときの文は KOMARI.common.BABY_CALM（寝かせる→離れる→少ししたら戻って確かめる→揺さぶらない）を使う。
     「離れる」だけで終わる文を作らない（qcRules が全組み合わせで確かめる）。
   ★「今日やる必要があること」の基準（オーナー指示4）は KOMARI.common.KOSODATE_MUST。「安全・食べること・眠ること」だけの字にしない（qcRules）。
   ★189 は「こどもが虐待を受けているかもしれないと思ったとき」の CONTACT.jisou189 の文だけ。子育ての悩みの窓口は jisouSoudan（0120-189-783）と oyakoLine。
   ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。 */
(function (root) {
  'use strict';
  var K = root.KOMARI = root.KOMARI || {};
  var C = K.common, CT = C.CONTACT, LK = C.LINK;
  var KS = K.KS = {};

  // ---- 台帳の publicLines のうち、子育てで使うもの（共通の CONTACT から取る） ----
  KS.EXTRA = { sangoCare: CT.sangoCare, hokenCenter: CT.hokenCenter, kenshin: CT.nyuyojiKenshin, chiikiHoukatsu: CT.chiikiHoukatsu };   // 2026-10-04 取りまとめで共通の CONTACT に移した

  // ---- 質問の選択肢（3テーマで同じ字） ----
  // 頻度：子育ては毎日の場面なので、教師（週に何度も／月に何度か）から1段ずらした（骨子 2.5）
  // 2026-10-11 オーナー指示：選択肢の数をそろえるため、頻度は4択（4＝ほぼ毎日。強さは「よくある」と同じ扱い＝komari_core.js）
  //   子育ては、これまで「よくある＝ほぼ毎日・ときどき＝週に何度か」だったのを、ほかの3診断と同じ区切りにそろえた
  KS.FREQ_CHOICES = [
    { value: 4, text: 'ほぼ毎日' },
    { value: 3, text: 'よくある（週に何度か）' },
    { value: 2, text: 'ときどきある（月に何度か）' },
    { value: 1, text: 'たまにある程度' }
  ];
  KS.freqLabel = function (v) { return { 4: 'ほぼ毎日', 3: 'よくある（週に何度か）', 2: 'ときどきある（月に何度か）', 1: 'たまにある程度' }[v] || 'たまにある程度'; };
  // 年齢（休めない・強く言ってしまう、の2テーマ。自分を責める、には置かない＝骨子 3-3・家 C-26）
  KS.AGE_CHOICES = [
    { value: 'baby',   text: '赤ちゃん（1歳くらいまで）' },
    { value: 'small',  text: '1歳くらいから、小学校に入る前まで' },
    { value: 'school', text: '小学生' },
    { value: 'teen',   text: '中学生以上' },
    { value: 'mixed',  text: '何人かいて、1つに決められない' }
  ];
  KS.hasBaby = function (age) { return age === 'baby' || age === 'mixed'; };
  // 2026-10-11（8問に）：年齢の質問を出さなくなったので、答えがないときは「何人かいて1つに決められない（mixed）」と同じ扱いにする
  //   ＝赤ちゃんの安全の文と「小学校に入る前の子がいるときは」の文を、条件つきの言い方で全員に出す（安全の案内を減らさない）
  KS.age = function (v) { return v || 'mixed'; };

  // ---- 赤ちゃんの安全の文 ----
  KS.BABY_CALM = C.BABY_CALM;
  // 寝落ちの注意（休めないテーマの C＝子どものそばで座って休む一歩のとき）。あおむけは「1歳になるまでは」を必ず添える（台帳 babySafety の deny）
  KS.neochi = function (age) {
    return (age === 'mixed' ? '家に赤ちゃんもいて、その子が起きているあいだに休むときは、' : '赤ちゃんが起きているあいだに休むときは、') + '赤ちゃんを安全な場所に寝かせてから（1歳になるまでは、あおむけに）、そばで座ります。抱っこしたまま横になると、そのまま眠り込むことがあります。';
  };

  // ---- 「今日やる必要があること」の基準（オーナー指示4） ----
  KS.MUST = C.KOSODATE_MUST;

  // ---- 心身のサイン（骨子 2.3）：共通の文（C.mind）に、子育ての窓口を前に置いた形（共通の窓口の文 MIND_TAIL の前に挟む） ----
  KS.MIND_TOPIC = '子育ての困りごと';
  //   inList＝一覧の項目（li）に置くとき。li では改行が出ないので、改行を入れない（段落の中では、読みやすさのため子育ての窓口の前で改行する）
  KS.mind = function (state, inList) {
    return C.mind(state, KS.MIND_TOPIC).replace(C.MIND_TAIL, (inList ? '' : '\n') + CT.kodomoKatei + C.MIND_TAIL);
  };
  KS.MIND_LINE = KS.mind('眠れない・食べられない・涙が止まらない', true);   // 質問なしの結果に置く1行（検査 T-12。一覧の項目に置く）

  // ---- 関連の共通項目（骨子 2.1。テーマ固有の2項目のあとに、この順で置く。命の項目は必ず最後） ----
  KS.RELATED_COMMON = {
    ks_nemurenai: '寝られる時間があっても、寝つけない・夜中に目が覚める',
    ks_namida:    '理由がはっきりしないのに涙が出る・食べられない・何も手につかない日が続いている',
    ks_kawaii:    '子どもと過ごしていても、楽しめない・かわいいと思えない日がある',
    ks_kowai:     '子どもに手が出てしまった（たたく・強く揺さぶる・乱暴に置く など）、または、出てしまいそうで怖い',
    ks_kieru:     C.KIERU_ITEM
  };
  KS.SPECIAL_KEYS = ['ks_kowai', 'ks_kieru'];
  KS.related = function (own) { return Object.assign({}, own, KS.RELATED_COMMON); };
  KS.relatedChoices = function (own) {
    var r = KS.related(own);
    return Object.keys(r).map(function (k) { return { value: k, text: r[k] }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };
  // 「2つ以上」の数：専用の案内が出る項目（手が出そう・消えてしまいたい）は数えない（骨子 2.6・裁定 0-8）
  KS.countRelated = function (rel) { return rel.filter(function (k) { return KS.SPECIAL_KEYS.indexOf(k) < 0; }).length; };
  // 心身のサインの文（選んだ状態だけを返す。病名・日数の目安は書かない）
  KS.KAWAII = '疲れが重なると、子どもと過ごしていても楽しめない・かわいいと思えない、と感じる日があります。そう感じる自分を責めなくて構いません。';
  KS.mindAfter = function (rel) {
    var has = function (k) { return rel.indexOf(k) >= 0; }, st = [], out = [];
    if (has('ks_nemurenai')) st.push('寝られる時間があっても眠れない');
    if (has('ks_namida')) st.push('理由がはっきりしないのに涙が出る・食べられない・何も手につかない');
    if (has('ks_kawaii')) { out.push(KS.KAWAII); st.push('子どもと過ごしていても楽しめない・かわいいと思えない'); }
    if (st.length) out.push(KS.mind(st.join('、')));
    return out;
  };

  // ---- 専用の案内：子どもに手が出そうで怖いとき（骨子 2.2 の kowai。①〜⑥を、照合の結果と CONTACT の文で組み直した） ----
  //   ・赤ちゃんの寝かせ方と揺さぶらないは、BABY_CALM の1つの文にまとめた（「離れる」だけで終わらせない）
  //   ・夜中・休日もつながる先（公開の条件 家 C-03）＝24時間子供SOSダイヤル（台帳で「24時間・夜間・休日・保護者も」を確認）
  //   ・189 は出さない（子育ての悩みの窓口ではない）。子育ての悩みの電話は 0120-189-783、LINE は親子のための相談LINE
  //   ・2026-10-11（ChatGPT最終確認の指摘2）：「いつもと様子が違うときは119番」は広すぎるので、119番は厚労省「こんな時は迷わず119へ」（子ども）の症状の字に限った（台帳 kyukyu119Kodomo）。
  //     迷うときの先は #8000（台帳 kodomoIryou8000 の publicLines の字）
  //   ・この案内だけに当てる禁止表現（虐待・通報・よくあること・しつけの範囲・二度と・189）は qcRules で見る
  KS.KOWAI_TITLE = '子どもに手が出そうで怖いとき';
  KS.KOWAI_LEAD = '手が出そうで怖いとき、手が出てしまったあとは、ひとりで抱えず、手を借りてよいときです。ここに、止まる手順と、手を借りる先を並べます。';
  KS.KOWAI_STOP = '手が出そう・止まれそうにないと感じたら、子どもの安全を確かめてから、その場を少し離れます。小学校に入る前の子なら、火を止め、浴槽やベランダに近づけない部屋にいることを確かめて、隣の部屋や台所など、声が聞こえる所まで離れます。小学生以上の子なら、「少し頭を冷やしてくるね」と一言伝えて、別の部屋に移ります。どちらも家の外には出ません。落ち着いたら戻って、子どもの様子を確かめます。';
  KS.KOWAI_TALK = 'ひとりのときは、落ち着いてから、信頼できる人や、下の相談先に話します。話すときは、「子どもに強く当たってしまいそうで、怖いんです。」の一言で伝わります。手が出てしまったあとでも、相談して構いません。';
  KS.KOWAI_MED = '強く揺さぶってしまった・頭を打ったかもしれないときは、ひとりで様子を見続けず、医療機関に相談します（夜間や休日に迷うときは、下の #8000 が使えます）。意識がない・けいれんがある・呼吸が弱い・くちびるの色が紫色など、急いで手当てが必要な様子のときは、迷わず119番に連絡します。';
  KS.KOWAI_END = '相談は、責められるためではなく、手を借りるためにするものです。合わないと感じたら、別の相談先を使うこともできます。';
  KS.KOWAI_ITEMS = [
    KS.KOWAI_STOP,
    C.BABY_CALM,
    '安心して子どもを任せられる大人が近くにいれば、こう頼みます：「今、限界かも。10分だけ代わって。」',
    KS.KOWAI_TALK,
    CT.jisouSoudan,
    CT.oyakoLine,
    CT.kodomoSOS,
    KS.KOWAI_MED,
    CT.kodomoIryou8000
  ];
  KS.KOWAI_TODAY = '手が出そうで怖いときは、この一歩より、上の『' + KS.KOWAI_TITLE + '』の手順を先にしてください。';
  KS.kowai = function (paidLead) {
    return {
      top: 2,
      summaryFirst: '手が出そうなときは、子どもの安全を確かめて少し離れ、落ち着いたら戻る',
      paid: { lead: paidLead },
      title: KS.KOWAI_TITLE,
      lead: KS.KOWAI_LEAD,
      items: KS.KOWAI_ITEMS.slice(),
      after: KS.KOWAI_END,
      todayNote: KS.KOWAI_TODAY,
      links: [LK.jisouSoudan, LK.oyakoLine, LK.kodomoIryou8000]
    };
  };
  KS.KOWAI_BAN = /虐待|通報|よくあること|しつけの範囲|二度と|(?<![\d-])189(?![\d-])/;

  // 命の項目（4診断共通の定数のまま。導入の言葉は「子育ての工夫」、子どもの安全の文と終わりの文を足す variant）
  KS.KIERU_TOPIC = '子育ての工夫';
  KS.KIERU_VARIANT = 'kosodate';

  // ---- 環境（骨子 2.4。3テーマで同じ項目・同じ字） ----
  KS.ENV_ITEMS = {
    // 人から受ける害（安全→相談→記録）
    ks_boryoku:  { text: 'パートナーや、いっしょに暮らす大人から、あなたや子どもが、怒鳴られる・物に当たられる・たたかれるなど、怖い思いをしている', heavy: true },
    ks_okane:    { text: '生活に必要なお金を渡されない、または、自分や子どもに必要なお金を使うことを許されない', heavy: true },
    ks_semeru:   { text: 'パートナーや家族から、子育てや家のことを、くり返し強い言葉で責められる' },
    // 仕組み（手の数・分担・使える支援）
    ks_hitori:   { text: '子どもを見る大人が自分ひとりの時間が長い、または、近くに頼れる人がいない', kind: 'structure' },
    ks_katayori: { text: '一緒に暮らす大人（パートナー・家族）がいるが、家のことや子どものことの多くが自分に偏っている（頼んでもやってもらえない、も含む）', kind: 'structure' },
    ks_kakei:    { text: 'お金のやりくりが苦しく、使える支援を知りたい', kind: 'structure' },
    // 事情（補足だけ）
    ks_sango:    { text: '出産して1年たっていない、または、夜泣きや授乳などで夜にまとまって眠れない時期にある', kind: 'context' },
    ks_kanbyo:   { text: '子どもや家族の看病・通院・付き添い・介護が続いている', kind: 'context' }
  };
  KS.envChoices = function () {
    return Object.keys(KS.ENV_ITEMS).map(function (k) { return { value: k, text: KS.ENV_ITEMS[k].text }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };
  KS.ENV_Q_TEXT = 'あなたの家庭や、身の回りで、当てはまるものをすべて選んでください。';

  // 害が強いときの手順（安全→相談→記録→離れる前に相談。検査 T-04・T-06）。KS_SAFETY_BLOCK の節Aと同じ字
  KS.STEPS = [
    '今まさにあなたや子どもが危ないときは、110番に連絡する。',
    '子どもが怖い思いをしているときは、子どもの安全を先にする。今まさに危ないときは110番。' + CT.jisou189,
    '信頼できる人に話す。' + CT.dvNavi,
    CT.dvPlus,
    'あったことを、相手に見られない形で残す。見られるおそれがあるときは、無理に残さず、相談先で一緒に整理できます。',
    C.LEAVE
  ];
  KS.ALERT_LEAD = '回答では、家庭の状況として次のことが選ばれています。家族から怖い思いをさせられる・強い言葉で責められる・生活に必要なお金を自由に使えない、という中では、イライラしたり、休めなかったり、自分を責めたりするのも、無理のないことです。こうした言動は、あなたの子育てや家事のやり方の工夫で変えられるものではありません。';
  KS.STRUCT_STRONG = '上で挙げた言動をしている人が、いっしょに暮らす大人のときは、分担のことは無理に持ち出さなくて大丈夫です。先に、上の「ひとりで抱えないためにできること」を使ってください。';

  // opt.alertExtra＝警告の導入に足すテーマの1文／opt.noPartnerRoutes＝ルートの対処がどれも相手（大人）に向けたものでない（害が強くても対処と背景を残す）
  KS.env = function (opt) {
    opt = opt || {};
    return {
      items: Object.assign({}, KS.ENV_ITEMS),
      safetyFirst: true,
      noPartnerRoutes: !!opt.noPartnerRoutes,
      keepTodayNote: true,
      safeChange: C.SAFE_CHANGE,
      safeWhy: C.SAFE_WHY,
      noteOne: function (t) {
        return 'なお、家庭の状況として「' + t.replace(/「/g, '『').replace(/」/g, '』') + '」も選ばれています。くり返し強い言葉で責められるのは、あなたの受け止め方の問題ではなく、言っている側の行動の問題です。\nつらいときは、ひとりで抱えなくて構いません。' + CT.kodomoKatei + '\n' + CT.dvNavi;
      },
      alertTitle: 'あなたの工夫だけでは解決しない可能性があります',
      alertLead: KS.ALERT_LEAD + (opt.alertExtra ? '\n' + opt.alertExtra : ''),
      steps: KS.STEPS.slice(),
      links: [LK.dvNavi, LK.dvPlus],
      summary: '家庭の中の言動やお金のことによる負担が大きい可能性',
      change: '「子育てのやり方を工夫する」より先に、「あなたと子どもの安全を確かめて、ひとりで抱えない」',
      // ルートの「最初に変えるポイント」は「　」や（　）を含むことがあるので、くくらずに「：」のあとに続ける
      changeBody: function (rc) {
        return 'そのうえで、あなたの回答に合う工夫もあります：' + rc + '。ただ、家族の言動が原因のときは、あなたの工夫だけで何とかしようとしなくてよいのです。';
      },
      today: C.SAFE_TODAY,
      todayAfter: C.SAFE_TODAY_AFTER + C.HISTORY,
      todaySummary: C.SAFE_TODAY_SUMMARY,
      structTitle: '手の数と分担、使える支援のこと',
      structLead: '回答では、次のことも選ばれています。これは、あなたのがんばり方の問題ではなく、子育ての手の数や、家の中の分担、使える支援の問題です。',
      structStrong: KS.STRUCT_STRONG,
      // safetyStrong＝私生活の害が強い（取りまとめ 41 の 2-1）。そのときは、相手（大人）に向けた例文（分担の話し合い）を出さない。外の支援の案内は残す
      structAfter: function (keys, safetyStrong) {
        var has = function (k) { return keys.indexOf(k) >= 0; }, out = [];
        if (has('ks_hitori')) {
          out.push('ひとりで回す量の多さは、あなたのがんばりが足りないということではありません。子どもを短い時間預けられる仕組みがあります。' + CT.ichijiAzukari);
          out.push(CT.familySupport + CT.tankiShien);
          out.push('預け先は、子どもが安全に過ごせるかを、自分で確かめてから使います。分からないことは、お住まいの市区町村の子育ての窓口で聞けます。聞くときの一言：「子どもを短い時間預けられるところを知りたいです。今、近くに頼める人がいません。」');
        }
        if (has('ks_katayori') && !safetyStrong) {
          out.push('家の中の仕事を一度全部書き出して見える形にし（予約・持ち物の準備・買い足しに気づく、などの見えない仕事も）、どれを担当してもらうかを、時間を決めて話します。担当は手伝いではなく、気づく・準備する・やる・片づけるまで丸ごと渡します。例：「家のことを書き出してみたら、今は私の側に〇個あった。このうち〇〇と△△を、担当してもらえないかな。」');
        }
        if (has('ks_kakei')) {
          out.push('お金のやりくりの苦しさは、あなたのがんばりが足りないということではありません。お金のことも、子育ての困りごとの1つとして相談できます。' + (has('ks_hitori') ? '' : CT.kodomoKatei));
        }
        if (has('ks_hitori') || has('ks_kakei')) out.push(CT.hitorioya);
        return out.join('\n');
      },
      contextNote: function (keys) {
        var out = [];
        if (keys.indexOf('ks_sango') >= 0) out.push('夜にまとまって眠れない時期は、疲れが取れにくく、気持ちも揺れやすくなります。今の疲れは、置かれている時期によるところも大きいものです。' + KS.EXTRA.sangoCare);
        if (keys.indexOf('ks_kanbyo') >= 0) out.push('看病や付き添い・介護が続いているときに疲れるのは、自然なことです。通っている病院や相談先には、あなたの疲れのことも話してください。' + KS.EXTRA.chiikiHoukatsu);
        return out.join('\n');
      }
    };
  };

  // ---- 有料記事の共通 ----
  KS.ARTICLE_DIR = 'note公開記事/診断の森/v2_子育てに疲れた/';
  KS.STEP4 = '### STEP4　怖い思いをしているなら、安全を先にして、相談する';
  KS.FIVE = '### 困ったときに使う5フレーズ';

  // ---- 質問なしの結果（ks_none・ks_shinpai）で共有する安全の段落（骨子 1-1 の KS_SAFETY_BLOCK。2つの結果で同じものを使う＝家 C-02） ----
  KS.safetyBlock = function () {
    return [
      { kind: 'list', title: '家族から受けている言動が中心の場合', plainLead: true,
        lead: 'パートナーや、いっしょに暮らす大人から、怒鳴られる・物に当たられる・たたかれる・生活に必要なお金を渡されない・子育てのことで責められ続ける、などが疲れのもとになっている場合は、あなたの子育ての工夫だけの問題として扱わないでください。',
        items: KS.STEPS.slice(),
        after: '子どもからの暴力で怖い思いをしているときも、ひとりで抱えなくて構いません。' + CT.keisatsu9110 + '\n' + C.HISTORY,
        links: [LK.dvNavi, LK.dvPlus] },
      { kind: 'list', title: KS.KOWAI_TITLE, plainLead: true,
        lead: KS.KOWAI_LEAD,
        items: [KS.KOWAI_STOP, C.BABY_CALM, KS.KOWAI_TALK, CT.jisouSoudan, CT.oyakoLine, CT.kodomoSOS, KS.KOWAI_MED],
        after: KS.KOWAI_END,
        links: [LK.jisouSoudan, LK.oyakoLine] },
      { kind: 'list', title: '消えてしまいたいと思うほどつらいとき・心と体が限界に近いとき', plainLead: true,
        lead: '',
        items: [C.KIERU_ONE, KS.MIND_LINE],
        after: '',
        links: [LK.mamorouyoKokoro, LK.kodomoKatei] }
    ];
  };

  // ---- 診断ごとの検査（_komari_qc.js がテーマの qcBan・qcRules を全組み合わせに当てる） ----
  // 禁止表現（骨子 5章 KS-17・KS-18。地の文と記事本文に当てる。関連・環境の項目の文と『』の引用は除く）
  KS.QC_BAN = [
    [/母親なのに|父親なのに|親なのに|親なら|親なんだから|親として当然|母親失格|親失格|ダメな親|良い親(?!子)|愛情不足|愛情が足りない/, '親の採点・規範で縛る言い方'],
    [/甘え(です|だ|ている|させ|すぎ)|甘やかし|わがまま|しつけがなっていない|育て方が悪い/, '子どもや親を責める言い方'],
    [/発達|グレーゾーン|年齢相応|特性|障害(が|です|の可能性)|愛着|トラウマ|ADHD|ASD|LD|HSC|自閉|知的|療育/, '子どもの状態の判断・推測'],
    [/毒親|母性|三歳児神話|三つ子の魂|脳に|一生(?!懸命)|取り返しがつかない/, '根拠のない言い方'],
    [/虐待です|育児ノイローゼ|燃え尽き|わざとではありません|6秒/, '名指し・状態名・根拠のない数字'],
    [/(離婚|別居)(しましょう|すべき|した方が)/, '大きな決断のすすめ'],
    [/ワンオペ|イヤイヤ期|反抗期|魔の2歳/, '時期や状態の決めつけの言葉'],
    // 2026-10-11（ChatGPT最終確認の指摘3）：離れ方・安全確認を「歩ける子」で一括りにしない（小学校に入る前／小学生以上で分ける）
    [/歩ける子/, '年齢を「歩ける子」で一括りにする言い方'],
    [/通報され|しつけの範囲|よくあること|二度と(しない|手をあげない)|約束しましょう|子どもへの影響|かわいそう|大丈夫ですよ/, '責める・軽くする・脅す言い方'],
    [/ママ|パパ|(?<!工)(?<!丈)夫(?!婦)|妻|旦那|嫁|主婦|母親|父親/, '性別で役割を決める言い方'],
    [/安全・食べること・眠ること/, '今日やる必要の基準を「安全・食べること・眠ること」だけにしている（オーナー指示4）']
  ];
  KS.QC_BAN_OK = ['工夫', '大丈夫です', '夫婦', '一生懸命', '良い親子', '人に甘えて構いません', '障害物', 'イライラすること自体は、止めなくて大丈夫です', '丈夫'];
  KS.QC_BAN_NEGATIVE = 'それではダメな親です。';

  // 節の文（関連・環境の項目の文と、離れることを考えるときの相談の1文〈C.LEAVE＝相手から離れる話〉は除く）
  var dropCache = typeof WeakMap === 'function' ? new WeakMap() : null;
  function dropOf(T) {
    var d = dropCache && dropCache.get(T);
    if (d) return d;
    d = {};
    Object.keys(T.related || {}).forEach(function (k) { d[T.related[k]] = 1; });
    Object.keys(T.env.items || {}).forEach(function (k) { d[T.env.items[k].text] = 1; });
    if (dropCache) dropCache.set(T, d);
    return d;
  }
  function secText(s, T) {
    var drop = dropOf(T);
    var out = [];
    ['title', 'lead', 'phrase', 'note', 'body'].forEach(function (k) { if (s[k]) out.push(s[k]); });
    ['paras', 'points', 'items'].forEach(function (k) { (s[k] || []).forEach(function (x) { if (!drop[x]) out.push(x); }); });
    if (Array.isArray(s.after)) s.after.forEach(function (x) { out.push(x); }); else if (s.after) out.push(s.after);
    var t = out.join('\n').split(C.LEAVE).join('');
    // ほかの困りごとの呼び名（1問目の文。例「休む時間や自分の時間がない」）は、対処の文ではないので除く
    Object.keys(K.themes || {}).forEach(function (id) { if (/^ks_/.test(id)) t = t.split(K.themes[id].q1Text).join(''); });
    return t;
  }
  KS.secText = secText;
  var LEAVE_RE = /離れ(?!な)/;
  var ACT_RE = /離れ(?!な)|休む|休んで|しない家事|言わない|預け|任せ/;
  var OTHER_NOTE_RE = /頼める大人がいないとき|頼める人がいないとき|担当の1つを|確かめる先|手で変える|言い合いになりそうな|産後ケアでは|ファミリー・サポート・センターは/;
  function relOf(a, T) { return (a[T.relatedQ] || []).filter(function (k) { return T.related[k]; }); }
  function phraseSec(r) { return r.sections.filter(function (s) { return s.kind === 'phrase'; })[0] || {}; }
  function wrapNote(T, f) { var g = T.todayNote; T.todayNote = function (a, rt, ctx) { return f(g ? (g(a, rt, ctx) || '') : '', a, rt, ctx); }; }

  // opt.ageQ＝年齢の質問ID（ない＝自分を責めるテーマ）／opt.kowaiLead＝手が出そうなときの記事案内の字
  KS.qcRules = function (opt) {
    var rules = [];
    // KS-03（T-09 の子育て版）：「離れる・休む・しない家事・言わない・預ける・任せる」を出す節には「安全」がある
    rules.push({ name: 'KS-03 離れる・休む・預ける・任せるの節に安全',
      check: function (r, a, T) {
        var bad = r.sections.filter(function (s) { return s.kind !== 'text' && s.kind !== 'paid'; })
          .filter(function (s) { var t = secText(s, T); return ACT_RE.test(t) && t.indexOf('安全') < 0; });
        return bad.length ? '節「' + bad[0].title + '」に「' + (secText(bad[0], T).match(ACT_RE) || [''])[0] + '」があるのに「安全」がない' : '';
      },
      breakTheme: function (T) { T.specials.ks_kowai = Object.assign({}, T.specials.ks_kowai, { items: ['その場を少し離れて、落ち着いたら戻ります。強く揺さぶらないでください。'] }); } });
    // 「離れる」だけで終わらせない（全組み合わせ）：「離れ」を含む節には「戻」がある
    rules.push({ name: 'KS-01b 離れる節に戻る',
      check: function (r, a, T) {
        var bad = r.sections.filter(function (s) { return s.kind !== 'paid'; }).filter(function (s) { var t = secText(s, T); return LEAVE_RE.test(t) && t.indexOf('戻') < 0; });
        return bad.length ? '節「' + bad[0].title + '」に「離れ」があるのに「戻」がない' : '';
      },
      breakTheme: function (T) { T.specials.ks_kowai = Object.assign({}, T.specials.ks_kowai, { items: ['子どもの安全を確かめてから、その場を少し離れます。'] }); } });
    // 「今日やる必要があること」の基準（オーナー指示4）：休めないテーマの「減らす」ルートと絞れないに KOSODATE_MUST
    if (opt.mustRoutes) rules.push({ name: 'KS-23 今日やる必要の基準',
      check: function (r, a, T) {
        var j = r._judge, R = j.route.undetermined ? 'U' : j.route.primary[0];
        if (j.env.level === 2 || opt.mustRoutes.indexOf(R) < 0) return '';
        var ch = r.sections.filter(function (s) { return s.kind === 'change'; })[0];
        return (ch.body || '').indexOf(C.KOSODATE_MUST) < 0 ? 'ルート' + R + 'の最初に変えるポイントに、今日やる必要の基準（KOSODATE_MUST）がない' : '';
      },
      breakTheme: function (T) { opt.mustRoutes.forEach(function (k) { var R = k === 'U' ? T.undetermined : T.routes[k]; R.changeBody = R.changeBody.split(C.KOSODATE_MUST).join('子どもの安全'); }); } });
    if (opt.ageQ) {
      // KS-01：赤ちゃん（または何人かのうちに赤ちゃん）を選んだ結果は、どのルート・絞れない・害が強いときも、一歩の下に BABY_CALM
      rules.push({ name: 'KS-01 赤ちゃんの安全の文',
        check: function (r, a) { return KS.hasBaby(KS.age(a[opt.ageQ])) && (phraseSec(r).note || '').indexOf(C.BABY_CALM) < 0 ? '年齢「' + KS.age(a[opt.ageQ]) + '」なのに、一歩の下に赤ちゃんの安全の文（BABY_CALM）がない' : ''; },
        breakTheme: function (T) { T.env.keepTodayNote = false; } });
      // オーナー指示3：赤ちゃんの年齢の結果で「離れ」を含む節には、同じ節に「戻って」と「揺さぶ」がある
      rules.push({ name: 'KS-01c 赤ちゃんの離れる節に戻って・揺さぶ',
        check: function (r, a, T) {
          if (!KS.hasBaby(KS.age(a[opt.ageQ]))) return '';
          var bad = r.sections.filter(function (s) { return s.kind !== 'paid'; }).filter(function (s) { var t = secText(s, T); return LEAVE_RE.test(t) && (t.indexOf('戻って') < 0 || t.indexOf('揺さぶ') < 0); });
          return bad.length ? '節「' + bad[0].title + '」に「離れ」があるのに「戻って」「揺さぶ」がそろっていない' : '';
        },
        breakTheme: function (T) { wrapNote(T, function (n) { return n.split(C.BABY_CALM).join('赤ちゃんを安全な場所にあおむけに寝かせて、少しその場を離れます。'); }); } });
      // KS-15：害が強いときの注意書きは安全の文だけ（頼み方・渡し方・年齢別の預け先などを出さない）
      rules.push({ name: 'KS-15 害が強いときの注意書き',
        check: function (r) { var n = phraseSec(r).note || ''; return r._judge.env.level === 2 && OTHER_NOTE_RE.test(n) ? '害が強いのに、注意書きに安全の文以外「' + n.match(OTHER_NOTE_RE)[0] + '」が残っている' : ''; },
        // 2026-10-11（8問で年齢の質問を外した）：年齢別の注意書きが出なくなったテーマでも壊れ方を作れるよう、害が強いときにも安全以外の文を足す
        breakTheme: function (T) { var g = T.todayNote; T.todayNote = function (a, rt) { return [g(a, rt), '頼める人がいないときは、市区町村の一時預かりの案内を1つ開きます。'].filter(Boolean).join('\n'); }; } });
    }
    // KS-04 の陽性対照：害が強くても、相手（大人）に向けた対処でないルートの「最初に変えるポイント」は残す（子どもの安全のため）
    rules.push({ name: 'KS-04 子どもに向けた対処を残す',
      check: function (r, a, T) {
        var j = r._judge; if (j.env.level !== 2) return '';
        var keys = j.route.undetermined ? ['U'] : j.route.primary;
        if (keys.some(function (k) { return k !== 'U' && T.routes[k].toPartner; })) return '';
        var R = j.route.undetermined ? T.undetermined : T.routes[keys[0]];
        var ch = r.sections.filter(function (s) { return s.kind === 'change'; })[0];
        return (ch.body || '').indexOf(R.change) < 0 ? '害が強いとき、相手に向けた対処でないルートの対処「' + R.change.slice(0, 20) + '」が消えている' : '';
      },
      breakTheme: function (T) { T.env.noPartnerRoutes = false; T.env.changeBody = function () { return '工夫のことは、今は考えなくて大丈夫です。'; }; } });
    // KS-05：害が強く、仕組みの項目も選んだとき、仕組みの節の頭に structStrong
    rules.push({ name: 'KS-05 仕組みの節の頭',
      check: function (r, a, T) {
        var st = r.sections.filter(function (s) { return s.structure; })[0];
        return st && r._judge.env.level === 2 && st.after.indexOf(KS.STRUCT_STRONG) !== 0 ? '害が強いのに、仕組みの節が structStrong で始まっていない' : '';
      },
      breakTheme: function (T) { delete T.env.structStrong; } });
    // KS-10：手が出そうを選び、消えてしまいたいを選んでいないとき、記事の案内はテーマ別の字（害が強いときも）
    rules.push({ name: 'KS-10 手が出そうなときの記事案内',
      check: function (r, a, T) {
        var rel = relOf(a, T); if (rel.indexOf('ks_kowai') < 0 || rel.indexOf('ks_kieru') >= 0) return '';
        var p = r.sections.filter(function (s) { return s.kind === 'paid'; })[0];
        return !p || p.lead !== opt.kowaiLead ? '手が出そうを選んだのに、記事の案内が「' + opt.kowaiLead.slice(0, 20) + '…」でない' : '';
      },
      breakTheme: function (T) { T.specials.ks_kowai = Object.assign({}, T.specials.ks_kowai, { paid: undefined }); } });
    // KS-11：手が出そうなときの案内だけに当てる禁止表現
    rules.push({ name: 'KS-11 手が出そうな案内の禁止表現',
      check: function (r, a, T) {
        var s = r.sections.filter(function (x) { return x.special === 'ks_kowai'; })[0]; if (!s) return '';
        var t = secText(s, T); return KS.KOWAI_BAN.test(t) ? '手が出そうなときの案内に「' + t.match(KS.KOWAI_BAN)[0] + '」がある' : '';
      },
      breakTheme: function (T) { T.specials.ks_kowai = Object.assign({}, T.specials.ks_kowai, { items: T.specials.ks_kowai.items.concat(['通報されることはありません。']) }); } });
    // KS-14：relatedAfter の「2つ以上」は、専用の案内の2項目を数えない
    rules.push({ name: 'KS-14 関連の数え方',
      check: function (r, a, T) {
        var rel = relOf(a, T), n = KS.countRelated(rel);
        var sec = r.sections.filter(function (s) { return s.title === '関連して起きていること'; })[0];
        var has = !!sec && (sec.after || '').indexOf(T.relTwo) >= 0;
        return (n >= 2) !== has ? '関連の数（専用の2項目を除く）が' + n + 'なのに、「2つ以上」の文が' + (has ? 'ある' : 'ない') : '';
      },
      breakTheme: function (T) { var g = T.relatedAfter; T.relatedAfter = function (rel) { return g(rel).split(T.relTwo).join(''); }; } });
    // 189 は「こどもが虐待を受けているかもしれないと思ったとき」の文だけ（オーナー指示）
    rules.push({ name: 'KS-24 189 は虐待の文だけ',
      check: function (r, a, T) {
        var bad = r.sections.map(function (s) { return secText(s, T); }).join('\n').split(/\n|(?<=。)/).filter(function (x) { return /(?<![\d-])189(?![\d-])/.test(x) && x.indexOf('こどもが虐待を受けているかもしれないと思ったときは') < 0 && x.indexOf('児童相談所虐待対応ダイヤル') < 0; });
        return bad.length ? '189 が虐待の文の外にある：' + bad[0].slice(0, 40) : '';
      },
      breakTheme: function (T) { T.routes[Object.keys(T.routes)[0]].phraseAfter += '困ったときは、189 に電話できます。'; } });
    // 保健センターを「保健師に子育ての相談ができる」先として書かない（台帳 hokenCenter の deny）
    rules.push({ name: 'KS-25 保健センターと保健師',
      check: function (r, a, T) {
        var t = r.sections.map(function (s) { return secText(s, T); }).join('\n');
        var bad = t.split(/(?<=。)|\n/).filter(function (x) { return /保健センター/.test(x) && /保健師/.test(x); });
        return bad.length ? '保健センターと保健師を同じ文に書いている：' + bad[0].slice(0, 40) : '';
      },
      breakTheme: function (T) { T.routes[Object.keys(T.routes)[0]].phraseAfter += '保健センターの保健師に相談できます。'; } });
    return rules;
  };
})(typeof window !== 'undefined' ? window : globalThis);
