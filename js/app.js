// ─── AiNeural App ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll header
  window.addEventListener('scroll', () => {
    document.querySelector('header').style.borderBottomColor =
      window.scrollY > 40 ? 'rgba(255,255,255,0.1)' : 'transparent';
  });

  // Animated counters
  animateCounter('count-projects', 2, 1200);
  animateCounter('count-domains', 9, 1500);
  animateCounter('count-users', 1200, 2000, '+');

  // Neural canvas background
  initNeuralCanvas();
});

function animateCounter(id, target, duration, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], animId;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Create nodes
  for (let i = 0; i < 50; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(129,140,248,${0.12 * (1 - dist / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129,140,248,0.4)';
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  };

  draw();
}
