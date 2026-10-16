/* 【2026-10-04 実装】結婚を焦ってしまう気持ち診断（kekkon-aseri）の4テーマで共通の部品（1か所で持ち、4テーマの字をそろえる）
   設計＝_komari_design/4診断/20_骨子_kekkon-aseri.md（v2）の 2章・8章 ＋ 41_裁定_骨子v2の取りまとめ.md ＋ 42_オーナー指示の反映_実装前.md（5＝結婚の診断で害が強いとき）
   ★これはテーマではない（KOMARI.defineTheme を呼ばない）。KOMARI.KK に部品を置くだけ。
     テーマ（kk_hanashi.js・kk_konkatsu.js・kk_mawari.js・kk_hitori.js）より先に読む（ファイル名を「kk_00_」にして、読み込み順で先に来るようにしてある）。
     00_kyotsu.js（4診断の共通の文）より後に読む（KOMARI.common を使う）。
   ★窓口の名前・番号・「何をしてくれるか」・性質の語（無料・24時間 など）は、KOMARI.common.CONTACT の文だけ（台帳の publicLines と同じ字）。
     交際相手からの暴力＝dvNaviKousai・dvNavi・dvPlus（DV相談＋は「メール」と書かない・「パートナー」の字）／性的な被害＝oneStop／
     婚活の場の投資の勧誘＝shohishaToushi（婚活パーティー・結婚相談所を名指ししない）／付きまとい・脅し・お金＝keisatsu9110／家族からの言葉や暴力＝jinken110。
     台帳にない窓口（「性と健康の相談センター」に「結婚していなくても」を付ける 等）は書かない。
   ★オーナー指示5：婚活・親族・職場・交際相手のどこでも、脅し・暴力・性的な強要・強い束縛・付きまとい・はっきりした不利益の示唆など害が強い回答があるときは、
     婚活の進め方・返し方・話し合いより、安全の確保と相談を先にする。→ 害のある3テーマ（交際相手・婚活・周り）すべてに env.safetyFirst（noPartnerRoutes は使わない）。
     3テーマのルートには toPartner を付けない＝害が強い結果では、どのルートでも対処を出さず、固定文（SAFE_CHANGE）・背景の断り書き（SAFE_WHY）・相談先を控える一歩（SAFE_TODAY）にする。
     記事の案内は部品が控えめ（quiet）にする。steps の最後は KOMARI.common.LEAVE_KEKKON。記録の項目には「見られ」の字（検査 T-06）。
   ★守る線（骨子 0）：結婚することを正解にしない／いつまでに・この相手でいいか・別れるか・婚活をやめるか、を答えない／相手の気持ちを推測しない／
     年齢や妊娠出産の数字・医学的な見立てを書かない（検査・治療・処置の名前も書かない）／性別で決めつけない（「交際相手」「相手」の字）／タイプ・点数を出さない。
   ★結婚⇔恋愛の診断の案内（別の診断『恋愛で自信をなくした診断』）は、1つの結果に1か所だけ（qcRules の K10）。
   ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。 */
(function (root) {
  'use strict';
  var K = root.KOMARI = root.KOMARI || {};
  var C = K.common, CT = C.CONTACT;
  var KK = K.KK = {};

  // ---- 質問の選択肢（頻度。交際相手・婚活・ひとりの3テーマで同じ字。周りのテーマは「つらさの残り方」で聞く＝骨子 2.4） ----
  // 2026-10-11 オーナー指示：選択肢の数をそろえるため、頻度は4択（4＝ほぼ毎日。強さは「よくある」と同じ扱い＝komari_core.js）
  KK.FREQ_CHOICES = [
    { value: 4, text: 'ほぼ毎日' },
    { value: 3, text: 'よくある（週に何度か）' },
    { value: 2, text: 'ときどきある（月に何度か）' },
    { value: 1, text: 'たまにある程度' }
  ];

  // ---- 心身のサイン（裁定 0-5・骨子 2.2）。結婚では、こころの耳を使わない（退職の窓口のため） ----
  KK.MIND_TOPIC = '結婚のこと';
  KK.mind = function (state) { return C.mind(state, KK.MIND_TOPIC); };
  KK.MIND_LINE = KK.mind('眠れない・朝から気が重い・何をしても楽しめない');   // 質問なしの結果に置く1行（検査 T-12）

  // ---- 命の項目（4診断共通の定数のまま。導入の言葉は「結婚のこと」） ----
  KK.KIERU_TOPIC = '結婚のこと';

  // ---- 恋愛の診断への案内（1つの結果に1か所だけ＝裁定 0-9 共-04） ----
  KK.RENAI_NAME = '恋愛で自信をなくした診断';
  KK.RENAI = '別の診断『' + KK.RENAI_NAME + '』で扱っています。';

  // ---- 恋愛の診断と同じ字にそろえる項目（取りまとめ 41 の 1-2・1-3。検査 K25） ----
  KK.HITEI_TEXT = '見た目や人格を否定すること、ほかの人と比べて下げることを、くり返し言われる';
  KK.KARAKAI_TEXT = '周りの人から、恋人がいないことや、恋愛・結婚のことで、からかわれたり、言いふらされたりする';

  // 「関連が2つ以上」の数：専用の案内が出る項目は数えない（骨子 2.6・裁定 0-8）
  //   specials＝そのテーマの専用の案内の項目のキー（配列）か、テーマ（T.specials のキーを使う）
  KK.countRelated = function (rel, specials) {
    var keys = Array.isArray(specials) ? specials : Object.keys((specials && specials.specials) || {});
    return rel.filter(function (k) { return keys.indexOf(k) < 0; }).length;
  };

  // ---- 私生活の害が強いとき（env.safetyFirst）に3テーマで共通の欄 ----
  KK.safeEnv = function (own) {
    return Object.assign({
      safetyFirst: true,
      safeChange: C.SAFE_CHANGE,
      safeWhy: C.SAFE_WHY,
      today: C.SAFE_TODAY,
      todayAfter: C.SAFE_TODAY_AFTER + C.HISTORY,
      todaySummary: C.SAFE_TODAY_SUMMARY
    }, own);
  };

  // ---- 交際相手からの害の手順（安全→相談→記録→離れる前に相談。骨子 3.9・裁定 0-4・検査 T-04・T-06） ----
  KK.REC_PARTNER = '言われたこと・されたことは、相手に見られない形で残しておけます。見られるおそれがあるときは、無理に残さず、相談先で一緒に整理できます。';
  //   手順（steps）の字は「残す」で終える（検査 T-06 が「記録|残す|メモ」で記録の項目を見つけるため）
  KK.REC_PARTNER_STEP = '言われたこと・されたことは、相手に見られない形で残す。見られるおそれがあるときは、無理に残さず、相談先で一緒に整理できます。';
  KK.SEITEKI_PARTNER = '嫌だと言っても性的なことをされたときは、こちらの窓口も使えます。' + CT.oneStop;
  KK.PARTNER_STEPS = [
    '今まさに危ないときは、110番に連絡する。',
    '信頼できる人に話す。' + CT.dvNaviKousai + CT.dvNavi,
    CT.dvPlus,
    KK.SEITEKI_PARTNER,
    KK.REC_PARTNER_STEP,
    C.LEAVE_KEKKON
  ];

  // ---- 有料記事の共通 ----
  KK.ARTICLE_DIR = 'note公開記事/診断の森/v2_結婚を焦ってしまう/';
  KK.STEP4 = '### STEP4　怖い思いをしているなら、安全を先にして、相談する';
  KK.FIVE = '### 困ったときに使う5フレーズ';
  KK.FIVE_TEXT = '困ったときにスマホで開ける「保存用まとめ」と5つのフレーズ';
  KK.WEAK_HEAD = '今は大きな負担になっていないようなので、急いで読む必要はありません。';
  KK.TIE_NOTE = '（この説明と、下の「今日からできること」は、1つ目のポイントのものです。2つ目は、1つ目に慣れてからで十分です。）';

  // ---- 診断ごとの検査（_komari_qc.js がテーマの qcBan・qcRules を全組み合わせに当てる） ----
  // 禁止表現（骨子 8.1。地の文と記事本文に当てる。関連・環境の項目の文と『』の引用は除く）
  KK.QC_BAN = [
    // 2026-10-11（ChatGPT最終確認の指摘4）：関係の価値をこちらで決めない
    [/失ったものは大きくありません|(終わる|続かない|壊れる)(ような)?関係なら|その程度の(関係|相手)/, '関係の価値をこちらで決める言い方'],
    [/結婚すべき|結婚した方が|早く結婚|結婚しましょう|結婚しなくても大丈夫|結婚だけが幸せ|結婚にこだわらなくて|ひとりでも幸せ|あきらめ(ましょう|た方が|るべき)|別れ(るべき|た方が|ましょう)|離れた方がいい|待つべき|待った方が|婚活をやめ(るべき|た方が)|婚活すべき|期限を伝え(ましょう|るべき)|最後通告|話し合えば分かる/, '結婚・あきらめ・別れの勧め'],
    [/もう遅い|手遅れ|[0-9０-９]+歳まで|タイムリミット|妊娠できな|出産できな|卵子の老化|年齢的に(厳しい|難しい)|高齢出産|婚期|卵子凍結|凍結保存|妊活|不妊治療をすすめ|間に合わない/, '年齢・体の数字や見立て'],
    [/売れ残り|行き遅れ|高望み|妥協|理想が高|市場価値|選り好み|えり好み|賞味期限|結婚できない人|モテない/, '値踏みする言い方'],
    [/焦らなくて大丈夫|焦る必要はない|焦りすぎ|考えすぎ|大丈夫ですよ/, '焦りを打ち消す言い方'],
    [/結婚する気がない|本気ではない|本当は結婚したくない|お金が目的/, '相手や本人の気持ちの推測の断定'],
    [/彼氏|彼女|嫁|婿|女性は|男性は|女の幸せ|男なら|女なら/, '性別の決めつけ']
  ];
  KK.QC_BAN_OK = ['休むことは、あきらめることではありません', '待つこと自体は、相手のペースを大事にする選択です', 'C：『〇歳までに』という期限に追われている場合',
    '結婚するかどうかとは別に', 'ひとりで抱えなくて構いません', '婚活', '男性の相談にも対応しています', '18歳未満', '話し合いの工夫'];
  KK.QC_BAN_NEGATIVE = '早くしないとタイムリミットです。';

  // 節の文（関連・環境の項目の文を除く。『』の引用は残す）
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
    var drop = dropOf(T), out = [];
    ['title', 'lead', 'phrase', 'note', 'body'].forEach(function (k) { if (s[k]) out.push(s[k]); });
    ['paras', 'points', 'items'].forEach(function (k) { (s[k] || []).forEach(function (x) { if (!drop[x]) out.push(x); }); });
    if (Array.isArray(s.after)) s.after.forEach(function (x) { out.push(x); }); else if (s.after) out.push(s.after);
    return out.join('\n');
  }
  KK.secText = secText;
  KK.allText = function (r, T) {
    return r.sections.map(function (s) { return secText(s, T); }).concat(r.summary.map(function (x) { return x.text; }), [r.headline]).join('\n');
  };
  function relOf(a, T) { return (a[T.relatedQ] || []).filter(function (k) { return T.related[k]; }); }
  KK.relOf = relOf;
  function phraseSec(r) { return r.sections.filter(function (s) { return s.kind === 'phrase'; })[0] || {}; }
  KK.phraseSec = phraseSec;
  function changeSec(r) { return r.sections.filter(function (s) { return s.kind === 'change'; })[0] || {}; }
  KK.changeSec = changeSec;
  function allRoutes(T) { return Object.keys(T.routes).map(function (k) { return T.routes[k]; }).concat([T.undetermined]); }

  // 4テーマに共通の規則（テーマごとの規則は、各テーマのファイルで足す）。opt.harm＝害の項目があるテーマ（ひとりで焦るテーマは noHarm なので K19 を当てない）
  KK.qcRules = function (opt) {
    opt = opt || {};
    var rules = [];
    // K10：1つの結果に「恋愛で自信をなくした診断」は1か所まで（裁定 0-9 共-04）
    rules.push({ name: 'K10 恋愛の診断の案内は1か所',
      check: function (r, a, T) {
        var n = KK.allText(r, T).split(KK.RENAI_NAME).length - 1;
        return n > 1 ? '1つの結果に「' + KK.RENAI_NAME + '」が' + n + 'か所ある' : '';
      },
      breakTheme: function (T) { allRoutes(T).forEach(function (R) { R.phraseAfter += KK.RENAI + KK.RENAI; }); } });
    // K15：relatedAfter の「2つ以上」の文は、専用の案内の項目を数に入れない（裁定 0-8）
    rules.push({ name: 'K15 関連の数え方',
      check: function (r, a, T) {
        var rel = relOf(a, T), n = KK.countRelated(rel, T);
        var sec = r.sections.filter(function (s) { return s.title === '関連して起きていること'; })[0];
        var has = !!sec && (sec.after || '').indexOf(T.relTwo) >= 0;
        return (n >= 2) !== has ? '関連の数（専用の案内の項目を除く）が' + n + 'なのに、「2つ以上」の文が' + (has ? 'ある' : 'ない') : '';
      },
      breakTheme: function (T) { var g = T.relatedAfter; T.relatedAfter = function (rel) { return [T.relTwo, g(rel).split(T.relTwo).join('')].join('\n'); }; } });
    // K19：害が強い結果に、別れ・離れる・結婚の勧めを出さない（恋結 K-07）。関連・環境の項目の文（本人が選んだ字）は除く
    if (opt.harm) rules.push({ name: 'K19 害が強い結果に別れや結婚の勧めがない',
      check: function (r, a, T) {
        if (r._judge.env.level !== 2) return '';
        var t = KK.allText(r, T).split(C.LEAVE_KEKKON).join('').replace(/『[^』]*』/g, '『』');
        var m = t.match(/離れた方|別れ|結婚しましょう/);
        return m ? '害が強い結果に「' + m[0] + '」がある' : '';
      },
      breakTheme: function (T) { T.env.steps = T.env.steps.concat(['別れた方がいいかもしれません。']); } });
    // K21：全ルートと絞れないに todaySummary（UX X-08）。結果のまとめの「今日やること」が、ルートの字か、害が強いときの共通の字
    rules.push({ name: 'K21 まとめの今日やること',
      check: function (r, a, T) {
        var j = r._judge, R = j.route.undetermined ? T.undetermined : T.routes[j.route.primary[0]];
        var want = j.env.level === 2 ? T.env.todaySummary : R.todaySummary;
        var got = (r.summary.filter(function (x) { return x.label === '今日やること'; })[0] || {}).text;
        return !want || got !== want ? 'まとめの「今日やること」が todaySummary の字でない（' + got + '）' : '';
      },
      breakTheme: function (T) { delete T.undetermined.todaySummary; Object.keys(T.routes).forEach(function (k) { delete T.routes[k].todaySummary; }); } });
    return rules;
  };

  // 私生活の害が強いとき（safetyFirst の3テーマ）：どのルートでも対処を出さない・一歩は相談先を控える形（オーナー指示5）
  KK.safeRule = function (words) {
    return { name: 'K12 害が強いときは対処を出さず安全と相談を先に',
      check: function (r, a, T) {
        var j = r._judge; if (j.env.level !== 2) return '';
        if (!j.safeMode) return '害が強いのに safeMode になっていない（どのルートでも、安全と相談を先にする＝オーナー指示5）';
        var t = KK.allText(r, T);
        var bad = (words || []).filter(function (w) { return t.indexOf(w) >= 0; });
        Object.keys(T.routes).forEach(function (k) { [T.routes[k].change, T.routes[k].phrase].forEach(function (x) { if (t.indexOf(x) >= 0) bad.push(x.slice(0, 20)); }); });
        [T.undetermined.change, T.undetermined.phrase].forEach(function (x) { if (t.indexOf(x) >= 0) bad.push(x.slice(0, 20)); });
        if (phraseSec(r).phrase !== C.SAFE_TODAY) bad.push('今日の一歩が相談先を控える形でない');
        if (changeSec(r).body.indexOf(C.SAFE_CHANGE) !== 0) bad.push('最初に変えるポイントの説明が固定文でない');
        return bad.length ? '害が強いのに、対処が残っている：' + bad[0] : '';
      },
      breakTheme: function (T) { T.env.noPartnerRoutes = true; T.env.changeBody = function (rc) { return rc; }; } };
  };
})(typeof window !== 'undefined' ? window : globalThis);
