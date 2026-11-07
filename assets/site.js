(function () {
  var html = document.documentElement;
  html.classList.remove('no-js');

  /* ---- Live offer: ends Saturday 7 Nov 2026, 11:59 PM Cairo time ---- */
  var OFFER_END = new Date('2026-11-07T23:59:59+02:00').getTime();
  function applyOffer() {
    var live = Date.now() <= OFFER_END;
    html.classList.toggle('offer-active', live);
    html.classList.toggle('offer-expired', !live);
  }
  applyOffer();
  setInterval(applyOffer, 60000);

  /* ---- Language: ?lang=en|ar, then saved choice, then Arabic ---- */
  function getSaved() { try { return localStorage.getItem('btu-lang'); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem('btu-lang', l); } catch (e) {} }
  var q = (location.search.match(/[?&]lang=(en|ar)/) || [])[1];
  var lang = q || getSaved() || 'ar';

  function setLang(l) {
    lang = l;
    html.lang = l === 'en' ? 'en' : 'ar-EG';
    html.dir = l === 'en' ? 'ltr' : 'rtl';
    var t = html.getAttribute('data-title-' + l);
    if (t) document.title = t;
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.setAttribute('aria-label', l === 'en' ? 'عرض الصفحة بالعربي' : 'View this page in English');
    });
    // keep the language when moving between the cover page and the program page
    document.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
      var base = a.getAttribute('href').split('?')[0].split('#');
      a.setAttribute('href', base[0] + (l === 'en' ? '?lang=en' : '') + (base[1] ? '#' + base[1] : ''));
    });
    save(l);
  }
  setLang(lang);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.lang-toggle');
    if (b) setLang(lang === 'en' ? 'ar' : 'en');
  });

  /* ---- Sticky bottom CTA (mobile) ---- */
  var s = document.getElementById('sticky');
  if (s && 'IntersectionObserver' in window) {
    var vis = {}, ids = ['hero-cta', 'offer-cta', 'final-cta'];
    var upd = function () {
      var any = ids.some(function (i) { return vis[i]; });
      var show = !any && vis._past;
      s.classList.toggle('show', !!show);
      s.setAttribute('aria-hidden', show ? 'false' : 'true');
      s.querySelectorAll('a').forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        vis[e.target.id] = e.isIntersecting;
        if (e.target.id === 'hero-cta') vis._past = !e.isIntersecting && e.boundingClientRect.top < 0;
      });
      upd();
    });
    ids.forEach(function (i) { var el = document.getElementById(i); if (el) io.observe(el); });
  }
})();
