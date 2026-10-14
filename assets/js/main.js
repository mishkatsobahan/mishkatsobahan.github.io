// Volt Dark portfolio — mobile nav, scroll reveal, skill bars, back-to-top, active links
(function () {
  'use strict';

  // Mobile menu
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.textContent = open ? '✕' : '☰';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        burger.textContent = '☰';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll + skill bars
  var revealEls = document.querySelectorAll('.reveal');
  var fills = document.querySelectorAll('.fill');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.querySelectorAll('.fill').forEach(function (f) { f.classList.add('in'); });
          if (e.target.classList.contains('fill')) e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    fills.forEach(function (f) { io.observe(f); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    fills.forEach(function (f) { f.classList.add('in'); });
  }

  // Back to top
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active nav link
  var sections = document.querySelectorAll('section[id]');
  var navAs = document.querySelectorAll('.links a');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navAs.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Preview modal (certificates + gallery photos)
  var modal = document.getElementById('certModal');
  var stage = document.getElementById('modalStage');
  var mClose = document.getElementById('modalClose');
  var mNote = document.getElementById('modalNote');
  var lastFocus = null;
  var NOTE_CERT = 'Original document available on request — contact directly for verified copies.';
  var NOTE_PHOTO = 'Field-work photo — MD. Mishkat Sobahan.';
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  function bindPreview(selector, note) {
    document.querySelectorAll(selector).forEach(function (card) {
    function open() {
      if (!modal || !stage) return;
      lastFocus = document.activeElement;
      stage.innerHTML = '';
      var clone = card.cloneNode(true);
      clone.removeAttribute('tabindex');
      clone.removeAttribute('aria-hidden');
        clone.classList.remove('reveal', 'visible', 'g-hide');
        stage.appendChild(clone);
      if (mNote) mNote.textContent = note;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mClose) mClose.focus();
    }
      card.addEventListener('click', open);
      card.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); }
      });
    });
  }
  bindPreview('.cert', NOTE_CERT);
  bindPreview('.g-photo:not([aria-hidden])', NOTE_PHOTO);
  // Gallery category filter
  document.querySelectorAll('.fbtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.fbtn').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.getAttribute('data-f');
      document.querySelectorAll('.g-photo').forEach(function (item) {
        var show = (f === 'all' || item.getAttribute('data-cat') === f);
        item.classList.toggle('g-hide', !show);
      });
    });
  });
  if (mClose) mClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (ev) { if (ev.target === modal) closeModal(); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeModal(); });

  // Floating background doodles — shuffled into fixed zones so they never touch
  (function doodles() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ICONS = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L5 13 L10 13 L8 22 L17 9 L12 9 L14 2 Z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2 v4 M15 2 v4"/><rect x="7" y="6" width="10" height="8" rx="2"/><path d="M12 14 c0 4 -5 3 -5 8"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M10 15 h4 M10 17.5 h4"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 5 v-3 M12 22 v-3 M5 12 H2 M22 12 h-3 M7 7 L5 5 M19 19 l2 2 M17 7 l2 -2 M7 17 l-2 2"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="1"/><path d="M12 17 v3 M8 21 h8"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="18" rx="4"/><path d="M12 6 v4"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="14" height="8" rx="1"/><circle cx="19" cy="12" r="3"/><path d="M7 16 v5"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 9 v4 M14 9 v4"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="2" width="4" height="8" rx="2" transform="rotate(45 12 12)"/><path d="M13 13 L19 19"/></svg>',
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/></svg>'
    ];
    var ZONES = [];
    [3, 27, 52, 77].forEach(function (x) { [8, 38, 68].forEach(function (y) { ZONES.push([x, y]); }); });
    var DIRS = ['dx', 'dyr', 'dy', 'dxr', 'dxr', 'dy', 'dx', 'dyr', 'dy', 'dxr'];
    for (var i = ZONES.length - 1; i > 0; i--) {
      var k = Math.floor(Math.random() * (i + 1));
      var tmp = ZONES[i]; ZONES[i] = ZONES[k]; ZONES[k] = tmp;
    }
    var layer = document.createElement('div');
    layer.className = 'doodle-layer';
    layer.setAttribute('aria-hidden', 'true');
    ICONS.forEach(function (svg, n) {
      var z = ZONES[n];
      var el = document.createElement('div');
      el.className = 'doodle ' + DIRS[n % DIRS.length];
      el.style.left = z[0] + '%';
      el.style.top = z[1] + '%';
      el.style.animationDuration = (7 + ((n * 37) % 60) / 10) + 's';
      el.style.animationDelay = (-((n * 13) % 70) / 10) + 's';
      el.innerHTML = svg;
      layer.appendChild(el);
    });
    document.body.appendChild(layer);
  })();

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
