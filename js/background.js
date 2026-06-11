/* background.js — fixed starfield + drifting particle network */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, DPR, stars = [], parts = [], shooters = [];
  let scrollY = window.scrollY;

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    build();
  }

  function build() {
    const starCount = Math.round((innerWidth * innerHeight) / 5200);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.3 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));
    const pCount = Math.min(70, Math.round(innerWidth / 18));
    parts = Array.from({ length: pCount }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * DPR,
      vy: (Math.random() - 0.5) * 0.25 * DPR,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function theme() { return document.documentElement.getAttribute('data-theme'); }

  function spawnShooter() {
    if (reduce) return;
    const fromLeft = Math.random() > 0.5;
    shooters.push({
      x: fromLeft ? -50 : W + 50,
      y: Math.random() * H * 0.5,
      vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 4) * DPR,
      vy: (2 + Math.random() * 2) * DPR,
      life: 1,
    });
  }

  let t = 0;
  function frame() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    const light = theme() === 'light';
    const offset = scrollY * 0.06 * DPR;

    // stars (parallax + twinkle)
    for (const s of stars) {
      const y = (s.y - offset * s.z) % H;
      const yy = y < 0 ? y + H : y;
      const tw = 0.55 + Math.sin(t * 2 + s.tw) * 0.45;
      ctx.globalAlpha = (light ? 0.5 : 0.9) * tw * s.z;
      ctx.fillStyle = light ? '#5b7bb0' : '#cfe4ff';
      ctx.beginPath();
      ctx.arc(s.x, yy, s.r * s.z, 0, 7);
      ctx.fill();
    }

    // particle network
    ctx.globalAlpha = 1;
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    }
    const link = 130 * DPR;
    for (let i = 0; i < parts.length; i++) {
      const a = parts[i];
      for (let j = i + 1; j < parts.length; j++) {
        const b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < link) {
          const al = (1 - d / link) * (light ? 0.18 : 0.32);
          ctx.strokeStyle = `rgba(52,227,255,${al})`;
          ctx.lineWidth = DPR * 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = light ? 'rgba(59,130,246,.5)' : 'rgba(120,210,255,.7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r * DPR, 0, 7); ctx.fill();
    }

    // shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 6, sh.y - sh.vy * 6);
      grad.addColorStop(0, `rgba(160,235,255,${sh.life})`);
      grad.addColorStop(1, 'rgba(160,235,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2 * DPR;
      ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 6, sh.y - sh.vy * 6); ctx.stroke();
      if (sh.life <= 0 || sh.x < -100 || sh.x > W + 100) shooters.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }

  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  resize();
  if (!reduce) {
    setInterval(() => { if (Math.random() > 0.55) spawnShooter(); }, 3800);
    requestAnimationFrame(frame);
  } else {
    frame();
  }
})();
