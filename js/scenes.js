/* scenes.js — about workstation, timeline constellation, contact network */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = () => Math.min(devicePixelRatio || 1, 2);

  function fit(canvas) {
    const d = DPR(); const r = canvas.getBoundingClientRect();
    canvas.width = r.width * d; canvas.height = r.height * d;
    return { ctx: canvas.getContext('2d'), W: canvas.width, H: canvas.height, d };
  }

  function whenVisible(el, cb) {
    window.onView(el, cb, 0.2);
  }

  /* ---------- ABOUT: figure at monitors ---------- */
  (function scene() {
    const canvas = document.getElementById('scene-canvas');
    if (!canvas) return;
    let s = fit(canvas), t = 0;
    const monitors = [
      { x: 0.10, y: 0.16, w: 0.22, h: 0.30 },
      { x: 0.36, y: 0.10, w: 0.28, h: 0.36 },
      { x: 0.68, y: 0.16, w: 0.22, h: 0.30 },
    ];
    const rows = monitors.map(() => Array.from({ length: 8 }, () => Math.random()));
    function draw() {
      const { ctx, W, H, d } = s;
      ctx.clearRect(0, 0, W, H);
      // ambient glow floor
      const fl = ctx.createLinearGradient(0, H * 0.5, 0, H);
      fl.addColorStop(0, 'rgba(52,227,255,0.05)');
      fl.addColorStop(1, 'rgba(2,4,10,0)');
      ctx.fillStyle = fl; ctx.fillRect(0, H * 0.5, W, H * 0.5);
      // monitors
      monitors.forEach((m, mi) => {
        const x = m.x * W, y = m.y * H, w = m.w * W, h = m.h * H;
        ctx.fillStyle = 'rgba(8,16,34,0.9)';
        ctx.strokeStyle = 'rgba(52,227,255,0.35)';
        ctx.lineWidth = 1.2 * d;
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke();
        // screen glow
        const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, w);
        g.addColorStop(0, 'rgba(52,227,255,0.16)'); g.addColorStop(1, 'rgba(52,227,255,0)');
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
        // code lines
        rows[mi].forEach((r, ri) => {
          const ly = y + 8 * d + ri * (h - 16 * d) / 8;
          const flick = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 2 + ri + mi));
          const lw = (0.3 + r * 0.6) * w * (0.6 + 0.4 * Math.sin(t + ri));
          ctx.fillStyle = `rgba(120,210,255,${0.25 * flick})`;
          ctx.fillRect(x + 8 * d, ly, Math.max(8 * d, lw), 2.4 * d);
        });
      });
      // figure silhouette (head + shoulders)
      const cx = W * 0.5, by = H * 0.98;
      ctx.fillStyle = '#03060e';
      ctx.beginPath();
      ctx.arc(cx, H * 0.60, W * 0.055, 0, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - W * 0.16, by);
      ctx.quadraticCurveTo(cx - W * 0.14, H * 0.66, cx, H * 0.66);
      ctx.quadraticCurveTo(cx + W * 0.14, H * 0.66, cx + W * 0.16, by);
      ctx.closePath(); ctx.fill();
      // rim light
      ctx.strokeStyle = 'rgba(52,227,255,0.5)'; ctx.lineWidth = 1.5 * d;
      ctx.beginPath(); ctx.arc(cx, H * 0.60, W * 0.055, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      t += 0.02;
      if (!reduce) requestAnimationFrame(draw);
    }
    addEventListener('resize', () => { s = fit(canvas); });
    whenVisible(canvas, draw);
  })();

  /* ---------- TIMELINE: constellation path to a flag ---------- */
  (function constellation() {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    let s = fit(canvas);
    // ascending path nodes (left-bottom -> right-top peak)
    const path = [
      [0.12, 0.86], [0.26, 0.74], [0.34, 0.80], [0.46, 0.60],
      [0.55, 0.66], [0.66, 0.44], [0.74, 0.50], [0.84, 0.22],
    ];
    const stars = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, ph: Math.random() * 6 }));
    let prog = 0, t = 0;
    function draw() {
      const { ctx, W, H, d } = s;
      ctx.clearRect(0, 0, W, H);
      // bg stars
      stars.forEach(st => {
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + st.ph));
        ctx.fillStyle = `rgba(180,210,255,${0.5 * tw})`;
        ctx.beginPath(); ctx.arc(st.x * W, st.y * H, st.r * d, 0, 7); ctx.fill();
      });
      prog = Math.min(1, prog + 0.006);
      const seg = (path.length - 1) * prog;
      // line
      ctx.strokeStyle = 'rgba(52,227,255,0.8)'; ctx.lineWidth = 2 * d;
      ctx.shadowColor = 'rgba(52,227,255,0.8)'; ctx.shadowBlur = 10 * d;
      ctx.beginPath();
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i + 1];
        const x0 = a[0] * W, y0 = a[1] * H, x1 = b[0] * W, y1 = b[1] * H;
        if (i + 1 <= seg) { if (i === 0) ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }
        else if (i <= seg) {
          const f = seg - i; if (i === 0) ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f); break;
        }
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      // nodes
      path.forEach((p, i) => {
        if (i > seg + 0.001) return;
        const x = p[0] * W, y = p[1] * H;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 8 * d);
        g.addColorStop(0, 'rgba(150,235,255,0.95)'); g.addColorStop(1, 'rgba(150,235,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8 * d, 0, 7); ctx.fill();
        ctx.fillStyle = '#eafaff'; ctx.beginPath(); ctx.arc(x, y, 2.4 * d, 0, 7); ctx.fill();
      });
      // flag at peak
      if (prog >= 0.999) {
        const peak = path[path.length - 1];
        const x = peak[0] * W, y = peak[1] * H;
        ctx.strokeStyle = 'rgba(244,59,208,0.9)'; ctx.lineWidth = 1.8 * d;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 26 * d); ctx.stroke();
        const wave = Math.sin(t * 3) * 3 * d;
        ctx.fillStyle = 'rgba(244,59,208,0.85)';
        ctx.beginPath(); ctx.moveTo(x, y - 26 * d); ctx.lineTo(x + 16 * d, y - 21 * d + wave); ctx.lineTo(x, y - 16 * d); ctx.closePath(); ctx.fill();
      }
      t += 0.02;
      if (!reduce) requestAnimationFrame(draw);
      else { prog = 1; }
    }
    addEventListener('resize', () => { s = fit(canvas); });
    whenVisible(canvas, draw);
  })();

  /* ---------- CONTACT: wireframe network envelope ---------- */
  (function contactArt() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;
    let s = fit(canvas), t = 0;
    const N = 16;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0012, vy: (Math.random() - 0.5) * 0.0012,
    }));
    function draw() {
      const { ctx, W, H, d } = s;
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0.05 || n.x > 0.95) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 0.32) {
          ctx.strokeStyle = `rgba(244,59,208,${(1 - dist / 0.32) * 0.4})`;
          ctx.lineWidth = d * 0.7;
          ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.stroke();
        }
      }
      // envelope shape overlay
      const ex = W * 0.22, ey = H * 0.30, ew = W * 0.56, eh = H * 0.40;
      ctx.strokeStyle = 'rgba(52,227,255,0.7)'; ctx.lineWidth = 1.6 * d;
      ctx.shadowColor = 'rgba(52,227,255,0.6)'; ctx.shadowBlur = 8 * d;
      ctx.strokeRect(ex, ey, ew, eh);
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + ew / 2, ey + eh * 0.55); ctx.lineTo(ex + ew, ey); ctx.stroke();
      ctx.shadowBlur = 0;
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(180,235,255,0.85)';
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, 1.8 * d, 0, 7); ctx.fill();
      });
      t += 0.02;
      if (!reduce) requestAnimationFrame(draw);
    }
    addEventListener('resize', () => { s = fit(canvas); });
    whenVisible(canvas, draw);
  })();
})();
