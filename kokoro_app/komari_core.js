/**
 * komari_core.js — 困りごと型診断の「判定と結果の組み立て」（2026-09-25 第2版）
 *
 * 画面を持たない純粋な部品。ブラウザでも node（QC・テスト）でも同じコードが動く。
 *   KOMARI.defineTheme(theme)   … 困りごと1つ（例：頼まれると断れない）を登録する。data/komari/<id>.js が呼ぶ
 *   KOMARI.defineDiagnosis(d)   … 1問目と、困りごとの並びから診断を組み立てて window.KOMARI_DATA にする
 *   KOMARI.buildResult(theme,a) … 回答から結果（冒頭のまとめ＋節の並び）を作る。全テーマ共通
 * ★テーマ固有の文面・設問は theme 側だけに書く。ここにはテーマ名も文面も書かない。
 * ★横展開＝data/komari/<新テーマ>.js を1本足し、診断ファイルの problems に1行足すだけ。QC(_komari_qc.js)は自動で拾う。
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
(function (root) {
  'use strict';
  var K = root.KOMARI = root.KOMARI || {};
  K.themes = K.themes || {};
  K.diagnoses = K.diagnoses || {};

  // 2026-10-11（オーナー指示「選択肢の数をそろえる」）：4診断は頻度を4段階に。4＝ほぼ毎日（強さは3と同じ扱い）。既存7テーマは1〜3のまま
  var FREQ = { 4: 'ほぼ毎日', 3: 'よくある', 2: 'ときどきある', 1: 'たまにある' };
  K.FREQ = FREQ;

  // ---------------- 判定の部品 ----------------

  // 背景ルート：場面を変えた複数の質問で、どのルートの答えが何問あったかを数える
  //   中心＝2問以上で最多（同数は全部中心。並びは質問順で先に出た方が先頭＝具体策はこの先頭）
  //   重なり＝中心ではないが1問以上選ばれたルート
  //   どのルートも2問に届かない＝絞れない（theme.undetermined.subOf でどう絞れないかを決める）
  K.judgeRoutes = function (T, a) {
    var keys = Object.keys(T.routes);
    var c = { N: 0 };
    keys.forEach(function (k) { c[k] = 0; });
    T.routeQuestions.forEach(function (q) { if (c[a[q]] !== undefined) c[a[q]]++; });
    var max = Math.max.apply(null, keys.map(function (k) { return c[k]; }));
    // ★2026-10-12（オーナー指示「場面の質問を3問に」）：theme.pickTop のテーマは、どのルートも2問に届かなくても、
    //   1問でも選ばれたルートがあれば「絞れない」にしない（いちばん先の場面の質問で選ばれたルートを中心にする）。全部「どれでもない」のときだけ絞れない
    // ★2026-10-13（ChatGPT公開前照査の指摘1・オーナー裁定「C＝折衷案」）：2つ以上のルートが1問ずつ（ばらばら）のときは、
    //   「最初の質問のルートを中心」にするのをやめ、既存の「絞れない（scattered）」にする。表れたルートは spread に並べ、結果で名前を示す。
    //   選ばれたルートが1つだけ（残りは「どれでもない」）のときは、これまでどおりそのルートを中心にする
    if (max === 1 && T.pickTop) {
      var spread = [];
      T.routeQuestions.forEach(function (q) { var v = a[q]; if (keys.indexOf(v) >= 0 && spread.indexOf(v) < 0) spread.push(v); });
      if (spread.length >= 2) return { primary: [], secondary: [], counts: c, undetermined: true, sub: T.undetermined.subOf(a, c), spread: spread };
      return { primary: [spread[0]], secondary: [], counts: c, undetermined: false };
    }
    if (max <= 1) {
      return { primary: [], secondary: [], counts: c, undetermined: true, sub: T.undetermined.subOf(a, c) };
    }
    var order = [];
    T.routeQuestions.forEach(function (q) {
      var v = a[q];
      if (c[v] === max && keys.indexOf(v) >= 0 && order.indexOf(v) < 0) order.push(v);
    });
    var secondary = keys.filter(function (k) { return c[k] >= 1 && c[k] < max; });
    return { primary: order, secondary: secondary, counts: c, undetermined: false };
  };

  // 強さ：頻度（3/2/1）と、関連して起きていることの数
  K.judgeStrength = function (freq, relatedCount) {
    var s = freq || 1;
    if (s >= 3 || (s === 2 && relatedCount >= 2)) return 3;
    if (s === 1 && relatedCount <= 1) return 1;
    return 2;
  };

  // 環境：2種類に分ける（★PHASE 2 の変更案）
  //   害（kind なし）＝人から受ける害。heavy が1つ、または2つ以上で「強い」。1つだけなら注記。→ 記録して相談窓口へ
  //   仕組み（kind:'structure'）＝職場の仕組み・役割の問題。「強い」の数には入れない。→ 別の節で、仕事の場に載せる進め方を出す
  //   ※ kind のない既存テーマ（断れない・機嫌）は、これまでと同じ結果になる
  K.judgeEnv = function (picked, items) {
    var p = (picked || []).filter(function (k) { return items[k]; });
    //   事情（kind:'context'）＝害でも仕組みでもない、気になりやすさに関わる事情（例：判断される時期にある）。「今の状態」に補足の1文を出すだけ
    var harm = p.filter(function (k) { return !items[k].kind; });
    var structure = p.filter(function (k) { return items[k].kind === 'structure'; });
    var context = p.filter(function (k) { return items[k].kind === 'context'; });
    var heavy = harm.some(function (k) { return items[k].heavy; });
    return { picked: harm, structure: structure, context: context, level: (heavy || harm.length >= 2) ? 2 : (harm.length === 1 ? 1 : 0) };
  };

  // ---------------- 結果の組み立て（全テーマ共通） ----------------
  K.buildResult = function (T, a) {
    var P = T.paid, E = T.env;
    var related = (a[T.relatedQ] || []).filter(function (k) { return T.related[k]; });
    var freq = a[T.freqQ] || 1;
    var s = K.judgeStrength(freq, related.length);
    var rt = K.judgeRoutes(T, a);
    var env = K.judgeEnv(a[T.envQ], E.items);
    var U = T.undetermined;
    var R = rt.undetermined ? U : T.routes[rt.primary[0]];
    var allWeak = s === 1 && rt.undetermined && related.length === 0 && env.level === 0 && env.structure.length === 0;
    var envStrong = env.level === 2;
    var nQ = T.routeQuestions.length;
    var label = function (k) { return T.routes[k].label; };
    var short = function (k) { return T.routes[k].short; };

    // ★safetyFirst のテーマ（私生活の害）は、計測に送るキーに「害が強いか」（-env）を入れない（2026-10-04・裁定 0-6 の提案を Claude が判断）
    var key = T.id + '-' + (rt.undetermined ? 'U' : rt.primary.join('')) + '-s' + s + ((envStrong && !E.safetyFirst) ? '-env' : '');

    // ★2026-10-04（4診断）：私生活の害を扱うテーマの「安全を先に」（theme.env.safetyFirst があるテーマだけ。既存7テーマには無い）
    //   safeMode＝害が強く、ルートの対処（相手に向けた工夫）を出さない状態。ルートに toPartner があるテーマは、主ルートが toPartner のときだけ
    //   ★2026-10-04（子育ての試作）：env.noPartnerRoutes＝ルートの対処が、どれも相手（大人）に向けたものではないテーマ（例：子どもに強く言ってしまう）。
    //     safeMode にしない＝害が強くても、子どもに向けた対処（離れる・1つだけ言う など）と背景の説明を残す（裁定 40 の toPartner の行「子どもに向けた対処は子どもの安全のために残す」）
    var partnerRoutes = Object.keys(T.routes).filter(function (k) { return T.routes[k].toPartner; });
    var safeMode = envStrong && !!E.safetyFirst && !E.noPartnerRoutes &&
      (!partnerRoutes.length || (!rt.undetermined && rt.primary.some(function (k) { return T.routes[k].toPartner; })));
    // 専用の案内（関連で選んだ項目）。top のあるもの＝「今の状態」の直後に数の小さい順／ないもの＝関連の節のあと（今まで通り）
    var spec = [];
    if (T.specials) related.forEach(function (k) {
      var S = T.specials[k];
      if (typeof S === 'function') S = S(a, { strength: s, route: rt, envStrong: envStrong });
      if (S) spec.push({ key: k, S: S });
    });
    var topSpec = spec.filter(function (x) { return x.S.top; }).sort(function (x, y) { return x.S.top - y.S.top; });
    var restSpec = spec.filter(function (x) { return !x.S.top; });
    var byTop = topSpec.concat(restSpec);
    var specSection = function (x, i) {
      var S = x.S, again = i > 0 && x.S.top;
      return { kind: 'list', title: S.title, lead: (again && S.lead ? 'あわせて、' : '') + (S.lead || ''),
        items: (again && S.itemsAgain) ? S.itemsAgain : (S.items || []), after: S.after || '', special: x.key, plainLead: true, links: S.links };
    };

    // ① 今の状態
    // ★PHASE 2 の変更案：stateExtra に「環境が強いか・全部弱いか」を渡す（既存2テーマは2つ目の値を使わない）
    // 2026-10-24 オーナー指示：「〇〇と答えています」の文は出さない（freqSentence は残すが使わない。下の dropEcho が stateExtra の言い返しも外す）
    // ★2026-10-24 利用者目線の照査 #4：見出しは「今の状態と対策の方向性」なのに、どんな状態かが書かれていなかった
    //   → 1段落目に「今の状態」の一文（headlines＝10/13 に画面の一番上から外した見出しの文）を太字で置く
    var stateLine = allWeak ? T.headlines.weak : T.headlines[s];
    var state = [stateLine ? '**' + stateLine + '。**' : '', T.stateExtra ? T.stateExtra(a, { envStrong: envStrong, allWeak: allWeak }) : ''];
    state.push(R.ack + ((allWeak || envStrong) ? '' : T.ackFollow));
    // 事情（kind:'context'）を選んだときの補足（theme.env.contextNote があるときだけ。既存2テーマには無い）
    if (env.context.length && E.contextNote) { var cn = E.contextNote(env.context); if (cn) state.push(cn); }

    // ② 背景
    var why = [];
    // ★2026-10-24 オーナー指示「②に、見透かされたと思うような言い当て（コールドリーディング）の文を必ず入れる（全診断）」
    //   データ＝ルートごとの cold（routes[k].cold）・ルートが絞れないとき＝undetermined.texts[sub].cold か undetermined.cold。
    //   相手からの害が強い結果（envStrong）には出さない（相手の言動の問題を、本人の内面の話にしないため）。
    //   ★当初は safeMode のときだけ外していたが、職場・退職・子育ては害が強くても safeMode にならない作りのため、
    //     威圧や帰らせてもらえない場面でも本人の内面の言い当てが出ていた（2026-10-24 心理・倫理の照査 #7）→ envStrong で外す
    var noCold = safeMode || envStrong;
    var coldOf = function (k) { return (!noCold && T.routes[k] && T.routes[k].cold) || ''; };
    if (rt.undetermined) {
      why.push(U.texts[rt.sub].why);
      if (!noCold && (U.texts[rt.sub].cold || U.cold)) why.push(U.texts[rt.sub].cold || U.cold);
      if (rt.spread) why.push('表れていたのは、' + rt.spread.map(short).join('と、') + 'です（どれも1問ずつ）。');
      if (!safeMode) why.push(U.tail);
      // 2026-10-24 オーナー指示：「判定の根拠：〜」の文は出さない（全診断）
    } else if (rt.primary.length >= 2) {
      why.push('今回の回答では、' + rt.primary.map(short).join('と、') + 'が、同じくらい表れています。');
      if (coldOf(rt.primary[0])) why.push(coldOf(rt.primary[0]));
      if (!safeMode) rt.primary.forEach(function (k) { why.push(T.routes[k].why); });
      if (rt.secondary.length) why.push('あわせて、' + rt.secondary.map(short).join('や、') + 'も一部重なっています。');
    } else {
      why.push(R.bg);
      if (coldOf(rt.primary[0])) why.push(coldOf(rt.primary[0]));
      if (!safeMode) why.push(R.why);
      if (rt.secondary.length) why.push('あわせて、' + rt.secondary.map(short).join('や、') + 'も一部重なっています。');
    }
    if (env.level === 1) why.push(E.noteOne(E.items[env.picked[0]].text));
    // safeMode：背景の説明の前に断り書き（相手のふるまいは、本人の言い方で決まるものではない）
    if (safeMode && E.safeWhy) why.unshift(E.safeWhy);

    var sections = [
      { kind: 'text', title: '今の状態', paras: state }
    ];
    // ★top のある専用の案内は、背景の分析より先に出す（命・身の安全・心身の限界など）
    topSpec.forEach(function (x) { sections.push(specSection(x, byTop.indexOf(x))); });
    // ★2026-10-11（ChatGPT最終確認の指摘5）：私生活の害が強いとき（theme.env.safetyFirst のテーマだけ。既存7テーマには無い）は、
    //   安全→相談→記録の節を、背景の分析より先に出す
    var alertSection = envStrong ? {
      kind: 'alert', title: E.alertTitle, paras: [E.alertLead],
      items: env.picked.map(function (k) { return E.items[k].text; }),
      afterHead: 'ひとりで抱えないためにできること', after: E.steps, links: E.links
    } : null;
    var alertFirst = envStrong && !!E.safetyFirst;
    if (alertFirst) sections.push(alertSection);
    sections = sections.concat([
      // ★PHASE 2 の変更案：全部弱いときだけ、見出しを替えられる（whyTitleWeak が無いテーマは今のまま）
      { kind: 'text', title: (allWeak && T.whyTitleWeak) ? T.whyTitleWeak : T.whyTitle, paras: why, cls: 'k-why' }
    ]);

    // ③ 関連して起きていること（選んだものだけ）
    if (related.length) {
      sections.push({
        kind: 'list', title: '関連して起きていること',
        lead: '',          // 2026-10-24 オーナー指示：「回答で選んだものだけを載せています。」は出さない
        items: related.map(function (k) { return T.related[k]; }),
        after: T.relatedAfter(related)
      });
    }

    // ③' 専用の案内（★PHASE 2 の変更案）：関連で特定の項目を選んだ人に、ルートや環境に関係なく必ず出す
    //   theme.specials = { 関連のキー: { title, lead, items:[...], after } }
    // plainLead＝導入文を、注記用の小さい字ではなく、ふつうの字で出す印
    restSpec.forEach(function (x) { sections.push(specSection(x, byTop.indexOf(x))); });

    // 環境側の問題が強いとき
    if (envStrong && !alertFirst) sections.push(alertSection);

    // 仕組みの問題（★PHASE 2 の変更案）：選んだ項目と、仕事の場に載せる進め方を出す。「最初に変えるポイント」は置き換えない
    if (env.structure.length) {
      sections.push({
        kind: 'list', title: E.structTitle, lead: E.structLead,
        items: env.structure.map(function (k) { return E.items[k].text; }),
        // 害が強い人には、仕組みの節の頭に1文足す（警告の直後に「上司に相談」と出るため。theme.env.structStrong があるときだけ）
        after: ((envStrong && E.structStrong) ? E.structStrong + '\n' : '') +
               (typeof E.structAfter === 'function' ? E.structAfter(env.structure, envStrong && !!E.safetyFirst) : (E.structAfter || '')),
        structure: true, plainLead: true
      });
    }

    // ④ 最初に変えるポイント
    // 専用の案内の safety（相手が怒る・責めるなら、この一言や一歩は使わなくてよい、の注意書き）と todayNote
    var safetyNotes = byTop.map(function (x) { return x.S.safety; }).filter(Boolean);
    var specTodayNotes = byTop.map(function (x) { return x.S.todayNote; }).filter(Boolean);
    if (envStrong) {
      sections.push({ kind: 'change', title: '最初に変えるポイント', points: [E.change], body: safeMode ? E.safeChange : E.changeBody(R.change) });
    } else if (!rt.undetermined && rt.primary.length >= 2) {
      sections.push({ kind: 'change', title: '最初に変えるポイント',
        // 同点のとき、説明と一歩は1つ目のルートのもの。それを知らせる1文（theme.tieNote があるときだけ。既存2テーマには無い）
        points: rt.primary.map(function (k) { return T.routes[k].change; }), body: R.changeBody + (T.tieNote ? '\n' + T.tieNote : '') });
    } else {
      sections.push({ kind: 'change', title: '最初に変えるポイント', points: [R.change], body: R.changeBody });
    }

    if (safetyNotes.length) { var chg = sections[sections.length - 1]; chg.body = (chg.body ? chg.body + '\n' : '') + safetyNotes.join('\n'); }

    // ⑤ 今日からできること（1つ）
    var joinNote = function (base) { return [base || ''].concat(specTodayNotes, safetyNotes).filter(Boolean).join('\n'); };
    if (envStrong) {
      // keepTodayNote＝害が強いときも、一歩の下の注意書き（例：赤ちゃんの安全）を消さない（子育てのテーマだけ）
      sections.push({ kind: 'phrase', title: '今日からできること（1つだけ）', lead: '今日から、次のことだけ始めてください。',
        phrase: E.today, after: E.todayAfter,
        note: joinNote((E.keepTodayNote && T.todayNote) ? T.todayNote(a, rt, { envStrong: true }) : '') });
      if (!sections[sections.length - 1].note) delete sections[sections.length - 1].note;
    } else {
      sections.push({ kind: 'phrase', title: '今日からできること（1つだけ）', lead: R.phraseLead || T.phraseLead,
        phrase: R.phrase, after: R.phraseAfter, note: joinNote(T.todayNote ? T.todayNote(a, rt) : '') });   // ★PHASE 2 の変更案：ルートの判定結果も渡す
    }

    // ⑥ 有料記事で得られるもの
    var lead = envStrong ? P.envLead
      : allWeak ? P.weakLead
      : rt.undetermined ? P.undetLead
      // 2026-10-24 利用者目線の照査 #14：ルート名の頭の記号（「B：」など）は読む人に意味が無いので外して出す
      : 'あなたの場合は、記事の中でも' + rt.primary.map(function (k) { return '**「' + String(label(k)).replace(/^[A-ZＡ-Ｚ][：:]\s*/, '') + '」**'; }).join('と') +
        'の対処が特に参考になります。記事では、各章のこの見出しの部分を読めば足ります。';
    // ★PHASE 2 の変更案：補助の質問の答えで、記事の読む場所を1文足せる（環境が強い・全部弱いときは足さない）
    if (P.leadNote && !envStrong && !allWeak) { var ln = P.leadNote(a, rt); if (ln) lead += ln; }
    // ★専用の案内の paid：'hide'＝記事の案内を短い節だけにする（命・心身の限界）／{ lead }＝案内の文だけ差し替える（身の安全など）
    var hide = byTop.some(function (x) { return x.S.paid === 'hide'; });
    var leadSpec = byTop.filter(function (x) { return x.S.paid && x.S.paid.lead; })[0];
    if (leadSpec) lead = leadSpec.S.paid.lead;
    if (hide) {
      sections.push({ kind: 'text', title: '記事について', paras: [P.hideText || '今は、記事より先に、上の相談を使ってください。記事は、落ち着いて考えられるときに、いつでも読めます。'], paidHidden: true });
    } else sections.push({
      // 私生活の害が強いとき（quiet）は、見出しも購入をすすめない形にする（2026-10-11 指摘5）
      kind: 'paid', title: (envStrong && !!E.safetyFirst) ? '記事について' : 'もっと具体的に準備したいときは',
      articleTitle: P.title, price: P.price, lead: lead,
      items: P.items.map(function (x) { return x.text; }),
      noteUrl: P.noteUrl, previewUrl: P.previewUrl,
      note: 'ここまでの無料の結果だけでも、今日の一歩はそのまま使えます。記事は、場面ごとにもっと準備しておきたいときのためのものです。',
      // quiet＝私生活の害が強いとき（safetyFirst のテーマ）。記事の購入を前面に出さない（得られることの一覧を出さない・見出しを控えめに）
      quiet: (envStrong && !!E.safetyFirst) || undefined
    });

    return K.finishResult({
      key: key,
      theme: T.id,
      kicker: '回答から見えた、今の状態',
      headline: allWeak ? T.headlines.weak : T.headlines[s],
      summary: (function (rows) {
        // summaryFirst：まとめの先頭に「先に読んでほしいこと」を1行（top の小さい専用の案内のもの）
        var sf = byTop.filter(function (x) { return x.S.summaryFirst; })[0];
        return sf ? [{ label: '先に読んでほしいこと', text: sf.S.summaryFirst }].concat(rows) : rows;
      })([
        { label: '困りごと', text: allWeak ? T.problemWeak : T.problem },
        { label: '背景', text: envStrong ? E.summary : rt.undetermined ? U.texts[rt.sub].summary : rt.primary.map(short).join('／') },
        { label: '今日やること', text: envStrong ? E.todaySummary : (R.todaySummary || ('「' + R.phrase + '」と返す')) }
      ]),
      sections: sections,
      _judge: { strength: s, route: rt, env: env, allWeak: allWeak, safeMode: safeMode, specials: byTop.map(function (x) { return x.key; }) }   // 検査用（画面には出さない）
    });
  };

  // ★2026-10-24 オーナー指示（全診断の結果に共通の仕上げ。buildResult と、質問なしの結果・簡易結果の出口 decide の両方で通す）
  //   ①「〇〇と答えています」「〜とも答えています」の言い返しの文は、どの節にも出さない。
  //     データ側の文（freqSentence・stateExtra・contextNote・専用の案内の lead・背景の「一方で、〜とも答えています」）は消さずに、ここで文ごと外す
  //   ② 最初の節の見出し「今の状態」→「今の状態と対策の方向性」
  K.STATE_TITLE = '今の状態と対策の方向性';
  K.dropEcho = function (t) {
    if (typeof t !== 'string') return t;
    // 文の区切り＝「。」まで（後読みの正規表現は古い iPhone の Safari で読み込みごと止まるので使わない）
    return t.split('\n').map(function (line) {
      return (line.match(/[^。]*。|[^。]+$/g) || []).filter(function (s) { return s.indexOf('答えています') < 0; }).join('');
    }).filter(function (line, i, arr) { return line !== '' || arr.length === 1; }).join('\n');
  };
  K.finishResult = function (r) {
    if (!r || !r.sections || r._finished) return r;
    r.sections.forEach(function (sec) {
      if (sec.title === '今の状態') sec.title = K.STATE_TITLE;
      ['lead', 'after', 'body', 'note'].forEach(function (k) { if (typeof sec[k] === 'string') sec[k] = K.dropEcho(sec[k]); });
      if (sec.paras) sec.paras = sec.paras.map(K.dropEcho).filter(function (p) { return p !== ''; });
    });
    Object.defineProperty(r, '_finished', { value: true, enumerable: false });
    return r;
  };

  // ---------------- 登録 ----------------
  // ★2026-10-11（オーナー指示「10問は長いので8問に」）：theme.dropQuestions に書いた質問を、出さない・判定に使わない。
  //   質問の文はデータに残す（戻せるように）。dropQuestions の無いテーマ（既存7テーマ）は今のまま
  K.defineTheme = function (T) {
    // ★2026-10-16 オーナー指示「選択肢の数を減らす」：theme.dropChoices に書いた関連・環境の項目は、出さない・判定に使わない。
    //   文はデータに残す（relatedAll・env.itemsAll。戻せるように）。dropChoices の無いテーマは今のまま
    if (T.dropChoices && T.dropChoices.length) {
      var dc = T.dropChoices, keep = function (o) {
        var r = {}; Object.keys(o || {}).forEach(function (k) { if (dc.indexOf(k) < 0) r[k] = o[k]; }); return r;
      };
      T.relatedAll = T.related; T.related = keep(T.related);
      if (T.env && T.env.items) { T.env.itemsAll = T.env.items; T.env.items = keep(T.env.items); }
      T.questions = T.questions.map(function (q) {
        if (q.id !== T.relatedQ && q.id !== T.envQ) return q;
        return Object.assign({}, q, { choices: q.choices.filter(function (c) { return dc.indexOf(c.value) < 0; }) });
      });
    }
    // ★2026-10-13 オーナー指示「複数選択が連続している」：関連（複数選択）を頻度の質問のすぐあとへ移し、
    //   最後の環境（複数選択）と続かないようにする（並び順だけ。判定・結果は変わらない）
    //   ★2026-10-16：theme.lastMulti のテーマは移さない（関連と環境を、最後の1問にまとめて出す＝defineDiagnosis）
    if (T.relatedQ && T.freqQ && T.questions && !T.lastMulti) {
      var ri = T.questions.findIndex(function (q) { return q.id === T.relatedQ; });
      var fi = T.questions.findIndex(function (q) { return q.id === T.freqQ; });
      if (ri > fi + 1 && fi >= 0) { var rq = T.questions.splice(ri, 1)[0]; T.questions.splice(fi + 1, 0, rq); }
    }
    if (T.dropQuestions && T.dropQuestions.length) {
      var drop = T.dropQuestions;
      T.questionsAll = T.questions.slice();   // 外す前の全部（検査で文を確かめる用。画面には出ない）
      T.questions = T.questions.filter(function (q) { return drop.indexOf(q.id) < 0; });
      T.routeQuestions = T.routeQuestions.filter(function (id) { return drop.indexOf(id) < 0; });
      // 2026-10-12：場面の質問を3問にした4診断は、答えがばらけても傾向を1つ示す（judgeRoutes の pickTop）
      if (T.routeQuestions.length <= 3) T.pickTop = true;
    }
    K.themes[T.id] = T; return T;
  };

  // ★2026-10-16 オーナー指示「複数選択は最後の1問だけ」：theme.lastMulti のテーマは、画面に出す質問の並びで、
  //   関連（複数選択）を外し、環境（複数選択）の位置に「環境の項目 → 関連の項目 → どれも当てはまらない」の1問を置く（命の項目は最後のまま）。
  //   答えは split に従って関連・環境の答えに分けて入れる（K.splitLast）。判定・検査は今までどおり関連・環境を別々に見る
  //   theme.lastMulti = { text, hint }。lastMulti の無いテーマは、テーマの質問をそのまま返す
  K.lastQuestions = function (T) {
    if (!T.lastMulti) return T.questions;
    var rq = T.questions.filter(function (q) { return q.id === T.relatedQ; })[0];
    var eq = T.questions.filter(function (q) { return q.id === T.envQ; })[0];
    var notOnly = function (c) { return !c.only; };
    var envC = eq.choices.filter(notOnly), relC = rq.choices.filter(notOnly);
    var merged = {
      id: T.id + '_last', type: 'multi', text: T.lastMulti.text, hint: T.lastMulti.hint,
      choices: envC.concat(relC, [{ value: 'none', text: 'どれも当てはまらない', only: true }]),
      split: [{ q: T.envQ, keys: envC.map(function (c) { return c.value; }) }, { q: T.relatedQ, keys: relC.map(function (c) { return c.value; }) }],
      relatedQ: T.relatedQ
    };
    var out = [];
    T.questions.forEach(function (q) {
      if (q.id === T.relatedQ) return;
      out.push(q.id === T.envQ ? merged : q);
    });
    return out;
  };
  // まとめた1問の答え（picked）を、関連・環境の答えに分けて a に入れる。どちらにも選ばれた項目がなければ ['none']
  K.splitLast = function (q, a) {
    var picked = a[q.id] || [];
    q.split.forEach(function (s) {
      var v = picked.filter(function (k) { return s.keys.indexOf(k) >= 0; });
      a[s.q] = v.length ? v : ['none'];
    });
    return a;
  };

  // 診断を組み立てる：1問目（困りごとの選択）→ 選んだテーマの設問 → 結果
  //   problems: 1問目の選択肢の並び。次のどれか
  //     { theme:'id' }                          … 本実装のテーマ
  //     { lite:'id', text, name, tip }          … 簡易結果（準備中のテーマ）
  //     { group:'id', text, gate:{ id, text, hint, choices:[{ theme:'id', text }] } }
  //                                             … ★PHASE 2 の変更案：1問目では1つに見せ、次の1問（分かれ道）でテーマを選ぶ
  //     { none:'id', text, result:function(a) } … ★PHASE 2 の変更案：「この中に近いものがない」。質問なしで結果を返す
  K.defineDiagnosis = function (D) {
    var themeIds = [], liteIds = [], noneIds = [], liteOf = {}, noneOf = {}, groupOf = {};
    D.problems.forEach(function (p) {
      if (p.theme) themeIds.push(p.theme);
      else if (p.lite) { liteIds.push(p.lite); liteOf[p.lite] = p; }
      else if (p.group) { groupOf[p.group] = p; p.gate.choices.forEach(function (c) { themeIds.push(c.theme); }); }
      else if (p.none) { noneIds.push(p.none); noneOf[p.none] = p; }
    });

    // ★2026-10-13 オーナー指示：1問目で答えるとすぐ結果になる選択肢（この中に近いものがない・体がもたない など＝none）は出さない。
    //   診断は、いくつか答えてから分析する形にする。結果の文のデータ（noneOf）は残す（戻せるように）
    // ★2026-10-13（ChatGPT公開前照査の指摘2・オーナー裁定「1つだけ戻す」）：「この中に近いものがない」（id が none／〜_none）だけは戻す。
    //   それ以外の none（体がもたない・心配なことがある・相手のこと など）は出さないまま
    var isNear = function (id) { return /(^|_)none$/.test(id); };
    var shownNone = noneIds.filter(isNear);
    var questions = [{
      id: 'q1', type: 'single', text: D.q1.text, hint: D.q1.hint,
      choices: D.problems.filter(function (p) { return !p.none || isNear(p.none); }).map(function (p) {
        if (p.theme) return { value: p.theme, text: K.themes[p.theme].q1Text };
        return { value: p.lite || p.group || p.none, text: p.text };
      })
    }];
    // 分かれ道の質問（1問目でその選択肢を選んだ人にだけ出す）
    Object.keys(groupOf).forEach(function (g) {
      var G = groupOf[g].gate;
      questions.push({
        id: G.id, type: 'single', text: G.text, hint: G.hint,
        choices: G.choices.map(function (c) { return { value: c.theme, text: c.text }; }),
        show: function (a) { return a.q1 === g; }
      });
    });
    // テーマの設問。分かれ道の先のテーマは、「1問目＝その選択肢」かつ「分かれ道＝そのテーマ」のときだけ出す
    var gateOfTheme = {};
    Object.keys(groupOf).forEach(function (g) {
      groupOf[g].gate.choices.forEach(function (c, i) { gateOfTheme[c.theme] = { group: g, gateId: groupOf[g].gate.id, first: i === 0 }; });
    });
    themeIds.forEach(function (id) {
      var gt = gateOfTheme[id], T = K.themes[id];
      K.lastQuestions(T).forEach(function (q) {
        var qq = Object.assign({}, q);
        // 分かれ道が未回答のあいだは、1つ目の行き先の質問を「出る」と数える（進み具合が「2 / 2」にならないように。再査読 S4-0-01）
        //   条件：分かれ道の先のテーマは、質問の数が同じこと（検査で見る）
        qq.show = gt
          ? function (a) { return a.q1 === gt.group && (a[gt.gateId] === id || (a[gt.gateId] === undefined && gt.first)); }
          : function (a) { return a.q1 === id; };
        questions.push(qq);
      });
    });
    (D.liteQuestions || []).forEach(function (q) {
      var qq = Object.assign({}, q);
      qq.show = function (a) { return liteIds.indexOf(a.q1) >= 0; };
      questions.push(qq);
    });

    var data = {
      schema: 'komari2',
      slug: D.slug,
      title: D.title,
      questions: questions,
      themeIds: themeIds,
      liteIds: liteIds,
      noneIds: shownNone,   // 2026-10-13：1問目に出す none（「この中に近いものがない」だけ）。データは noneAll に全部残す
      noneAll: noneIds,
      groupIds: Object.keys(groupOf),
      mindLine: D.mindLine,   // ★2026-10-04（4診断）：質問なしの結果に必ず入れる心身のサインの1行（検査 T-12 が見る。無い診断は undefined）
      decide: function (a) {
        // 最後にまとめた1問（split のある質問）の答えを、関連・環境の答えに分ける（元の a は変えない）
        var sq = questions.filter(function (q) { return q.split && a[q.id] !== undefined; });
        if (sq.length) { a = Object.assign({}, a); sq.forEach(function (q) { K.splitLast(q, a); }); }
        if (groupOf[a.q1]) {
          var tid = a[groupOf[a.q1].gate.id];
          return K.themes[tid] ? K.buildResult(K.themes[tid], a) : null;
        }
        if (K.themes[a.q1] && themeIds.indexOf(a.q1) >= 0 && !gateOfTheme[a.q1]) return K.buildResult(K.themes[a.q1], a);
        if (liteOf[a.q1]) return K.finishResult(D.decideLite(liteOf[a.q1], a));
        if (noneOf[a.q1]) return K.finishResult(noneOf[a.q1].result(a));
        return null;
      }
    };
    K.diagnoses[D.slug] = data;
    root.KOMARI_DATA = data;
    return data;
  };
})(typeof window !== 'undefined' ? window : globalThis);
