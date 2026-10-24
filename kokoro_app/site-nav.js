/* 診断の森 共通メニュー（2026-10-24 新設）
   オーナー指示「各診断が連動していない。きれいに整理して、見やすくして、ボタンを配置してください」
   ・全ページの一番下に、同じ「サイトのメニュー」を出す（ホーム・診断・読みもの・寄り道・X・YouTube・LINEスタンプ）
   ・上に案内の無いページ（寄り道の診断・記事など）には、ホームへ戻る細い帯を上にも出す
   使い方：各ページの </body> の前に <script src="/shindan/kokoro_app/site-nav.js" defer></script>
   ★リンクは本番の絶対パス（ルート https://pgdhaev4.github.io/ と /shindan/ のどちらに置いたページからでも同じ先へ行く）
   ★URLは 2026-10-24 に実測（X＝@shindannomori は投稿ツールが照合しているアカウント・YouTube＝/@shindannomori は 200 でチャンネル名「診断の森」） */
(function () {
  if (window.__SHINDAN_NAV__) return; window.__SHINDAN_NAV__ = true;
  var HOME = '/';
  var LINKS = {
    shindan: '/#shindan',          // 2026-10-24 ホームを1つにまとめた（5診断の一覧はホームの #shindan）
    yomimono: '/shindan/articles.html',
    yorimichi: '/#yorimichi',
    x: 'https://x.com/shindannomori',
    youtube: 'https://www.youtube.com/@shindannomori',
    line: 'https://line.me/S/sticker/36672049',
    about: '/shindan/about.html',
    privacy: '/shindan/privacy.html',
    terms: '/shindan/terms.html',
    contact: 'https://docs.google.com/forms/d/e/1FAIpQLScsoVHfBBBLw7OT9wyXw29MJz9JEDJ73M8UGyjyBpnbPsGYzQ/viewform'
  };
  var css =
    '.sn-top{position:relative;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:8px;' +
      'max-width:720px;margin:0 auto;padding:8px 14px;font-family:inherit;}' +
    '.sn-top a{text-decoration:none;font-weight:900;font-size:.9rem;color:#2a4d35;}' +
    '.sn-top-bar{max-width:none;background:#f6faf4;border-bottom:1px solid rgba(42,77,53,.18);padding:8px 16px;}' +
    '.sn-top .sn-menu-link{font-size:.8rem;font-weight:800;color:#3b6a47;border:1px solid rgba(42,77,53,.25);border-radius:999px;padding:4px 12px;background:#fff;}' +
    '.sn-wrap{max-width:720px;margin:28px auto 0;padding:0 14px;font-family:inherit;box-sizing:border-box;}' +
    '.sn-box{background:#f6faf4;border:1px solid rgba(92,138,99,.25);border-radius:16px;padding:16px 14px 14px;}' +
    '.sn-box h2{font-size:1rem;font-weight:900;color:#2a4d35;margin:0 0 10px;text-align:center;border:0;padding:0;}' +
    // スマホは1列の横長ボタン（2列だと「明日を少し楽にす／る読みもの」と語の途中で折り返した＝10/24 実測）
    '.sn-grid{display:grid;grid-template-columns:1fr;gap:8px;}' +
    '.sn-btn{display:flex;align-items:center;gap:10px;min-height:56px;' +
      'background:#fff;border:1px solid rgba(42,77,53,.22);border-radius:12px;padding:9px 14px;text-decoration:none;' +
      'color:#2a4d35;font-weight:900;font-size:.92rem;line-height:1.4;text-align:left;box-sizing:border-box;}' +
    '.sn-btn .sn-ic{font-size:1.15rem;flex-shrink:0;width:1.6em;text-align:center;}' +
    '.sn-btn .sn-tx{display:flex;flex-direction:column;min-width:0;word-break:keep-all;overflow-wrap:anywhere;}' +
    '.sn-btn small{font-weight:600;font-size:.74rem;color:#5d6d63;line-height:1.5;}' +
    '.sn-btn::after{content:"›";margin-left:auto;color:#8a9a8f;font-size:1.2rem;}' +
    '.sn-btn.sn-home{background:#2a4d35;color:#fff;border-color:#2a4d35;justify-content:center;}' +
    '.sn-btn.sn-home::after{content:none;}' +
    '.sn-btn:hover{border-color:#2a4d35;}' +
    '.sn-follow{margin-top:12px;text-align:center;}' +
    '.sn-follow p{font-size:.78rem;color:#55665b;margin:0 0 7px;line-height:1.7;}' +
    '.sn-sns{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;}' +
    '.sn-sns a{display:inline-flex;align-items:center;gap:6px;text-decoration:none;font-weight:800;font-size:.82rem;' +
      'border-radius:999px;padding:7px 14px;color:#fff;}' +
    '.sn-sns .sn-x{background:#111;}.sn-sns .sn-yt{background:#d62a22;}.sn-sns .sn-line{background:#06c755;}' +
    '.sn-legal{margin-top:12px;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px;font-size:.74rem;}' +
    '.sn-legal a{color:#6b7a70;text-decoration:none;white-space:nowrap;}' +
    '' +  // PC も1列（3列だと「疲れているときの／診断」と折り返した＝10/24 実測）
    // ★2026-10-24 サイト全体の日本語の折り返し（オーナー「文字の折り返しがへん。ちゃんとチェック」）：
    //   全80ページで「最後の行に1〜2文字だけ」が120件（wrap_check.py）。文節で折り返す・最後の行の取り残しを減らす。
    //   auto-phrase は長い文節で横にはみ出すことがあるので overflow-wrap:anywhere を必ずセット（skill_jp_line_wrap）
    'p,li,dd,dt,a,button,label,summary,td,th,figcaption,small,span{text-wrap:pretty;word-break:auto-phrase;overflow-wrap:anywhere;}' +
    'h1,h2,h3,h4{text-wrap:balance;word-break:auto-phrase;overflow-wrap:anywhere;}';
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }
  function run() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var here = location.pathname.replace(/index\.html$/, '');
    var isHome = (here === '/' || here === '/shindan/');
    // 上の帯：ページに見出しの帯（.site-header・.sn-top）が無いとき、または寄り道の3診断（記事を含む）のとき
    //   2026-10-24 利用者目線の照査 #9 #10：寄り道のページは上に戻り口が無い・記事の一番上が「会社モンスター診断」などで診断の森の記事と分からない
    var yorimichi = /\/(workplace_app|kosodate_app|psychology_app)\//.test(location.pathname);
    if (!isHome && (yorimichi || !document.querySelector('.site-header, .sn-top, header'))) {
      document.body.insertBefore(el(
        '<nav class="sn-top' + (yorimichi ? ' sn-top-bar' : '') + '" aria-label="サイトの案内">' +
          '<a href="' + HOME + '">🌲 診断の森（ホーム）</a>' +
          '<a class="sn-menu-link" href="#sn-menu">メニュー ▼</a>' +
        '</nav>'), document.body.firstChild);
    }
    var block = el(
      '<div class="sn-wrap" id="sn-menu">' +
        '<nav class="sn-box" aria-label="サイトのメニュー">' +
          '<h2>診断の森のメニュー</h2>' +
          '<div class="sn-grid">' +
            (isHome ? '' : '<a class="sn-btn sn-home" href="' + HOME + '">🏠 ホームに戻る</a>') +
            '<a class="sn-btn" href="' + LINKS.shindan + '"><span class="sn-ic">🌿</span><span class="sn-tx">疲れているときの診断<small>仕事・人付き合い・子育て・恋愛・結婚</small></span></a>' +
            '<a class="sn-btn" href="' + LINKS.yomimono + '"><span class="sn-ic">📚</span><span class="sn-tx">明日を少し楽にする読みもの<small>お役立ち記事の一覧</small></span></a>' +
            '<a class="sn-btn" href="' + LINKS.yorimichi + '"><span class="sn-ic">🎈</span><span class="sn-tx">ちょっと笑える寄り道診断<small>会社モンスター診断など3つ</small></span></a>' +
          '</div>' +
          // ホームには「LINEスタンプ」の欄に X・YouTube の案内がある＝二重に出さない（利用者目線の照査 #24）
          (isHome ? '' :
          '<div class="sn-follow">' +
            '<p>ショート動画とお知らせは、XとYouTubeで。</p>' +
            '<div class="sn-sns">' +
              '<a class="sn-x" href="' + LINKS.x + '" target="_blank" rel="noopener">𝕏 フォローする</a>' +
              '<a class="sn-yt" href="' + LINKS.youtube + '" target="_blank" rel="noopener">▶ YouTubeを見る</a>' +
              '<a class="sn-line" href="' + LINKS.line + '" target="_blank" rel="noopener">LINEスタンプ</a>' +
            '</div>' +
          '</div>') +
          '<div class="sn-legal">' +
            '<a href="' + LINKS.about + '">運営者情報</a><a href="' + LINKS.privacy + '">プライバシーポリシー</a>' +
            '<a href="' + LINKS.terms + '">利用規約</a><a href="' + LINKS.contact + '" target="_blank" rel="noopener">お問い合わせ</a>' +
          '</div>' +
        '</nav>' +
      '</div>');
    var foot = document.querySelector('footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(block, foot); else document.body.appendChild(block);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
