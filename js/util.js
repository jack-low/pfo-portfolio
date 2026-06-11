/* util.js — robust in-view detection (works even where IntersectionObserver
   doesn't auto-fire in embedded preview frames). rect-based + scroll/raf. */
(function () {
  const watchers = [];
  window.onView = function (el, cb, ratio) {
    watchers.push({ el, cb, ratio: ratio == null ? 0.15 : ratio, done: false });
  };
  function vh() { return window.innerHeight || document.documentElement.clientHeight; }
  function check() {
    const h = vh();
    for (const w of watchers) {
      if (w.done) continue;
      const r = w.el.getBoundingClientRect();
      if (r.height === 0 && r.width === 0) continue;
      const visible = Math.min(r.bottom, h) - Math.max(r.top, 0);
      const shown = r.top < h * (1 - w.ratio * 0.4) && r.bottom > h * 0.06;
      if (shown || visible > Math.min(r.height, h) * w.ratio) {
        w.done = true;
        w.cb();
      }
    }
  }
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { check(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', () => { check(); setTimeout(check, 100); });
  document.addEventListener('DOMContentLoaded', check);
  // initial + safety sweeps
  check();
  setTimeout(check, 60);
  setTimeout(check, 300);
  window.__viewCheck = check;
})();
