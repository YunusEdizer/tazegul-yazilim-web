(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_NUMBER = '905388978856';

  /* ---------- Tema ---------- */
  var themeToggle = document.getElementById('themeToggle');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('tz-theme', next); } catch (e) {}
  });

  /* ---------- Mobil menü ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Başlık gölgesi, WhatsApp butonu ---------- */
  var header = document.querySelector('.header');
  var waFloat = document.querySelector('.wa-float');
  var mbar = document.getElementById('mbar');
  var progress = document.getElementById('progress');
  var contact = document.getElementById('iletisim');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    waFloat.classList.toggle('is-shown', y > 600);
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    // Mobil çubuk: girişten sonra görünsün, iletişim bölümündeyken çekilsin
    var c = contact.getBoundingClientRect();
    var inContact = c.top < window.innerHeight * 0.6 && c.bottom > 0;
    mbar.classList.toggle('is-shown', y > 520 && !inContact);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Aktif menü bağlantısı ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Kaydırınca beliren öğeler ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Aynı kapsayıcıdaki kardeş öğelere kademeli gecikme ver
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains('reveal');
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i * 0.07, 0.42) + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Kartlarda imleci takip eden ışık ---------- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Editörde yazılan kod ---------- */
  var typed = document.getElementById('typed');
  var snippets = [
    [
      ['k', 'const '], ['', 'proje = '], ['k', 'await '], ['', 'tazegul.'], ['f', 'baslat'], ['', '({\n'],
      ['p', '  tur'], ['', ': '], ['s', '"e-ticaret"'], ['', ',\n'],
      ['p', '  platform'], ['', ': ['], ['s', '"web"'], ['', ', '], ['s', '"ios"'], ['', ', '], ['s', '"android"'], ['', '],\n'],
      ['p', '  hedef'], ['', ': '], ['s', '"daha fazla müşteri"'], ['', ',\n'],
      ['', '});\n\n'],
      ['', 'proje.'], ['f', 'tasarla'], ['', '();   '], ['c', '// mobil öncelikli\n'],
      ['', 'proje.'], ['f', 'gelistir'], ['', '();  '], ['c', '// hızlı ve güvenli\n'],
      ['', 'proje.'], ['f', 'yayinla'], ['', '();   '], ['c', '// ✓ canlıda']
    ],
    [
      ['k', 'const '], ['', 'kampanya = '], ['', 'reklam.'], ['f', 'olustur'], ['', '({\n'],
      ['p', '  kanal'], ['', ': ['], ['s', '"google"'], ['', ', '], ['s', '"instagram"'], ['', '],\n'],
      ['p', '  hedefKitle'], ['', ': '], ['s', '"Kars ve çevresi"'], ['', ',\n'],
      ['p', '  butce'], ['', ': '], ['s', '"planlı ve ölçülebilir"'], ['', ',\n'],
      ['', '});\n\n'],
      ['k', 'if '], ['', '(kampanya.'], ['f', 'sonuc'], ['', '() > '], ['n', 'beklenti'], ['', ') {\n'],
      ['', '  isletme.'], ['f', 'buyu'], ['', '(); '], ['c', '// hedefimiz bu\n'],
      ['', '}']
    ]
  ];

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function render(tokens, count) {
    var html = '';
    var left = count;
    for (var i = 0; i < tokens.length && left > 0; i++) {
      var cls = tokens[i][0];
      var text = tokens[i][1].slice(0, left);
      left -= text.length;
      html += cls ? '<span class="' + cls + '">' + esc(text) + '</span>' : esc(text);
    }
    return html;
  }
  function totalLength(tokens) {
    return tokens.reduce(function (n, t) { return n + t[1].length; }, 0);
  }

  if (typed) {
    if (reduceMotion) {
      typed.innerHTML = render(snippets[0], Infinity);
    } else {
      var s = 0;
      var run = function () {
        var tokens = snippets[s];
        var total = totalLength(tokens);
        var n = 0;
        var tick = function () {
          n += 1;
          typed.innerHTML = render(tokens, n);
          if (n < total) {
            var ch = typed.textContent.slice(-1);
            setTimeout(tick, ch === '\n' ? 180 : 22 + Math.random() * 38);
          } else {
            setTimeout(function () {
              s = (s + 1) % snippets.length;
              typed.innerHTML = '';
              run();
            }, 4200);
          }
        };
        setTimeout(tick, 500);
      };
      run();
    }
  }

  /* ---------- Sektör sekmeleri ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sectors__tabs [role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ---------- Teklif sihirbazı → WhatsApp ---------- */
  var wizard = document.getElementById('wizard');
  var steps = Array.prototype.slice.call(wizard.querySelectorAll('.wstep'));
  var dots = Array.prototype.slice.call(wizard.querySelectorAll('[data-dot]'));
  var bar = document.getElementById('wizBar');
  var btnBack = document.getElementById('wizBack');
  var btnNext = document.getElementById('wizNext');
  var btnSubmit = document.getElementById('wizSubmit');
  var errorBox = document.getElementById('formError');
  var preview = document.getElementById('waPreview');
  var current = 1;

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = !msg;
  }

  function buildMessage() {
    var d = new FormData(wizard);
    var val = function (k) { return (d.get(k) || '').toString().trim(); };
    var lines = ['Merhaba, web siteniz üzerinden teklif almak istiyorum.', ''];
    if (val('ad')) lines.push('Ad Soyad: ' + val('ad'));
    if (val('firma')) lines.push('İşletme: ' + val('firma'));
    var hizmetler = d.getAll('hizmet');
    if (hizmetler.length) lines.push('Hizmetler: ' + hizmetler.join(', '));
    if (val('sektor')) lines.push('Sektör: ' + val('sektor'));
    if (val('mevcut')) lines.push('Mevcut site: ' + val('mevcut'));
    if (val('zaman')) lines.push('Başlangıç: ' + val('zaman'));
    if (val('mesaj')) lines.push('', val('mesaj'));
    return lines.join('\n');
  }

  function goTo(n, focus) {
    current = n;
    steps.forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== n; });
    dots.forEach(function (dot) {
      var k = Number(dot.getAttribute('data-dot'));
      dot.classList.toggle('is-active', k === n);
      dot.classList.toggle('is-done', k < n);
    });
    bar.style.width = (n / steps.length * 100) + '%';
    btnBack.hidden = n === 1;
    btnNext.hidden = n === steps.length;
    btnSubmit.hidden = n !== steps.length;
    showError('');
    if (n === steps.length) preview.textContent = buildMessage();
    if (focus) {
      var legend = steps[n - 1].querySelector('legend');
      if (legend) legend.focus({ preventScroll: true });
      var top = wizard.getBoundingClientRect().top;
      if (top < 80) window.scrollBy({ top: top - 96, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function validate(n) {
    if (n === 1 && !wizard.querySelector('input[name="hizmet"]:checked')) {
      showError('Devam etmek için en az bir hizmet seçin.');
      return false;
    }
    if (n === 3) {
      var ad = wizard.ad.value.trim();
      var mesaj = wizard.mesaj.value.trim();
      wizard.ad.classList.toggle('is-invalid', !ad);
      wizard.mesaj.classList.toggle('is-invalid', !mesaj);
      if (!ad || !mesaj) {
        showError('Lütfen adınızı ve projenizle ilgili kısa bir açıklama yazın.');
        (ad ? wizard.mesaj : wizard.ad).focus();
        return false;
      }
    }
    return true;
  }

  btnNext.addEventListener('click', function () {
    if (validate(current)) goTo(current + 1, true);
  });
  btnBack.addEventListener('click', function () { goTo(current - 1, true); });

  wizard.addEventListener('keydown', function (e) {
    // Enter ara adımlarda formu göndermesin, sonraki adıma geçsin
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < steps.length) {
      e.preventDefault();
      btnNext.click();
    }
  });

  wizard.addEventListener('input', function (e) {
    if (e.target.classList) e.target.classList.remove('is-invalid');
    if (current === steps.length) preview.textContent = buildMessage();
    if (current === 1 && e.target.name === 'hizmet') showError('');
  });

  wizard.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(3)) return;
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
    window.open(url, '_blank', 'noopener');
  });

  // Sektör kartlarındaki "teklif al" düğmeleri sihirbazı ön doldurur
  document.querySelectorAll('[data-sector]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sektor = btn.getAttribute('data-sector');
      var services = (btn.getAttribute('data-services') || '').split(',');
      wizard.querySelectorAll('input[name="sektor"]').forEach(function (r) { r.checked = r.value === sektor; });
      wizard.querySelectorAll('input[name="hizmet"]').forEach(function (c) { c.checked = services.indexOf(c.value) !== -1; });
      goTo(1);
      document.getElementById('iletisim').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  goTo(1);

  /* ---------- Yıl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
