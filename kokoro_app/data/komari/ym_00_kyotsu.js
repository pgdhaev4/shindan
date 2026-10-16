/* 【2026-10-04 実装】会社を辞めるか迷っている診断（yameru）の3テーマで共通の部品（1か所で持ち、3テーマの字をそろえる）
   設計＝_komari_design/4診断/20_骨子_yameru.md（v2）の 1章・2章・7章 ＋ 41_裁定_骨子v2の取りまとめ.md ＋ 42_オーナー指示の反映_実装前.md。
   ★これはテーマではない（KOMARI.defineTheme を呼ばない）。KOMARI.YM に部品を置くだけ。
     テーマ（ym_riyuu.js・ym_mitooshi.js・ym_mayoi.js）より先に読む（ファイル名を「ym_00_」にして、読み込み順で先に来るようにしてある）。
     00_kyotsu.js（4診断の共通の文）より後に読む（KOMARI.common を使う）。
   ★守る線（骨子 0.1）：辞める／続けるのどちらも勧めない。「辞める場合」が出る段落には「続ける場合（または残る）」、
     「続ける場合」が出る段落には「辞める場合（または離れる場合）」を並べる（qcRules の Y-Q2。両方向）。
     今日の一歩に方向のある行動（応募・登録・辞意を伝える・「続ける」と決める）を入れない（Y-Q4）。許可の形の勧め（辞めてもいい・続けても大丈夫）も書かない（qcBan）。
     「逃げ」「甘え」は、本人の考えの引用（「」）としてだけ。害を迷い方の問題にしない（そのときは「辞めるか続けるかに関係なく、記録と相談」）。
   ★職場の害は教師（職場の人付き合いの7テーマ）と同じ進め方：記録→直属の上司（相手が上司なら、その上の上司・人事・社内の相談窓口）→総合労働相談コーナー（CONTACT の字）。
     私生活の害ではないので env.safetyFirst は使わない（ルートの対処＝社内で確かめる・書き出す、は害を与える相手に向けたものではない）。keepTodayNote も使わない（骨子 2.2.3）。
   ★窓口の名前・「何をしてくれるか」・性質の語は KOMARI.common.CONTACT の字だけ（こころの耳・総合労働相談コーナー・労働基準監督署・まもろうよ こころ）。
     ハローワークは無料の結果には出さない（骨子 4.7。記事2だけ。書くときは CONTACT.hellowork の字だけ＝qcRules）。
   ★専用の案内（体や気持ちが限界・消えてしまいたい）を選んだ人には、一歩の下の注意書きを「命 → 限界」だけにし、補助の質問の注意書きは出さない
     （子育ての試作で決まった扱い。部品はテーマの注意書きを専用の案内の文より前に置くので、命を先頭にするにはテーマの側で出し分ける。骨子 2.2.3 からの変更）。
   ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。 */
(function (root) {
  'use strict';
  var K = root.KOMARI = root.KOMARI || {};
  var C = K.common, CT = C.CONTACT, LK = C.LINK;
  var YM = K.YM = {};

  // ---- 頻度（3テーマで同じ選択肢。質問の文と freqSentence はテーマごと＝骨子 2.4） ----
  // 2026-10-11 オーナー指示：選択肢の数をそろえるため、頻度は4択（4＝ほぼ毎日。強さは「よくある」と同じ扱い＝komari_core.js）
  YM.FREQ_CHOICES = [
    { value: 4, text: 'ほぼ毎日' },
    { value: 3, text: 'よくある（週に何度か）' },
    { value: 2, text: 'ときどきある（月に何度か）' },
    { value: 1, text: 'たまにある程度' }
  ];
  YM.TIE_NOTE = '（この説明と、下の「今日からできること」は、1つ目のポイントのものです。2つ目は、1つ目を確かめてからで十分です。）';
  YM.PHRASE_LEAD = '今日は、次のことだけ試してください。';

  // ---- 心身のサイン（骨子 2.1・裁定 0-5）：共通の文（C.mind）に、職場の相談先（産業医・保健師、こころの耳）を前に置いた形 ----
  YM.MIND_TOPIC = '辞めるかどうかの迷い';
  YM.SANGYOUI = '職場に産業医や保健師がいれば、そこで相談できます。';
  //   inList＝一覧の項目（li）に置くとき。li では改行が出ないので、改行を入れない（段落の中では、読みやすさのため相談先の前で改行する）
  YM.mind = function (state, inList) {
    var br = inList ? '' : '\n';
    return C.mind(state, YM.MIND_TOPIC).replace(C.MIND_TAIL, br + YM.SANGYOUI + CT.kokoroNoMimi + br + C.MIND_TAIL);
  };
  YM.MIND_LINE = YM.mind('眠れない・朝から気が重い', true);   // 質問なしの結果に置く1行（検査 T-12。一覧の項目・導入の文に置く）

  // ---- 命の項目（4診断共通の定数のまま。導入の言葉は「辞めるかどうかを考えること」） ----
  YM.KIERU_TOPIC = '辞めるかどうかを考えること';
  YM.KIERU = function () { return C.kieru(YM.KIERU_TOPIC); };

  // ---- 体や気持ちが限界に近いとき（骨子 2.2.2。関連の ym_genkai を選んだ人に、ルートや環境に関係なく出す） ----
  YM.GENKAI_TITLE = '体や気持ちが限界に近いと感じているとき';
  YM.GENKAI_LEAD = '辞めるか続けるかを決めるのは、大きな決断です。体や気持ちがすり減っているときは、決めることより先に、休むための相談をしてください。休むことは、辞めることでも、続けることを決めることでもありません。';
  YM.GENKAI_ITEMS = [
    YM.SANGYOUI + 'いない職場では、かかりつけの医師に相談できます。' + CT.kokoroNoMimi,
    // 心 Y-03・安 Y-05 の一言（相手が上司のときの言い先も、同じ一言で）
    '上司や人事に話すときは、「体調のことで、ご相談したいことがあります。」の一言で始められます。直属の上司に言いにくいとき（つらさの相手が上司のとき）は、その上の人・人事・産業医や保健師に、同じ一言で十分です。',
    '休むための制度（有給休暇・休職など）があるかは、就業規則や人事で確かめられます。',
    // 骨子 1.2 の6と同じ理由（環境 ym_nagai に「休みを取らせてもらえない」を入れたため、休む相談が職場の中で進まない人の道を置く）
    '休みを申し出ても取らせてもらえないときは、あったことを記録して、社外の相談先に相談できます。' + CT.sougouRoudou
  ];
  //   消えてしまいたいと思うほどつらいとき（裁定 0-1）：命の1行（共通の定数）と119番。命の項目も選んでいるときは、上の命の案内を指す1行にする（裁定 0-2）
  YM.KIERU_119 = '今まさに命が危ないときは、119番に連絡してください。';
  YM.GENKAI_KIERU_AGAIN = '消えてしまいたいと思うほどつらいときは、上の『' + C.KIERU_TITLE + '』と同じ相談先が使えます。';
  YM.GENKAI_AFTER = '決めるのは、休んで、考えられる状態に戻ってからで十分です。';
  YM.GENKAI_SUMMARY = '体と気持ちの状態を3行メモして、休むための相談に使う';
  // 安 Y-04 の字（一歩の下の注意書き）
  YM.GENKAI_NOTE = '体や気持ちがもたないと感じているときは、この一歩より、上の『休むための相談』を先にしてください。この一歩は、休めてからで十分です。';
  YM.genkai = function () {
    return {
      top: 3, paid: 'hide', summaryFirst: YM.GENKAI_SUMMARY,
      title: YM.GENKAI_TITLE,
      lead: YM.GENKAI_LEAD,
      items: YM.GENKAI_ITEMS.concat([C.KIERU_ONE, YM.KIERU_119]),
      itemsAgain: YM.GENKAI_ITEMS.concat([YM.GENKAI_KIERU_AGAIN]),
      after: YM.GENKAI_AFTER,
      todayNote: YM.GENKAI_NOTE,
      links: [LK.kokoroNoMimi, LK.sougouRoudou, LK.mamorouyoKokoro]
    };
  };

  // ---- 関連の共通項目（骨子 2.1。テーマ固有の項目のあとに、この順で置く。命の項目は必ず最後） ----
  YM.RELATED_COMMON = {
    ym_nemuri: '寝つきが悪い・朝から気が重い日が増えた',
    ym_genkai: '体調を崩している、または、このままでは体や気持ちがもたないと感じる',
    ym_kieru:  C.KIERU_ITEM
  };
  YM.SPECIAL_KEYS = ['ym_genkai', 'ym_kieru'];
  YM.related = function (own) { return Object.assign({}, own, YM.RELATED_COMMON); };
  YM.relatedChoices = function (own) {
    var r = YM.related(own);
    return Object.keys(r).map(function (k) { return { value: k, text: r[k] }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };
  // 「2つ以上」の数：専用の案内が出る項目（限界・消えてしまいたい）は数えない（骨子 2.5・裁定 0-8）
  YM.countRelated = function (rel) { return rel.filter(function (k) { return YM.SPECIAL_KEYS.indexOf(k) < 0; }).length; };
  YM.mindAfter = function (rel) { return rel.indexOf('ym_nemuri') >= 0 ? [YM.mind('寝つきが悪い・朝から気が重い')] : []; };
  YM.specials = function () { return { ym_genkai: YM.genkai(), ym_kieru: YM.KIERU() }; };
  YM.hasSpecial = function (a, relQ) { return (a[relQ] || []).some(function (k) { return YM.SPECIAL_KEYS.indexOf(k) >= 0; }); };
  // テーマの「一歩の下の注意書き」：専用の案内を選んだ人には出さない（上の注記のとおり）。aux＝補助の質問の答えで出す文を返す関数
  YM.todayNote = function (relQ, aux) {
    return function (a, rt) { return YM.hasSpecial(a, relQ) ? '' : (aux(a, rt) || ''); };
  };

  // ---- 環境（骨子 2.3。3テーマで同じ項目・同じ字） ----
  YM.ENV_ITEMS = {
    // 人から受ける害（記録して相談）
    ym_kyuuyo:    { text: '残業代や給料がきちんと払われていない・働いた時間を実際より短くつけるよう言われる', heavy: true },
    ym_nagai:     { text: '休みの日もほとんど休めないほど長く働く状態が続いている・休みを申し出ても取らせてもらえない', heavy: true },
    ym_gendou:    { text: '上司や同僚から、怒鳴られる・人格を否定される・無視される・性的な言動・妊娠や出産・育児・介護を理由にした嫌がらせや不利な扱いなどを受けている', heavy: true },
    ym_hikitome:  { text: '辞めたいと伝えたら、強く責められた・損害を払わせると言われた・辞めることを認めないと言われた', heavy: true },
    ym_susume:    { text: '会社や上司から、辞めるようにすすめられる・仕事を外されるなど、辞める方へ向けた扱いを受けている', heavy: true },
    ym_chigau:    { text: '入社のときの書面（労働条件の通知・契約書）に書かれた給料・働く時間・休み・場所と、実際が違う' },
    // 仕組み（仕事の場に載せる）
    ym_hitode:    { text: '人が足りず、一人あたりの仕事が多いまま変わらない', kind: 'structure' },
    ym_hyouka:    { text: '何をすれば評価されるのか、基準が示されていない', kind: 'structure' },
    // 事情（補足だけ）
    ym_keiyaku:   { text: '派遣・契約社員など、期間の決まった契約で働いている', kind: 'context' },
    ym_ryouritsu: { text: '家庭の事情（育児・介護・通院など）と仕事の両立が、今の課題になっている', kind: 'context' }
  };
  YM.HEAVY_KEYS = Object.keys(YM.ENV_ITEMS).filter(function (k) { return YM.ENV_ITEMS[k].heavy; });
  YM.ENV_Q_TEXT = 'あなたの職場で、当てはまるものをすべて選んでください。';
  YM.envChoices = function () {
    return Object.keys(YM.ENV_ITEMS).map(function (k) { return { value: k, text: YM.ENV_ITEMS[k].text }; }).concat([{ value: 'none', text: 'どれも当てはまらない', only: true }]);
  };

  // 記録の段（職 Y-14 の字。持ち出し禁止の1文）・辞めるようにすすめられているときの1文（職 Y-01 の字）
  YM.RECORD = 'あった日時・言われたこと・されたこと・勤務の始まりと終わりの時刻を、自分の手帳やスマホのメモに、自分の言葉で書いて残す。会社の書類やデータを持ち出したり、私用のアドレスに送ったりはしないでください。給与明細など、自分に渡されたものは、とっておけます。';
  YM.SUSUME = '辞めるようにすすめられているときは、辞めるかどうかを自分から伝える前に、記録を残して、相談先に相談してください。辞めるかどうかを決めるのは、そのあとでも間に合います。';
  YM.BOSS = '直属の上司に相談する。相手が上司なら、その上の上司や人事、社内の相談窓口に相談する。派遣で働いている場合は、派遣元の担当者にも相談できる。';
  YM.OUTSIDE = '社内で相談しにくいとき・相談しても変わらないときは、社外の相談先を使える。' + CT.sougouRoudou;
  // 害が強いときの手順（職 Y-11：困りごとの種類ごとの短い箇条。記録→直属の上司〈相手が上司ならその上・人事・社内の窓口〉→総合労働相談コーナー）
  YM.STEPS = [
    YM.RECORD,
    '給料や残業代のことは、給与明細を手元に置いて、人事・総務の給与の担当に「計算を確かめたい」として聞く。',
    '長い労働時間や、休みを取らせてもらえないことは、記録した時刻を見せて、直属の上司に相談する（上司に言っても変わらないときは、その上の上司や人事に）。',
    '上司や同僚からの言動・「辞めることを認めない」という対応・辞めるようにすすめられることは、' + YM.BOSS,
    YM.SUSUME,
    YM.OUTSIDE,
    CT.roudouKijun
  ];
  YM.STRUCT_STRONG = '上の記録と相談を先にしてください。上で挙げた言動をしている相手が上司本人のときは、次の相談は無理にしなくて大丈夫です。';

  // opt.alertExtra＝警告の導入に足すテーマの1文（辞めたあとの不安のテーマだけ）
  YM.env = function (opt) {
    opt = opt || {};
    return {
      items: Object.assign({}, YM.ENV_ITEMS),
      // 害が1つだけ（heavy でないのは「書面と実際が違う」だけ）のときの注記（骨子 2.3.1。v2 で追加した字）
      noteOne: function (t) {
        return 'なお、職場の状況として「' + t.replace(/「/g, '『').replace(/」/g, '』') + '」も選ばれています。書面と実際の違いは、あなたの確かめ方ではなく、職場の側で正されることです。入社のときの書面は、手元に残しておいてください。違う点を書き出して、人事・総務の担当に確かめることもできます。' + CT.roudouKijun;
      },
      alertTitle: 'あなたの我慢や工夫だけでは解決しない可能性があります',
      alertLead: '回答では、職場の状況として次のことが選ばれています。こうした状況は、あなたの考え方や確かめ方で変えられるものではありません。辞めるか続けるかに関係なく、記録と相談は、あなたを守るために使えます。辞めるかどうかを決めるのは、記録と相談を始めたあとでも、同時でもよいのです。' + (opt.alertExtra ? '\n' + opt.alertExtra : ''),
      steps: YM.STEPS.slice(),
      links: [LK.sougouRoudou],
      summary: '職場の状況による負担が大きい可能性',
      change: '「辞めるか続けるかを決める」より先に、「状況を記録して、ひとりで抱えない」',
      // ルートの「最初に変えるポイント」は「　」を含むので、（　）でくくって続ける（教師と同じ形）
      changeBody: function (rc) { return 'そのうえで、あなたの回答に合う確かめ方もあります（' + rc + '）。ただし、職場の側の問題は、あなたの我慢や確かめ方で何とかしようとしなくてよいのです。'; },
      today: 'あった日時・内容・勤務の始まりと終わりの時刻を、自分の手帳やスマホのメモに短く残す。給与明細は捨てずにとっておく。',
      todayAfter: '記録は、辞める場合にも、続ける場合にも、あなたを守る材料になります。会社の書類やデータを持ち出したり、私用のアドレスに送ったりはしないでください。',
      todaySummary: 'あったことと勤務の時刻を、自分のメモに残す',
      structTitle: '職場の仕組みの側にある問題',
      structLead: '回答では、次のことも選ばれています。こうした状況は、会社が決めることの側の問題です。あなたの頑張り方の問題ではありません。',
      structStrong: YM.STRUCT_STRONG,
      structAfter: function (keys) {
        var out = [];
        if (keys.indexOf('ym_hitode') >= 0) out.push('人が足りないことは、会社が決めること（人を増やす・仕事を減らす・優先順位を決める）です。あなたが残ることで埋めるものでも、あなたが辞めることで生まれる責任でもありません。伝え方の例：「今の人数で、この量を続けるのは難しい状況です。優先順位か、人の配置を相談させてください。」');
        if (keys.indexOf('ym_hyouka') >= 0) out.push('評価の基準は、たずねてよいものです。伝え方の例：「次の評価で、どこまでできていれば評価が上がるのか、基準を教えていただけますか。」');
        return out.join('\n');
      },
      // 事情（kind:'context'）を選んだときに「今の状態」に足す文（骨子 2.3.4。職 Y-05・Y-10 の字）
      contextNote: function (keys) {
        var out = [];
        if (keys.indexOf('ym_keiyaku') >= 0) out.push('期間の決まった契約で働いている、とも答えています。派遣の場合、働き方や担当の相談の窓口は、派遣元の担当者です。契約で働いている場合は、「契約の途中で辞める」と「次の更新をしない」で、確かめることが変わります。契約書の期間と、更新の確かめ方を先に見ておくと、続ける場合にも、離れる場合にも使えます。');
        // ★骨子の末尾の文「上の『職場の側の問題』の項目にあたります」は、この文が「今の状態」（いちばん上）に出るので、行き先を書いた形に直した
        if (keys.indexOf('ym_ryouritsu') >= 0) out.push('家庭の事情との両立が課題になっている、とも答えています。両立のための制度があるかは、就業規則や人事で確かめられます。制度があるかどうかは、辞めるか続けるかを考える材料の1つになります。\n両立しようとしたことで、嫌がらせや不利な扱いを受けている場合は、両立の工夫の問題ではなく、職場が対応する問題です。あった日時と内容を記録して、直属の上司（相手が上司なら、その上の上司や人事）や、社内の相談窓口に相談できます。');
        return out.join('\n');
      }
    };
  };

  // ---- 有料記事の共通 ----
  YM.ARTICLE_DIR = 'note公開記事/診断の森/v2_会社を辞めるか迷っている/';
  YM.FIVE = '### 困ったときに使う5フレーズ';
  // 害が強いときの記事の案内（職場の害なので教師の形。私生活の ENV_LEAD は使わない＝骨子 2.3.2）
  YM.ENV_LEAD = 'あなたの場合は、記事の中でも**第4章「うまくいかなかったときの次の進め方」**のSTEP4（記録と相談の進め方）が特に参考になります。ただ、職場の側の問題が強いときは、記事の対処だけで何とかしようとせず、上の相談先も使ってください。';

  // ---- 質問なしの結果（ym_genkai・ym_none）で使う、職場の害の段落（骨子 1.2 の6・1.3 の3。害を受けている人のただ1つの出口になりうる） ----
  YM.HARM_TITLE = '職場の側に問題があるとき';
  YM.OUTSIDE_NOTE = '社内で相談しにくいとき・相談しても変わらないときは、社外の相談先を使えます。';
  YM.harmSection = function (lead, after) {
    return { kind: 'list', title: YM.HARM_TITLE, plainLead: true, lead: lead,
      items: [YM.RECORD, '上司や同僚からの言動・休めない働き方・給料のこと・辞めるようにすすめられることは、' + YM.BOSS, YM.SUSUME],
      after: after, links: [LK.sougouRoudou] };
  };

  // ---- 診断ごとの検査（_komari_qc.js がテーマの qcBan・qcRules を全組み合わせに当てる） ----
  // 禁止表現（骨子 7章 Y-Q1。地の文と記事本文に当てる。関連・環境の項目の文と『』の引用は除く）
  YM.QC_BAN = [
    [/辞めるべき|辞めた方が|辞めましょう|続けるべき|続けた方が|残るべき|残った方が|今すぐ辞め|転職すべき|転職した方が|転職しましょう|我慢すべき/, '辞める・続けるのどちらかを勧める言い方'],
    [/逃げてもいい|逃げていい|逃げるが勝ち|辞めてもいい|辞めていい|辞めても(大丈夫|構いません)|続けても(大丈夫|構いません)|休めば続けられ/, '許可の形の勧め（両側の形「辞めることも、続けることも、選んで構いません」だけ許す）'],
    [/逃げ(です|だ|ではない|じゃない)|甘え(です|だ|ではない|じゃない)|我慢が足りない|石の上にも|心が弱い|決められない人|優柔不断|考えすぎ/, '本人を責める・打ち消す言い方'],
    [/[0-9０-９〇]+年は続け|もう遅い|手遅れ|[0-9０-９]+歳まで|歳を過ぎ|辞めどき/, '年齢・年数で可否を言う言い方'],
    [/向いていない|天職|市場価値|ブラック企業|完璧主義|自己肯定感|燃え尽き|認知のゆがみ/, '根拠のないラベル・状態名'],
    [/退職代行/, '退職代行の紹介'],
    [/辞める方に傾い|続ける方に傾い/, 'どちらに傾いているかの読み上げ'],
    [/大丈夫ですよ|もったいない/, '軽くする・方向を示す言い方']
  ];
  YM.QC_BAN_OK = ['辞めることも、続けることも、選んで構いません', '応募するかどうかは決めずに', '一生懸命', '向いている仕事', '休むことは、辞めることでも、続けることを決めることでもありません', '続けながら変える'];
  YM.QC_BAN_NEGATIVE = 'ここで辞めてもいいのです。';

  // 対の検査（骨子 Y-Q2・横断 T-08）：段落ごとに見る。『』「」で引用した本人の言葉・会社の対応の名前は除く
  YM.DO_RE = /辞め(る|た)(場合|側|こと|とき)/;
  YM.KEEP_RE = /続け(る|た)(場合|側|こと|とき)/;
  YM.LEAVE_RE = /離れ(る|た)(場合|側|こと|とき)/;
  var dropCache = typeof WeakMap === 'function' ? new WeakMap() : null;
  function dropOf(T) {
    var d = dropCache && dropCache.get(T);
    if (d) return d;
    d = {};
    Object.keys(T.related || {}).forEach(function (k) { d[T.related[k]] = 1; });
    Object.keys((T.env || {}).items || {}).forEach(function (k) { d[T.env.items[k].text] = 1; });
    if (dropCache) dropCache.set(T, d);
    return d;
  }
  function unquote(s) { return s.replace(/『[^』]*』/g, '『』').replace(/「[^」]*」/g, '「」'); }
  // 節の段落（関連・環境の項目の文を除き、改行で分け、引用を外したもの）
  function paragraphs(s, T) {
    var drop = T ? dropOf(T) : {}, out = [];
    ['lead', 'phrase', 'note', 'body'].forEach(function (k) { if (s[k]) out.push(s[k]); });
    ['paras', 'points', 'items'].forEach(function (k) { (s[k] || []).forEach(function (x) { if (!drop[x]) out.push(x); }); });
    if (Array.isArray(s.after)) s.after.forEach(function (x) { out.push(x); }); else if (s.after) out.push(s.after);
    var ps = [];
    out.forEach(function (x) { String(x).split('\n').forEach(function (p) { if (p.trim()) ps.push(unquote(p)); }); });
    return ps;
  }
  YM.paragraphs = paragraphs;
  // 1つの結果（節の並び）の対の誤りを返す（質問なしの結果にも使う）
  YM.pairErrors = function (sections, T) {
    var bad = [];
    sections.forEach(function (s) {
      paragraphs(s, T).forEach(function (p) {
        if (YM.DO_RE.test(p) && !YM.KEEP_RE.test(p) && p.indexOf('残る') < 0) bad.push(['辞め→続け', s.title, p]);
        if (YM.KEEP_RE.test(p) && !YM.DO_RE.test(p) && !YM.LEAVE_RE.test(p)) bad.push(['続け→辞め', s.title, p]);
      });
    });
    return bad;
  };
  YM.TODAY_BAN = /退職を伝え|退職届|辞めると伝え|辞めたいと伝え|退職の意思|退職を申し出|応募(する|して)(?!かどうか)|登録する|登録して|続けると約束|続けると決め|もう少し頑張|残ると伝え/;
  YM.NUM_BAN = /[0-9０-９]+(時間|か月以上|日以上)/;
  function phraseSec(r) { return r.sections.filter(function (s) { return s.kind === 'phrase'; })[0] || {}; }
  function relOf(a, T) { return (a[T.relatedQ] || []).filter(function (k) { return T.related[k]; }); }
  function bodyAll(r, T) { return r.sections.map(function (s) { return paragraphs(s, T).join('\n'); }).join('\n'); }

  // opt.relTwo＝テーマの「2つ以上」の文
  YM.qcRules = function (opt) {
    var rules = [];
    var first = function (T) { return Object.keys(T.routes)[0]; };
    // Y-Q2：辞める／続けるの対（両方向）
    rules.push({ name: 'Y-Q2 辞める場合の段落に続ける場合',
      check: function (r, a, T) { var b = YM.pairErrors(r.sections, T).filter(function (x) { return x[0] === '辞め→続け'; }); return b.length ? '節「' + b[0][1] + '」の段落「' + b[0][2].slice(0, 30) + '…」に「辞める場合」があるのに「続ける場合／残る」がない' : ''; },
      breakTheme: function (T) { var k = first(T); T.routes[k].phraseAfter += '\n辞める場合の準備を考えます。'; T.undetermined.phraseAfter += '\n辞める場合の準備を考えます。'; } });
    rules.push({ name: 'Y-Q2b 続ける場合の段落に辞める場合',
      check: function (r, a, T) { var b = YM.pairErrors(r.sections, T).filter(function (x) { return x[0] === '続け→辞め'; }); return b.length ? '節「' + b[0][1] + '」の段落「' + b[0][2].slice(0, 30) + '…」に「続ける場合」があるのに「辞める場合／離れる場合」がない' : ''; },
      breakTheme: function (T) { var k = first(T); T.routes[k].phraseAfter += '\n続ける場合の準備を考えます。'; T.undetermined.phraseAfter += '\n続ける場合の準備を考えます。'; } });
    // Y-Q3：一歩の両側（「続けるため」だけ・「辞めるため／離れるため」だけの一歩にしない）
    rules.push({ name: 'Y-Q3 一歩の両側',
      check: function (r) {
        var p = phraseSec(r).phrase || '';
        if (/続けるため/.test(p) && !/離れる|辞める/.test(p)) return '一歩「' + p.slice(0, 30) + '」に「続けるため」だけがある';
        if (/(辞める|離れる)ため/.test(p) && !/続ける/.test(p)) return '一歩「' + p.slice(0, 30) + '」に「辞める／離れるため」だけがある';
        return '';
      },
      breakTheme: function (T) { var k = first(T); T.routes[k].phrase = 'この状況が変わらないとしたら、続けるために最低限必要なことを1つ書く。'; T.undetermined.phrase = T.routes[k].phrase; } });
    // Y-Q4：今日の一歩に方向のある行動を入れない（一歩・まとめの今日やること・害が強いときの一歩）
    rules.push({ name: 'Y-Q4 今日の一歩に方向のある行動',
      check: function (r) {
        var t = [phraseSec(r).phrase || ''].concat(r.summary.filter(function (x) { return x.label === '今日やること'; }).map(function (x) { return x.text; })).join('\n');
        var m = t.match(YM.TODAY_BAN); return m ? '今日の一歩に「' + m[0] + '」がある' : '';
      },
      breakTheme: function (T) { T.env.today = '求人サイトに登録して、条件を見る。'; var k = first(T); T.routes[k].todaySummary = '求人サイトに登録して、条件を見る'; T.undetermined.todaySummary = T.routes[k].todaySummary; } });
    // Y-Q5：労働時間・期間の数字の基準を出さない
    rules.push({ name: 'Y-Q5 数字の基準',
      check: function (r, a, T) { var m = bodyAll(r, T).match(YM.NUM_BAN); return m ? '数字の基準「' + m[0] + '」がある' : ''; },
      breakTheme: function (T) { var k = first(T); T.routes[k].phraseAfter += '月に80時間を超えたら、相談します。'; T.undetermined.phraseAfter += '月に80時間を超えたら、相談します。'; } });
    // Y-Q6：辞める方へ向けた扱い・辞めさせない対応など、重い害は1つで「強い」（警告の節が出る）
    rules.push({ name: 'Y-Q6 重い害は1つで強い',
      check: function (r, a, T) {
        var hit = (a[T.envQ] || []).filter(function (k) { return YM.HEAVY_KEYS.indexOf(k) >= 0; });
        return hit.length && r._judge.env.level !== 2 ? '「' + hit[0] + '」を選んだのに、環境が強い結果になっていない' : '';
      },
      breakTheme: function (T) { T.env.items.ym_susume = Object.assign({}, T.env.items.ym_susume, { heavy: false }); } });
    // Y-Q7：専用の案内の並び（命→限界）・限界の導入の「あわせて、」・まとめの先頭・記事の節を隠す
    rules.push({ name: 'Y-Q7 専用の案内の並び',
      check: function (r, a, T) {
        var rel = relOf(a, T), hg = rel.indexOf('ym_genkai') >= 0, hk = rel.indexOf('ym_kieru') >= 0;
        if (!hg && !hk) return '';
        var whyI = r.sections.findIndex(function (s) { return s.title === T.whyTitle || s.title === T.whyTitleWeak; });
        var gi = r.sections.findIndex(function (s) { return s.special === 'ym_genkai'; }), ki = r.sections.findIndex(function (s) { return s.special === 'ym_kieru'; });
        if (hk && ki !== 1) return '命の案内が「今の状態」の直後にない';
        if (hg && (gi < 1 || gi > whyI)) return '限界の案内が、背景より前にない';
        if (hg && hk && (gi !== ki + 1 || r.sections[gi].lead.indexOf('あわせて、') !== 0)) return '2つとも選んだのに、限界の案内が命の直後・「あわせて、」で始まっていない';
        if (hg && hk && r.sections[gi].items.indexOf(YM.GENKAI_KIERU_AGAIN) < 0) return '2つとも選んだのに、限界の案内の命の項目が「上と同じ相談先」の1行になっていない';
        if (hg && !hk && r.sections[gi].items.indexOf(C.KIERU_ONE) < 0) return '限界の案内に、命の1行（共通の定数）がない';
        var sf = r.summary[0] || {};
        if (sf.label !== '先に読んでほしいこと' || sf.text !== (hk ? C.kieru('').summaryFirst : YM.GENKAI_SUMMARY)) return 'まとめの先頭の「先に読んでほしいこと」が違う';
        if (r.sections.some(function (s) { return s.kind === 'paid'; }) || !r.sections.some(function (s) { return s.paidHidden; })) return '記事の購入の案内が出ている／「記事について」の節がない';
        return '';
      },
      breakTheme: function (T) { T.specials.ym_genkai = Object.assign({}, T.specials.ym_genkai, { top: undefined }); } });
    // Y-Q8：限界を選んだ（害が強くない）とき、一歩の下に安 Y-04 の注意書き。命も選んだときは、命の注意書きが先頭。選んでいないときは出さない
    rules.push({ name: 'Y-Q8 限界の注意書き',
      check: function (r, a, T) {
        var rel = relOf(a, T), n = phraseSec(r).note || '', hg = rel.indexOf('ym_genkai') >= 0, hk = rel.indexOf('ym_kieru') >= 0;
        var kn = C.kieru('').todayNote;
        if (hg && n.indexOf(YM.GENKAI_NOTE) < 0) return '限界を選んだのに、一歩の下に注意書き（安 Y-04 の字）がない';
        if (!hg && n.indexOf(YM.GENKAI_NOTE) >= 0) return '限界を選んでいないのに、限界の注意書きがある';
        if (hk && n.indexOf(kn) !== 0) return '命を選んだのに、命の注意書きが先頭にない';
        if ((hg || hk) && n !== [hk ? kn : '', hg ? YM.GENKAI_NOTE : ''].filter(Boolean).join('\n')) return '専用の案内を選んだのに、注意書きが「命→限界」だけになっていない';
        return '';
      },
      breakTheme: function (T) { T.specials.ym_genkai = Object.assign({}, T.specials.ym_genkai, { todayNote: YM.GENKAI_NOTE.replace('先に', 'さきに') }); } });
    // Y-Q10：relatedAfter の「2つ以上」は、専用の案内の2項目を数えない
    rules.push({ name: 'Y-Q10 関連の数え方',
      check: function (r, a, T) {
        var rel = relOf(a, T), n = YM.countRelated(rel);
        var sec = r.sections.filter(function (s) { return s.title === '関連して起きていること'; })[0];
        var has = !!sec && (sec.after || '').indexOf(opt.relTwo) >= 0;
        return (n >= 2) !== has ? '関連の数（専用の2項目を除く）が' + n + 'なのに、「2つ以上」の文が' + (has ? 'ある' : 'ない') : '';
      },
      breakTheme: function (T) { var g = T.relatedAfter; T.relatedAfter = function (rel) { return g(rel).split(opt.relTwo).join(''); }; } });
    // Y-Q12：背景の質問の N は「この場面はあまりない」を含み、「想像がつかない」「まだ実感がない」を含まない
    rules.push({ name: 'Y-Q12 背景の質問のどれでもない',
      check: function (r, a, T) {
        var bad = T.routeQuestions.map(function (id) { var q = T.questions.filter(function (x) { return x.id === id; })[0]; return q && q.choices.filter(function (c) { return c.value === 'N'; })[0]; })
          .filter(function (c) { return !c || c.text.indexOf('あまりない') < 0 || /想像がつかない|まだ実感がない/.test(c.text); });
        return bad.length ? '背景の質問の「どれでもない」の字が決まりと違う：' + (bad[0] ? bad[0].text : '（ない）') : '';
      },
      breakTheme: function (T) { var id = T.routeQuestions[T.routeQuestions.length - 1]; var q = T.questions.filter(function (x) { return x.id === id; })[0]; q.choices.filter(function (c) { return c.value === 'N'; })[0].text = '特に引っかからない（または、想像がつかない）'; } });
    // 職場の害の手順（教師どおり：記録→直属の上司〈相手が上司ならその上・人事・社内の窓口〉→総合労働相談コーナー。記録に持ち出し禁止の1文）
    rules.push({ name: 'YM-01 職場の害の手順',
      check: function (r) {
        var al = r.sections.filter(function (s) { return s.kind === 'alert'; })[0]; if (!al) return '';
        var st = al.after || [], iR = st.findIndex(function (x) { return /記録|残す/.test(x); });
        var iB = st.findIndex(function (x) { return x.indexOf('直属の上司') >= 0; }), iO = st.findIndex(function (x) { return x.indexOf(CT.sougouRoudou) >= 0; });
        if (iR !== 0 || st[0].indexOf('持ち出') < 0) return '記録の段が先頭にない／持ち出し禁止の1文がない';
        if (iB < 0 || !st.some(function (x) { return x.indexOf('相手が上司なら') >= 0 && x.indexOf('社内の相談窓口') >= 0; })) return '直属の上司（相手が上司なら、その上・人事・社内の窓口）の段がない';
        if (iO < 0 || iO < iB) return '総合労働相談コーナー（CONTACT の字）が、社内の相談のあとにない';
        if (st.indexOf(YM.SUSUME) < 0) return '辞めるようにすすめられているときの1文（職 Y-01）がない';
        return '';
      },
      breakTheme: function (T) { T.env.steps = T.env.steps.filter(function (x) { return x.indexOf(CT.sougouRoudou) < 0; }); } });
    // 職場の害なので safetyFirst・keepTodayNote は使わない（教師と同じ扱い）
    rules.push({ name: 'YM-02 職場の害は safetyFirst にしない',
      check: function (r, a, T) { return (T.env.safetyFirst || T.env.keepTodayNote || r._judge.safeMode) ? 'env.safetyFirst／keepTodayNote が付いている（職場の害は教師と同じ進め方）' : ''; },
      breakTheme: function (T) { T.env.safetyFirst = true; } });
    // 心身のサイン：こころの耳を前に置いてから共通の字
    rules.push({ name: 'YM-03 心身のサインにこころの耳',
      check: function (r, a, T) {
        if (relOf(a, T).indexOf('ym_nemuri') < 0) return '';
        var sec = r.sections.filter(function (s) { return s.title === '関連して起きていること'; })[0], t = (sec && sec.after) || '';
        var i = t.indexOf(CT.kokoroNoMimi), j = t.indexOf(C.MIND_TAIL);
        return i < 0 || j < 0 || i > j ? '眠れないを選んだのに、こころの耳→共通の相談先の順の文がない' : '';
      },
      breakTheme: function (T) { var g = T.relatedAfter; T.relatedAfter = function (rel) { return g(rel).split(CT.kokoroNoMimi).join(''); }; } });
    // ハローワークは CONTACT の字だけ（無料の結果には出さない設計。出すときもこの字）
    rules.push({ name: 'YM-04 ハローワークは CONTACT の字',
      check: function (r, a, T) {
        var bad = bodyAll(r, T).split(CT.hellowork).join('').split(/\n|(?<=。)/).filter(function (x) { return x.indexOf('ハローワーク') >= 0; });
        return bad.length ? 'ハローワークを CONTACT の字以外で書いている：' + bad[0].slice(0, 30) : '';
      },
      breakTheme: function (T) { var k = first(T); T.routes[k].phraseAfter += 'ハローワークでも相談できます。'; T.undetermined.phraseAfter += 'ハローワークでも相談できます。'; } });
    return rules;
  };
})(typeof window !== 'undefined' ? window : globalThis);
