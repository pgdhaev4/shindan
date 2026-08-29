/**
 * measure.js — 診断の森の軽量計測（匿名・Cookieなし・数だけ数える）
 *
 * 何を送るか: イベント種別・診断名・結果タイプ・CTA文言パターン・流入元（?f=yt&v=動画ID）だけ。
 * 何を送らないか: 個人を特定する情報・回答内容・Cookie・端末ID。
 *
 * 設計（2026-08-29 v3資料で承認済み）:
 *  - ENDPOINT が空のうちは何も送らない（計測APIのデプロイ前でも安全に組み込める）。
 *  - 二重計測防止: 結果表示のたびに使い捨ての「表示ID」を発行し、
 *    同じ表示IDの同じイベントは1回しか送らない（sessionStorage）。
 *  - CTA表示: IntersectionObserver で「カードの50%以上が画面内に連続1秒」入ったときだけ数える。
 *  - 送信は sendBeacon（なければ fetch keepalive）。失敗しても何もしない＝診断の動作に一切影響させない。
 *
 * ※ファイル名を「_」始まりにしないこと（publish.ps1 が _*.js を公開から除外するため）。
 */
(function () {
  'use strict';

  // 計測APIのURL（2026-08-29 デプロイ済み）。空文字にすると計測OFF。
  var ENDPOINT = 'https://shindan-metrics.netlify.app/api/ev';

  // ★本番（pgdhaev4.github.io）でだけ送る。
  //   ローカル確認や機械検査(8021番)から送ると、403のコンソールエラーが出て検査を汚し、
  //   逆に許可すると検査のたびに本番カウンタが汚れる。どちらも避けるための既定OFF。
  //   E2E検証時だけ sessionStorage.kmes_force='1' で強制ONにできる。
  var enabled = false;
  try {
    enabled = (location.hostname === 'pgdhaev4.github.io') ||
              (sessionStorage.getItem('kmes_force') === '1');
  } catch (e) { enabled = false; }

  var SS_SRC = 'kmes_src';

  function slug() {
    try {
      return (location.pathname.split('/').pop() || '').replace(/\.html?$/, '');
    } catch (e) { return ''; }
  }

  // ?f=yt&v=xxx を覚えておく（診断ページに直接来ても、トップ経由でも拾えるように保存）
  (function rememberSource() {
    try {
      var p = new URLSearchParams(location.search);
      var f = p.get('f'), v = p.get('v');
      if (f) sessionStorage.setItem(SS_SRC, JSON.stringify({ f: f, vid: v || '' }));
    } catch (e) { /* 無視 */ }
  })();

  function source() {
    try { return JSON.parse(sessionStorage.getItem(SS_SRC) || 'null') || {}; }
    catch (e) { return {}; }
  }

  function send(payload) {
    if (!ENDPOINT || !enabled) return;
    try {
      var body = JSON.stringify(payload);
      // ★Content-Type は text/plain にする（実測 2026-08-29）。
      //   application/json だと「単純なリクエスト」ではなくなり、ブラウザが事前確認(preflight)を
      //   挟むため sendBeacon が黙って破棄される。text/plain なら事前確認なしで確実に届く。
      //   サーバ側(ev.mjs)は Content-Type を見ずに本文をJSONとして読むので、これで問題ない。
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }));
      } else if (window.fetch) {
        fetch(ENDPOINT, { method: 'POST', body: body, keepalive: true }).catch(function () {});
      }
    } catch (e) { /* 計測の失敗はサイトに影響させない */ }
  }

  // 同じ表示ID内で同じイベントを2回送らない
  function once(viewId, ev) {
    try {
      var k = 'kmes_' + viewId + '_' + ev;
      if (sessionStorage.getItem(k)) return false;
      sessionStorage.setItem(k, '1');
      return true;
    } catch (e) { return true; }   // 保存できない環境では送る側に倒す（数える方を優先）
  }

  var KMES = {
    /** 診断開始（1問目表示時に1回） */
    start: function () {
      var s = source();
      send({ e: 'start', d: slug(), f: s.f || '', vid: s.vid || '' });
    },

    /** 結果表示。使い捨ての表示IDを返す（CTA計測に引き継ぐ） */
    result: function (typeKey) {
      var viewId = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      if (once(viewId, 'result')) send({ e: 'result', d: slug(), t: typeKey });
      return viewId;
    },

    /**
     * CTA表示の監視。カードの50%以上が画面内に「連続1秒」入ったら1回だけ記録。
     * el = CTAカード要素 / meta = {viewId, type, variant}
     */
    observeCTA: function (el, meta) {
      if (!el || !window.IntersectionObserver) return;
      var timer = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.intersectionRatio >= 0.5) {
            if (!timer) timer = setTimeout(function () {
              if (once(meta.viewId, 'cta_seen')) {
                send({ e: 'cta_seen', d: slug(), t: meta.type, va: meta.variant || '' });
              }
              io.disconnect();
            }, 1000);
          } else if (timer) { clearTimeout(timer); timer = null; }
        });
      }, { threshold: [0, 0.5, 1] });
      io.observe(el);
    },

    /** CTAクリック（同じ表示IDで1回だけ） */
    ctaClick: function (meta) {
      if (once(meta.viewId, 'cta_click')) {
        send({ e: 'cta_click', d: slug(), t: meta.type, va: meta.variant || '' });
      }
    }
  };

  window.KMES = KMES;
})();
