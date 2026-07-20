/* WebWoven Studios — home.html interactions.
   Minimal, animation-gated, no layout JavaScript (ARCHITECTURE §25/§29).
   Two behaviours only:
     1. Mobile nav toggle (accessible: aria-expanded synced)
     2. Scroll-reveal (fade + slide) — disabled under reduced-motion
*/
(function () {
  'use strict';

  /* Reduced-motion preference — checked once, reused by video + reveal (Part 4) */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile navigation ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Close on link activation (small screens)
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---- Sticky header border on scroll ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------
     Reusable background-video component (Part 4)
       - Sources are configurable: pass `sources` in options, or declare
         them per-element via a `data-hero-sources` JSON attribute.
       - Graceful fallback: if no source is configured or none loads, the
         editorial warm gradient backdrop remains and the video is never
         shown — the hero looks intentional even before a video asset exists.
       - Lazy: the network fetch + playback only begin once the hero nears
         the viewport.
       - Reduced-motion: the video is not loaded; the static backdrop stays.
       - Accessibility: the <video> is aria-hidden in markup; playback is
         muted + playsinline (autoplay-safe) and never traps keyboard focus.
  ---------------------------------------------------------------- */
  function initBackgroundVideo(videoEl, options) {
    if (!videoEl) return;
    var opts = options || {};
    var sources = opts.sources || [];

    // Per-element override takes precedence (kept declarative + configurable).
    var dataAttr = videoEl.getAttribute('data-hero-sources');
    if (dataAttr) {
      try {
        var parsed = JSON.parse(dataAttr);
        if (Array.isArray(parsed)) sources = parsed;
      } catch (e) { /* malformed attr: fall back to options */ }
    }

    // Nothing to play, or motion is reduced — keep the static backdrop only.
    if (sources.length === 0 || opts.reducedMotion) {
      videoEl.classList.add('no-video');
      return;
    }

    var failed = 0;
    var reveal = function () { videoEl.classList.add('is-ready'); };
    var fail = function () {
      videoEl.classList.add('has-error');
      videoEl.classList.remove('is-ready');
    };

    // Inject configurable <source> elements (no hardcoded children in markup).
    sources.forEach(function (s) {
      var node = document.createElement('source');
      node.src = s.src;
      if (s.type) node.type = s.type;
      node.addEventListener('error', function () {
        failed += 1;
        if (failed >= sources.length) fail();
      });
      videoEl.appendChild(node);
    });

    videoEl.addEventListener('canplay', reveal, { once: true });
    videoEl.addEventListener('loadeddata', reveal, { once: true });
    videoEl.addEventListener('error', fail, { once: true });

    var play = function () {
      // Sources were injected dynamically, so force a (re)load before playing.
      try { videoEl.load(); } catch (e) { /* load() is best-effort */ }
      var p = videoEl.play();
      if (p && typeof p.catch === 'function') {
        // Autoplay can be blocked by the browser; poster / first frame remains.
        p.catch(function () {});
      }
    };

    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { play(); vio.disconnect(); }
        });
      }, { threshold: 0.1 });
      vio.observe(videoEl);
    } else {
      play();
    }
  }

  /* Hero video — sources match the reference homepage (Webflow CDN), supplied in
     both mp4 + webm for broad codec support. The component still degrades gracefully
     to the editorial gradient if the asset is ever unreachable. To swap sources, edit
     `sources` (or set data-hero-sources on #heroVideo). */
  initBackgroundVideo(document.getElementById('heroVideo'), {
    reducedMotion: reduce,
    sources: [
      { src: 'https://cdn.prod.website-files.com/660bebc5f638cbe0da9781e1/6617dc41b20d1865fd5bac64_1920-transcode.mp4', type: 'video/mp4' },
      { src: 'https://cdn.prod.website-files.com/660bebc5f638cbe0da9781e1/6617dc41b20d1865fd5bac64_1920-transcode.webm', type: 'video/webm' }
    ]
  });

  /* ---- Scroll reveal (respects reduced-motion) ---- */
  var reveals = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach(function (el) { io.observe(el); });
})();
