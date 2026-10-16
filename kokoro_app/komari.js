/**
 * komari.js — 困りごと型診断のエンジン（試験版 2026-09-25）
 *
 * 性格タイプに分類する kokoro.js とは別物。診断固有の内容は一切持たず、
 *   window.KOMARI_DATA = { title, questions:[...], decide(answers) → 結果 }
 * を読んで、設問（分岐・単一選択・複数選択）と結果（節の並び）を描くだけ。
 * ★横展開のときは data/<slug>_komari.js を1本書けばよい。このファイルは触らない想定。
 * ★kokoro.js・style.css・cta.js には依存しない（既存の10診断へ影響を出さないため）。
 *
 * 設問: { id, type:'single'|'multi', text, hint?, show?(answers)→bool, choices:[{value,text,only?}] }
 *   show が false の設問は飛ばす。multi の only:true は「どれも当てはまらない」（他と同時に選べない）。
 * 結果: { key, kicker, headline, summary:[{label,text}], sections:[{kind,title,...}] }
 *   kind = text | list | change | phrase | alert | notice | paid
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
(function () {
  'use strict';

  var GUARD_MS = 400;          // 設問の差し替え直後に入力を受け付けない時間（kokoro.js と同じ理由・同じ値）
  var PROD_HOST = 'pgdhaev4.github.io';
  // 2026-10-12 オーナー指示（確定）：結果の見出しを「一言」に（テーマごと。強さの言い方〈強く表れています 等〉は付けない）
  var ONE_WORD = {
    kotowarenai: '頼まれごとを抱え込みやすい状態',
    kigen: '相手の機嫌に振り回されやすい状態',
    nomikomu: '言いたいことを飲み込みやすい状態',
    zatsudan: '雑談や付き合いに合わせて疲れやすい状態',
    itabasami: '板挟みを抱え込みやすい状態',
    kikiyaku: '聞き役になって抱え込みやすい状態',
    kinisuru: '会話のあとも考え続けやすい状態',
    ym_riyuu: '辞めたい理由を確かめられないまま迷っている状態',
    ym_mitooshi: '辞めたあとの不安で、考えが進まない状態',
    ym_mayoi: '辞めるか続けるかの迷いに疲れている状態',
    kk_hanashi: '結婚の話が進まないことに焦っている状態',
    kk_konkatsu: '婚活で焦りや疲れがたまっている状態',
    kk_mawari: '周りから結婚のことを言われてつらい状態',
    kk_hitori: 'ひとりで結婚を焦っている状態',
    rn_kakunin: '相手の気持ちが分からず落ち着かない状態',
    rn_awaseru: '相手に合わせて、希望を引っ込めやすい状態',
    rn_jiseki: 'うまくいかなかったことで自分を責めている状態',
    rn_kowai: '近づく前に、怖さで止まりやすい状態',
    ks_yasumenai: '休めないまま回している状態',
    ks_iraira: '子どもに強い言葉が出てしまう状態',
    ks_jiseki: '自分の子育てを責めてしまう状態'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // **〜** だけ太字にする（HTMLは通さない）
  function bold(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }
  function now() { return (window.performance && performance.now) ? performance.now() : +new Date(); }

  function loadAds() {
    if (window.__kokoroAdsLoaded) return;
    window.__kokoroAdsLoaded = true;
    try {
      var el = document.createElement('script');
      el.async = true; el.crossOrigin = 'anonymous';
      el.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3934206444145241';
      document.head.appendChild(el);
    } catch (e) {}
  }
  function hero(show) {
    try { document.body.classList[show ? 'remove' : 'add']('is-result'); } catch (e) {}
  }

  function Komari(sel) {
    this.mount = document.querySelector(sel || '#quiz-app');
    this.data = null;
    this.answers = {};
    this.history = [];         // 表示した設問の番号（QUESTIONS の添字）
    this.cur = -1;
    this.readyAt = 0;
    this.locked = false;
  }

  Komari.prototype.init = function () {
    if (!this.mount) return;
    if (!window.KOMARI_DATA) {
      this.mount.innerHTML = '<p class="err">診断データを読み込めませんでした。ページを再読み込みしてください。</p>';
      return;
    }
    this.data = window.KOMARI_DATA;
    this.cur = this.nextIndex(-1);
    this.renderQuestion(true);
    try { if (window.KMES) window.KMES.start(); } catch (e) {}
  };

  Komari.prototype.visible = function (i) {
    var q = this.data.questions[i];
    return !q.show || !!q.show(this.answers);
  };
  Komari.prototype.nextIndex = function (from) {
    for (var i = from + 1; i < this.data.questions.length; i++) if (this.visible(i)) return i;
    return -1;
  };
  // 今の答えで表示される設問の数（1問目に答えるまでは分岐が決まらないので「約」を付ける）
  Komari.prototype.total = function () {
    var n = 0;
    for (var i = 0; i < this.data.questions.length; i++) if (this.visible(i)) n++;
    return n;
  };
  // 2026-10-11（オーナー指示「設問数がばらばらで違和感」）：1問目の時点でも「1 / 8」と出すため、1問目の選択肢ごとの問数のうち最大を使う
  //   （質問なしで結果になる選択肢＝限界・近いものがない などは、総数より早く終わるだけなので最大に含めない扱いでよい）
  //   2026-10-12：困りごとによって問数が違う診断（職場の人付き合い＝9〜10問）は、1問目で総数を決められないので 0 を返す（＝「1問目」と出す）
  Komari.prototype.maxTotal = function () {
    var qs = this.data.questions, q1 = qs[0], seen = {};
    (q1.choices || []).forEach(function (c) {
      var a = {}; a[q1.id] = c.value; var n = 0;
      for (var i = 0; i < qs.length; i++) { try { if (!qs[i].show || qs[i].show(a)) n++; } catch (e) { n++; } }
      if (n > 1) seen[n] = 1;   // 質問なしで結果になる選択肢（1問で終わる）は数えない
    });
    var ks = Object.keys(seen);
    return ks.length === 1 ? +ks[0] : 0;
  };

  // ---------------- 設問 ----------------
  Komari.prototype.renderQuestion = function (first) {
    var self = this;
    var q = this.data.questions[this.cur];
    var pos = this.history.length + 1;
    var decided = this.history.length > 0;             // 1問目に答えたら総数が決まる
    var total = decided ? this.total() : this.maxTotal();
    var pct = Math.round((pos / total) * 100);
    var multi = q.type === 'multi';
    var sel = multi ? (this.answers[q.id] || []).slice() : null;

    this.mount.innerHTML =
      '<div class="quiz-container k-quiz">' +
        '<div class="quiz-head"><p class="qname">' + esc(this.data.title) + '</p></div>' +
        '<div class="progress-area">' +
          '<div class="progress-label"><span>' + (total ? pos + ' / ' + total : '1問目') + '</span></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + (total ? pct : 8) + '%"></div></div>' +
        '</div>' +
        (pos > 1 ? '<div class="back-btn-wrap"><button class="back-btn" type="button">← ひとつ前に戻る</button></div>' : '') +
        '<div class="question-card" tabindex="-1" role="group" aria-label="質問 ' + pos + '">' +
          '<p class="question-number">Q' + pos + '</p>' +
          '<p class="question-text">' + esc(q.text) + '</p>' +
          (multi ? '<p class="k-hint">当てはまるものをいくつでも選べます。' + (q.hint ? esc(q.hint) : '') + '</p>' : (q.hint ? '<p class="k-hint">' + esc(q.hint) + '</p>' : '')) +
          '<div class="choices-list' + (multi ? ' k-multi' : '') + '">' +
            q.choices.map(function (c, i) {
              var on = multi && sel.indexOf(c.value) >= 0;
              return '<button class="choice-btn' + (on ? ' selected' : '') + (multi ? ' k-check' : '') + '" type="button"' +
                       ' data-i="' + i + '"' + (multi ? ' aria-pressed="' + on + '"' : '') + '>' +
                       '<span class="choice-mark"></span><span class="choice-text">' + esc(c.text) + '</span>' +
                     '</button>';
            }).join('') +
          '</div>' +
          (multi ? '<button class="btn btn-main k-next" type="button"' + (sel.length ? '' : ' disabled') + '>次へ</button>' : '') +
        '</div>' +
        // 1問目には「この中に近いものがない」の選択肢があるので、「まだ近いものを」の一言は2問目以降だけに出す（2026-10-04）
        '<p class="quiz-note">正解はありません。' + (q.id === 'q1' ? '' : '近いものがなければ、いちばん「まだ近い」ものでかまいません。') + '</p>' +
      '</div>';

    var back = this.mount.querySelector('.back-btn');
    if (back) back.addEventListener('click', function () { self.goBack(); });
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (btn) {
      btn.addEventListener('click', function () {
        if (!self.accepts()) return;
        var c = q.choices[+btn.getAttribute('data-i')];
        if (multi) self.toggle(q, c); else self.pick(q, c, btn);
      });
    });
    var nx = this.mount.querySelector('.k-next');
    if (nx) nx.addEventListener('click', function () {
      if (!self.accepts() || !(self.answers[q.id] || []).length) return;
      self.advance();
    });

    this.readyAt = now() + GUARD_MS;
    if (!first) this.scrollToQuiz();
  };

  Komari.prototype.accepts = function () { return !this.locked && now() >= this.readyAt; };

  Komari.prototype.pick = function (q, c, btn) {
    var self = this;
    this.locked = true;
    this.answers[q.id] = c.value;
    btn.classList.add('selected');
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (b) { b.disabled = true; });
    setTimeout(function () { self.locked = false; self.advance(); }, 330);
  };

  Komari.prototype.toggle = function (q, c) {
    var cur = (this.answers[q.id] || []).slice();
    var i = cur.indexOf(c.value);
    if (i >= 0) cur.splice(i, 1);
    else if (c.only) cur = [c.value];                       // 「どれも当てはまらない」は単独
    else {
      cur = cur.filter(function (v) {
        return !q.choices.some(function (x) { return x.only && x.value === v; });
      });
      cur.push(c.value);
    }
    this.answers[q.id] = cur;
    // 見た目だけ更新（差し替えない＝不感帯を作り直さない）
    Array.prototype.forEach.call(this.mount.querySelectorAll('.choice-btn'), function (b) {
      var v = q.choices[+b.getAttribute('data-i')].value;
      var on = cur.indexOf(v) >= 0;
      b.classList.toggle('selected', on);
      b.setAttribute('aria-pressed', on);
    });
    var nx = this.mount.querySelector('.k-next');
    if (nx) nx.disabled = !cur.length;
  };

  // ★2026-10-13（ChatGPT公開前照査の指摘3）：関連の質問で、命にかかわる項目（theme.kieruKey）・子育ての「手が出そうで怖い」（ks_kowai）を
  //   選んだら、結果まで待たせず、その質問の直後に案内を出す。中身は結果の先頭に出す専用の案内（theme.specials＝確認済みの文・窓口の台帳）と同じもの。
  //   「診断を続ける」で残りの質問へ進む（結果にも、これまでどおり同じ案内が先に出る）
  var URGENT_EXTRA = ['ks_kowai'];
  Komari.prototype.urgentFor = function (q) {
    var K = window.KOMARI, themes = (K && K.themes) || {}, T = null;
    Object.keys(themes).forEach(function (id) { if (themes[id].relatedQ === q.id) T = themes[id]; });
    if (!T || !T.specials) return [];
    var picked = this.answers[q.id] || [], a = this.answers;
    return picked.filter(function (k) { return k === T.kieruKey || URGENT_EXTRA.indexOf(k) >= 0; }).map(function (k) {
      var S = T.specials[k];
      if (typeof S === 'function') S = S(a, { strength: 2, route: { undetermined: true, primary: [], secondary: [] }, envStrong: false });
      return S ? { key: k, S: S } : null;
    }).filter(Boolean).sort(function (x, y) { return (x.S.top || 9) - (y.S.top || 9); });
  };

  Komari.prototype.renderUrgent = function (list) {
    var self = this, q = this.data.questions[this.cur];
    this.urgentShown = this.urgentShown || {};
    this.mount.innerHTML =
      '<div class="result-container k-result k-urgent">' +
        list.map(function (x) {
          var S = x.S;
          return self.section({ kind: 'list', title: S.title, lead: S.lead || '', items: S.items || [], after: S.after || '', plainLead: true, links: S.links }, 0);
        }).join('') +
        '<div class="result-actions">' +
          '<button class="btn btn-main k-continue" type="button">診断を続ける</button>' +
          '<button class="btn btn-sub k-urgent-back" type="button">← 質問に戻る</button>' +
        '</div>' +
      '</div>';
    this.mount.querySelector('.k-continue').addEventListener('click', function () {
      self.urgentShown[q.id + ':' + list.map(function (x) { return x.key; }).join(',')] = 1;
      self.advance();
    });
    this.mount.querySelector('.k-urgent-back').addEventListener('click', function () { self.renderQuestion(); });
    this.scrollToQuiz();
  };

  Komari.prototype.advance = function () {
    var q = this.data.questions[this.cur];
    if (q && q.type === 'multi') {
      var urg = this.urgentFor(q);
      var sig = q.id + ':' + urg.map(function (x) { return x.key; }).join(',');
      if (urg.length && !(this.urgentShown && this.urgentShown[sig])) { this.renderUrgent(urg); return; }
    }
    this.history.push(this.cur);
    var n = this.nextIndex(this.cur);
    if (n < 0) { this.renderResult(); return; }
    this.cur = n;
    this.renderQuestion();
  };

  Komari.prototype.goBack = function () {
    if (!this.history.length || !this.accepts()) return;
    // 今の設問の答えは消す（分岐が変わったときに古い答えが判定に混ざらないように）
    delete this.answers[this.data.questions[this.cur].id];
    this.cur = this.history.pop();
    var q = this.data.questions[this.cur];
    if (q.type !== 'multi') delete this.answers[q.id];      // 単一選択は選び直してもらう
    this.renderQuestion();
  };

  Komari.prototype.scrollToQuiz = function () {
    var el = this.mount;
    setTimeout(function () {
      try {
        var top = el.getBoundingClientRect().top + window.pageYOffset - 8;
        if (Math.abs(window.pageYOffset - top) > 4) window.scrollTo(0, top);
        var card = el.querySelector('.question-card');
        if (card) card.focus({ preventScroll: true });
      } catch (e) {}
    }, 0);
  };

  // ---------------- 結果 ----------------
  Komari.prototype.renderResult = function () {
    var self = this;
    var r;
    try { r = this.data.decide(this.answers); } catch (e) { r = null; }
    if (!r) { this.mount.innerHTML = '<p class="err">結果の読み込みに失敗しました。もう一度お試しください。</p>'; return; }
    this.result = r;

    var no = 0;
    var body = r.sections.map(function (s) {
      var numbered = ['text', 'list', 'change', 'phrase', 'paid'].indexOf(s.kind) >= 0;
      if (numbered) no++;
      return self.section(s, numbered ? no : 0);
    }).join('');

    // 2026-10-13 オーナー指示：結果の一番上の見出し（「〜状態」）も出さない。いきなり「① 今の状態」から始める
    //   （2026-10-12 に決めた一言の見出し ONE_WORD は使わなくなったが、戻せるように表は残す）
    this.mount.innerHTML =
      '<div class="result-container k-result" data-key="' + esc(r.key) + '">' +
        body +
        '<div class="result-actions">' +
          '<button class="btn btn-sub" id="retry" type="button">もう一度診断する</button>' +
          '<a class="btn btn-sub" href="index.html">ほかの診断を見る</a>' +
        '</div>' +
      '</div>';

    hero(false);
    this.foldStatic();
    loadAds();
    var viewId = '';
    try { if (window.KMES) viewId = window.KMES.result(r.key); } catch (e) {}
    var cta = this.mount.querySelector('.k-paid');
    if (cta && window.KMES) {
      var meta = { viewId: viewId, type: r.key, variant: 'komari1' };
      try { window.KMES.observeCTA(cta, meta); } catch (e) {}
      var b = cta.querySelector('.cta-btn');
      if (b) b.addEventListener('click', function () { try { window.KMES.ctaClick(meta); } catch (e) {} });
    }
    document.getElementById('retry').addEventListener('click', function () {
      self.answers = {}; self.history = []; self.cur = self.nextIndex(-1);
      hero(true); self.unfoldStatic(); self.renderQuestion();
    });
    try { window.scrollTo(0, Math.max(0, this.mount.getBoundingClientRect().top + window.pageYOffset - 8)); } catch (e) {}
  };

  Komari.prototype.section = function (s, no) {
    var h = '<h3>' + (no ? '<span class="k-no">' + no + '</span>' : '') + esc(s.title) + '</h3>';
    var ps = function (arr) { return (arr || []).filter(Boolean).map(function (t) { return '<p>' + bold(t) + '</p>'; }).join(''); };
    var ul = function (arr, cls) { return '<ul class="' + cls + '">' + arr.map(function (t) { return '<li>' + bold(t) + '</li>'; }).join('') + '</ul>'; };

    switch (s.kind) {
      case 'text':
        return '<section class="rs k-sec ' + (s.cls || '') + '">' + h + ps(s.paras) + '</section>';
      case 'list':
        // plainLead＝導入文をふつうの字で出す（専用の案内・仕組みの問題など、導入文がいちばん伝えたい文の節）／links＝一覧の節にもリンクを出す（2026-10-04）
        return '<section class="rs k-sec">' + h + (s.lead ? '<p' + (s.plainLead ? '' : ' class="k-small"') + '>' + bold(s.lead) + '</p>' : '') +
          ul(s.items, 'k-list') + ps([s.after]) +
          (s.links || []).map(function (l) {
            return '<p class="k-link"><a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a></p>';
          }).join('') + '</section>';
      case 'change':
        return '<section class="rs k-sec k-change">' + h +
          s.points.map(function (p) { return '<p class="k-point">' + bold(p) + '</p>'; }).join('') + ps([s.body]) + '</section>';
      case 'phrase':
        return '<section class="rs k-sec k-today">' + h + (s.lead ? '<p class="k-small">' + bold(s.lead) + '</p>' : '') +
          '<blockquote class="k-phrase">' + bold(s.phrase) + '</blockquote>' + ps([s.after]) +
          (s.note ? '<p class="k-note">' + bold(s.note) + '</p>' : '') + '</section>';
      case 'alert':
        return '<section class="rs k-sec k-alert" role="note">' + '<h3>⚠ ' + esc(s.title) + '</h3>' + ps(s.paras) + ul(s.items, 'k-list') +
          (s.after ? '<p class="k-sub-head">' + esc(s.afterHead || '') + '</p>' + ul(s.after, 'k-steps') : '') +
          (s.links || []).map(function (l) {
            return '<p class="k-link"><a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + ' ↗</a></p>';
          }).join('') + '</section>';
      case 'notice':
        return '<section class="rs k-sec k-notice">' + '<h3>' + esc(s.title) + '</h3>' + ps(s.paras) + '</section>';
      case 'paid':
        return this.paid(s, h);
    }
    return '';
  };

  Komari.prototype.paid = function (s, h) {
    var local = location.hostname !== PROD_HOST;
    var btn;
    if (s.noteUrl) {
      btn = '<a class="cta-btn" href="' + esc(s.noteUrl) + '" target="_blank" rel="noopener">noteで記事を読む（' + esc(s.price) + '）</a>';
    } else {
      btn = '<span class="cta-btn k-disabled" aria-disabled="true">実践記事は順次公開予定です</span>' +
            (local && s.previewUrl ? '<p class="k-preview"><a href="' + esc(s.previewUrl) + '" target="_blank" rel="noopener">【試験用】記事の中身をプレビューで確認する</a></p>' : '');
    }
    return '<section class="rs k-sec k-paid cta-card' + (s.quiet ? ' k-quiet' : '') + '">' + h +
      '<p class="k-art-title">有料記事『' + esc(s.articleTitle) + '』<span class="k-price">note・' + esc(s.price) + '</span></p>' +
      '<p>' + bold(s.lead) + '</p>' +
      // quiet＝私生活の害が強い結果（2026-10-04・4診断）。記事の購入を前面に出さないため、得られることの一覧を出さない
      (s.quiet ? '' :
      '<p class="k-sub-head">この記事で得られること</p>' +
      '<ul class="k-list k-gets">' + s.items.map(function (t) { return '<li>' + bold(t) + '</li>'; }).join('') + '</ul>') +
      btn +
      '<p class="cta-note">' + esc(s.note) + '</p>' +
    '</section>';
  };

  // 結果のあとは、下の長い説明を折りたたむ（kokoro.js と同じふるまい）
  Komari.prototype.foldStatic = function () {
    try {
      if (document.querySelector('.seo-fold')) return;
      var wrap = document.querySelector('.page-wrapper > .wrap');
      var secs = wrap ? wrap.querySelectorAll('section.static-sec') : [];
      if (!secs.length) return;
      var d = document.createElement('details');
      d.className = 'seo-fold';
      var sm = document.createElement('summary');
      sm.textContent = 'この診断について（説明・よくある質問）';
      d.appendChild(sm);
      Array.prototype.forEach.call(secs, function (sec) { d.appendChild(sec); });
      wrap.appendChild(d);
    } catch (e) {}
  };
  Komari.prototype.unfoldStatic = function () {
    try {
      var d = document.querySelector('.seo-fold');
      if (!d) return;
      Array.prototype.forEach.call(d.querySelectorAll('section.static-sec'), function (sec) { d.parentNode.insertBefore(sec, d); });
      d.parentNode.removeChild(d);
    } catch (e) {}
  };

  window.KomariQuiz = Komari;
  document.addEventListener('DOMContentLoaded', function () { new Komari('#quiz-app').init(); });
})();
